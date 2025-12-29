/**
 * RBAC Manager Unit Tests
 * Tests authentication, authorization, and role management
 */

// Load the RBAC module
const fs = require('fs');
const path = require('path');
const rbacCode = fs.readFileSync(path.join(__dirname, '../js/rbac.js'), 'utf8');

// Execute the RBAC code to define the RBACManager class
eval(rbacCode.replace('window.rbacManager = new RBACManager();', ''));

describe('RBACManager', () => {
    let rbacManager;

    beforeEach(() => {
        rbacManager = new RBACManager();
    });

    describe('Initialization', () => {
        test('should initialize with no current user', () => {
            expect(rbacManager.currentUser).toBeNull();
        });

        test('should have 4 role definitions', () => {
            expect(Object.keys(rbacManager.roles)).toHaveLength(4);
            expect(rbacManager.roles).toHaveProperty('user');
            expect(rbacManager.roles).toHaveProperty('data');
            expect(rbacManager.roles).toHaveProperty('admin');
            expect(rbacManager.roles).toHaveProperty('superadmin');
        });

        test('should have 4 test users', () => {
            expect(Object.keys(rbacManager.users)).toHaveLength(4);
        });
    });

    describe('Authentication', () => {
        test('should login with valid user credentials', () => {
            const result = rbacManager.login('user', 'user123', 'user');
            expect(result.success).toBe(true);
            expect(rbacManager.currentUser).toBeDefined();
            expect(rbacManager.currentUser.username).toBe('user');
        });

        test('should login with valid data analyst credentials', () => {
            const result = rbacManager.login('data', 'data123', 'data');
            expect(result.success).toBe(true);
            expect(rbacManager.currentUser.role).toBe('data');
        });

        test('should login with valid admin credentials', () => {
            const result = rbacManager.login('admin', 'admin123', 'admin');
            expect(result.success).toBe(true);
            expect(rbacManager.currentUser.role).toBe('admin');
        });

        test('should login with valid superadmin credentials', () => {
            const result = rbacManager.login('superadmin', 'super123', 'superadmin');
            expect(result.success).toBe(true);
            expect(rbacManager.currentUser.role).toBe('superadmin');
        });

        test('should reject login with invalid username', () => {
            const result = rbacManager.login('invalid', 'password', 'user');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials');
            expect(rbacManager.currentUser).toBeNull();
        });

        test('should reject login with invalid password', () => {
            const result = rbacManager.login('user', 'wrongpassword', 'user');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials');
        });

        test('should reject login with role mismatch', () => {
            const result = rbacManager.login('user', 'user123', 'admin');
            expect(result.success).toBe(false);
            expect(result.message).toBe('Role mismatch');
        });

        test('should store session in sessionStorage on successful login', () => {
            sessionStorage.setItem = jest.fn();
            rbacManager.login('user', 'user123', 'user');
            expect(sessionStorage.setItem).toHaveBeenCalledWith(
                'qrip_user',
                expect.any(String)
            );
        });
    });

    describe('Authorization', () => {
        test('user role should have access to 7 modules', () => {
            rbacManager.login('user', 'user123', 'user');
            const modules = rbacManager.getAccessibleModules();
            expect(modules).toHaveLength(7);
            expect(modules).toContain(1);
            expect(modules).toContain(29);
        });

        test('data analyst should have access to 17 modules', () => {
            rbacManager.login('data', 'data123', 'data');
            const modules = rbacManager.getAccessibleModules();
            expect(modules).toHaveLength(17);
        });

        test('admin should have access to 23 modules', () => {
            rbacManager.login('admin', 'admin123', 'admin');
            const modules = rbacManager.getAccessibleModules();
            expect(modules).toHaveLength(23);
        });

        test('superadmin should have access to all 29 modules', () => {
            rbacManager.login('superadmin', 'super123', 'superadmin');
            const modules = rbacManager.getAccessibleModules();
            expect(modules).toHaveLength(29);
        });

        test('should correctly check module access for user', () => {
            rbacManager.login('user', 'user123', 'user');
            expect(rbacManager.hasModuleAccess(1)).toBe(true);
            expect(rbacManager.hasModuleAccess(29)).toBe(true);
            expect(rbacManager.hasModuleAccess(27)).toBe(false); // Admin module
        });

        test('should deny all module access when not logged in', () => {
            expect(rbacManager.hasModuleAccess(1)).toBe(false);
            expect(rbacManager.hasModuleAccess(29)).toBe(false);
        });
    });

    describe('Role Management', () => {
        test('should return correct role information for user', () => {
            rbacManager.login('user', 'user123', 'user');
            const role = rbacManager.getCurrentRole();
            expect(role.name).toBe('User');
            expect(role.level).toBe(1);
            expect(role.color).toBe('#00d4ff');
        });

        test('should return correct role information for superadmin', () => {
            rbacManager.login('superadmin', 'super123', 'superadmin');
            const role = rbacManager.getCurrentRole();
            expect(role.name).toBe('Super Administrator');
            expect(role.level).toBe(4);
            expect(role.color).toBe('#ff3366');
        });

        test('should return null for getCurrentRole when not logged in', () => {
            const role = rbacManager.getCurrentRole();
            expect(role).toBeNull();
        });

        test('should return current user object', () => {
            rbacManager.login('user', 'user123', 'user');
            const user = rbacManager.getCurrentUser();
            expect(user.username).toBe('user');
            expect(user.role).toBe('user');
        });
    });

    describe('Logout', () => {
        test('should clear current user on logout', () => {
            rbacManager.login('user', 'user123', 'user');
            expect(rbacManager.currentUser).toBeDefined();

            rbacManager.logout();
            expect(rbacManager.currentUser).toBeNull();
        });

        test('should clear sessionStorage on logout', () => {
            sessionStorage.removeItem = jest.fn();
            rbacManager.login('user', 'user123', 'user');
            rbacManager.logout();
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('qrip_user');
        });
    });

    describe('Session Restoration', () => {
        test('should restore session from sessionStorage', () => {
            const userData = {
                username: 'user',
                role: 'user',
                timestamp: new Date().toISOString()
            };
            sessionStorage.getItem = jest.fn(() => JSON.stringify(userData));

            const result = rbacManager.restoreSession();
            expect(result).toBe(true);
            expect(rbacManager.currentUser).toBeDefined();
            expect(rbacManager.currentUser.username).toBe('user');
        });

        test('should return false when no session exists', () => {
            sessionStorage.getItem = jest.fn(() => null);
            const result = rbacManager.restoreSession();
            expect(result).toBe(false);
            expect(rbacManager.currentUser).toBeNull();
        });
    });
});
