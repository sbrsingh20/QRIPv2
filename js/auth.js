class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;

        // Role Definitions
        this.roles = {
            'operator': {
                name: 'Radar Operator',
                clearance: 'SECRET',
                permissions: ['operational-view', 'signal-view', 'fleet-view']
            },
            'planner': {
                name: 'Mission Planner',
                clearance: 'TOP SECRET',
                permissions: ['mission-view', 'fleet-view', 'twin-view']
            },
            'analyst': {
                name: 'Intelligence Analyst',
                clearance: 'TOP SECRET',
                permissions: ['post-analysis-view', 'twin-view', 'signal-view']
            },
            'admin': {
                name: 'System Administrator',
                clearance: 'COSMIC TOP SECRET',
                permissions: ['operational-view', 'signal-view', 'mission-view', 'calibration-view', 'twin-view', 'fleet-view', 'post-analysis-view']
            }
        };

        // Mock Credentials (In production, this would be a secure backend)
        this.users = {
            'operator': 'radar123',
            'planner': 'stratcom',
            'analyst': 'intel',
            'admin': 'admin'
        };
    }

    login(username, password) {
        if (this.users[username] && this.users[username] === password) {
            this.currentUser = {
                username: username,
                role: username,
                details: this.roles[username],
                loginTime: new Date().toISOString()
            };
            this.isAuthenticated = true;

            // Store in sessionStorage for cross-page access
            sessionStorage.setItem('qrip_current_user', JSON.stringify(this.currentUser));

            console.log(`🔐 Login Successful: ${username.toUpperCase()} (${this.roles[username].clearance})`);
            return { success: true, user: this.currentUser };
        }
        console.warn(`🛑 Login Failed: Invalid credentials for ${username}`);
        return { success: false, message: 'Invalid Credentials' };
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        sessionStorage.removeItem('qrip_current_user');
        console.log('🔓 User Logged Out');
        window.location.reload();
    }

    hasPermission(viewId) {
        if (!this.isAuthenticated || !this.currentUser) return false;
        return this.currentUser.details.permissions.includes(viewId);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Restore session from storage
    restoreSession() {
        try {
            const stored = sessionStorage.getItem('qrip_current_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
                this.isAuthenticated = true;
                console.log(`[AUTH] Session restored for: ${this.currentUser.username}`);
                return true;
            }
        } catch (e) {
            console.error('[AUTH] Failed to restore session:', e);
        }
        return false;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
