/**
 * AUDIT LOGGING SYSTEM
 * Tracks all user actions for security and compliance
 */

class AuditLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 10000; // Maximum logs to store
        this.storageKey = 'qrip_audit_logs';
        this.sessionId = this.generateSessionId();
        this.loadLogs();
        console.log('[AUDIT] Audit Logger initialized. Session:', this.sessionId);
    }

    generateSessionId() {
        return 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    log(action, details = {}) {
        const currentUser = window.rbacManager?.currentUser;

        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            username: currentUser?.username || 'ANONYMOUS',
            role: currentUser?.role || 'NONE',
            action: action,
            details: details,
            ip: 'SIMULATED_IP', // In real system, would get actual IP
            userAgent: navigator.userAgent
        };

        this.logs.push(logEntry);

        // Keep only recent logs to prevent memory issues
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        this.saveLogs();

        // Log to console in dev mode
        console.log('[AUDIT]', action, details);

        return logEntry;
    }

    saveLogs() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
        } catch (e) {
            console.error('[AUDIT] Failed to save logs:', e);
            // If localStorage is full, remove oldest half
            this.logs = this.logs.slice(Math.floor(this.logs.length / 2));
            localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
        }
    }

    loadLogs() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.logs = JSON.parse(stored);
                console.log(`[AUDIT] Loaded ${this.logs.length} historical logs`);
            }
        } catch (e) {
            console.error('[AUDIT] Failed to load logs:', e);
            this.logs = [];
        }
    }

    getAllLogs() {
        return [...this.logs]; // Return copy
    }

    getLogsByUser(username) {
        return this.logs.filter(log => log.username === username);
    }

    getLogsByAction(action) {
        return this.logs.filter(log => log.action === action);
    }

    getLogsByDateRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return this.logs.filter(log => {
            const logTime = new Date(log.timestamp).getTime();
            return logTime >= start && logTime <= end;
        });
    }

    getRecentLogs(count = 100) {
        return this.logs.slice(-count).reverse();
    }

    exportLogs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.logs, null, 2);
        } else if (format === 'csv') {
            let csv = 'Timestamp,Session ID,Username,Role,Action,Details\n';
            this.logs.forEach(log => {
                csv += `"${log.timestamp}","${log.sessionId}","${log.username}","${log.role}","${log.action}","${JSON.stringify(log.details).replace(/"/g, '""')}"\n`;
            });
            return csv;
        }
    }

    downloadLogs(format = 'json') {
        const data = this.exportLogs(format);
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrip_audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearLogs() {
        this.logs = [];
        this.saveLogs();
        console.log('[AUDIT] All logs cleared');
    }

    getStatistics() {
        const stats = {
            totalLogs: this.logs.length,
            uniqueUsers: new Set(this.logs.map(l => l.username)).size,
            uniqueSessions: new Set(this.logs.map(l => l.sessionId)).size,
            actionBreakdown: {},
            userBreakdown: {},
            roleBreakdown: {},
            recentActivity: this.getRecentLogs(10)
        };

        this.logs.forEach(log => {
            // Count actions
            stats.actionBreakdown[log.action] = (stats.actionBreakdown[log.action] || 0) + 1;
            // Count users
            stats.userBreakdown[log.username] = (stats.userBreakdown[log.username] || 0) + 1;
            // Count roles
            stats.roleBreakdown[log.role] = (stats.roleBreakdown[log.role] || 0) + 1;
        });

        return stats;
    }
}

// Create global instance
window.auditLogger = new AuditLogger();

// Auto-log key events
document.addEventListener('DOMContentLoaded', () => {
    window.auditLogger.log('SYSTEM_START', { page: window.location.pathname });
});

window.addEventListener('beforeunload', () => {
    window.auditLogger.log('SYSTEM_EXIT', { duration: Date.now() });
});
