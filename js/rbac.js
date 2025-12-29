/**
 * ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM
 * 4 User Levels: User, Data, Admin, Super Admin
 */

class RBACManager {
    constructor() {
        this.currentUser = null;
        this.roles = {
            user: {
                name: 'User',
                level: 1,
                color: '#00d4ff',
                allowedModules: [1, 2, 3, 15, 17, 18, 29], // View-only modules
                description: 'Basic viewing and monitoring access'
            },
            data: {
                name: 'Data Analyst',
                level: 2,
                color: '#ffcc00',
                allowedModules: [1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 24, 25, 26, 29], // Analytics modules
                description: 'Analysis and intelligence access'
            },
            admin: {
                name: 'Administrator',
                level: 3,
                color: '#00ff88',
                allowedModules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 27, 28, 29], // Operational control
                description: 'Operational control and configuration'
            },
            superadmin: {
                name: 'Super Administrator',
                level: 4,
                color: '#ff3366',
                allowedModules: Array.from({ length: 29 }, (_, i) => i + 1), // ALL modules
                description: 'Full system access - All modules'
            }
        };

        this.users = {
            'user': { password: 'user123', role: 'user' },
            'data': { password: 'data123', role: 'data' },
            'admin': { password: 'admin123', role: 'admin' },
            'superadmin': { password: 'super123', role: 'superadmin' }
        };
    }

    login(username, password, role) {
        const user = this.users[username.toLowerCase()];

        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Invalid credentials' };
        }

        if (user.role !== role) {
            return { success: false, message: 'Role mismatch' };
        }

        this.currentUser = {
            username: username,
            role: role,
            roleData: this.roles[role],
            loginTime: new Date()
        };

        // Store in session
        sessionStorage.setItem('qrip_user', JSON.stringify(this.currentUser));

        return {
            success: true,
            message: `Welcome, ${this.roles[role].name}`,
            user: this.currentUser
        };
    }

    hasModuleAccess(moduleId) {
        if (!this.currentUser) return false;
        return this.currentUser.roleData.allowedModules.includes(moduleId);
    }

    getAccessibleModules() {
        if (!this.currentUser) return [];
        return this.currentUser.roleData.allowedModules;
    }

    getCurrentRole() {
        return this.currentUser ? this.currentUser.roleData : null;
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('qrip_user');
    }

    // Restore session
    restoreSession() {
        const stored = sessionStorage.getItem('qrip_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return true;
        }
        return false;
    }
}

// Global instance
window.rbacManager = new RBACManager();
