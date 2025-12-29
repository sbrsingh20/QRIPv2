/**
 * BUG REPORTING SYSTEM
 * Enterprise-grade error tracking and reporting
 * 
 * Features:
 * - Global error handler (catches all JS errors)
 * - Unhandled promise rejection handler
 * - Manual bug reporting API
 * - Stack trace capture
 * - Browser environment info
 * - localStorage persistence
 * - Export to JSON/CSV
 */

class BugReporter {
    constructor() {
        this.bugs = [];
        this.maxBugs = 1000;
        this.storageKey = 'qrip_bug_reports';
        this.sessionId = this.generateSessionId();

        this.loadBugs();
        this.setupGlobalHandlers();

        console.log('[BUG REPORTER] Initialized. Session:', this.sessionId);
    }

    generateSessionId() {
        return 'BUG_SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupGlobalHandlers() {
        // Catch all JavaScript errors
        window.addEventListener('error', (event) => {
            this.reportBug({
                type: 'JS_ERROR',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                severity: 'ERROR'
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportBug({
                type: 'UNHANDLED_REJECTION',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                severity: 'ERROR'
            });
        });

        // Catch console errors (intercept)
        const originalError = console.error;
        console.error = (...args) => {
            this.reportBug({
                type: 'CONSOLE_ERROR',
                message: args.join(' '),
                severity: 'WARNING'
            });
            originalError.apply(console, args);
        };
    }

    reportBug(bugData) {
        const currentUser = window.rbacManager?.currentUser;

        const bugEntry = {
            id: 'BUG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,

            // Bug details
            type: bugData.type || 'UNKNOWN',
            severity: bugData.severity || 'INFO',
            message: bugData.message || 'No message',
            stack: bugData.stack || '',
            source: bugData.source || '',
            line: bugData.line || 0,
            column: bugData.column || 0,
            details: bugData.details || {},

            // User context
            username: currentUser?.username || 'ANONYMOUS',
            role: currentUser?.role || 'NONE',

            // Environment
            url: window.location.href,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,

            // Performance
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };

        this.bugs.push(bugEntry);

        // Keep only recent bugs
        if (this.bugs.length > this.maxBugs) {
            this.bugs = this.bugs.slice(-this.maxBugs);
        }

        this.saveBugs();

        // Log to console in development
        console.error('[BUG REPORT]', bugEntry);

        // Log to audit system if available
        if (window.auditLogger) {
            window.auditLogger.log('BUG_REPORTED', {
                bugId: bugEntry.id,
                type: bugEntry.type,
                severity: bugEntry.severity
            });
        }

        return bugEntry;
    }

    // Manual bug reporting (user-initiated)
    reportManualBug(description, category = 'USER_REPORTED', severity = 'INFO') {
        return this.reportBug({
            type: category,
            message: description,
            severity: severity,
            details: { manual: true }
        });
    }

    saveBugs() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.bugs));
        } catch (e) {
            console.error('[BUG REPORTER] Failed to save bugs:', e);
            // If localStorage full, remove oldest half
            this.bugs = this.bugs.slice(Math.floor(this.bugs.length / 2));
            localStorage.setItem(this.storageKey, JSON.stringify(this.bugs));
        }
    }

    loadBugs() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.bugs = JSON.parse(stored);
                console.log(`[BUG REPORTER] Loaded ${this.bugs.length} historical bug reports`);
            }
        } catch (e) {
            console.error('[BUG REPORTER] Failed to load bugs:', e);
            this.bugs = [];
        }
    }

    getAllBugs() {
        return [...this.bugs]; // Return copy
    }

    getBugsByType(type) {
        return this.bugs.filter(bug => bug.type === type);
    }

    getBugsBySeverity(severity) {
        return this.bugs.filter(bug => bug.severity === severity);
    }

    getBugsByDateRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return this.bugs.filter(bug => {
            const bugTime = new Date(bug.timestamp).getTime();
            return bugTime >= start && bugTime <= end;
        });
    }

    getRecentBugs(count = 50) {
        return this.bugs.slice(-count).reverse();
    }

    exportBugs(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.bugs, null, 2);
        } else if (format === 'csv') {
            let csv = 'ID,Timestamp,Type,Severity,Message,Source,User,URL\\n';
            this.bugs.forEach(bug => {
                csv += `"${bug.id}","${bug.timestamp}","${bug.type}","${bug.severity}","${bug.message.replace(/"/g, '""')}","${bug.source}","${bug.username}","${bug.url}"\\n`;
            });
            return csv;
        }
    }

    downloadBugs(format = 'json') {
        const data = this.exportBugs(format);
        const blob = new Blob([data], {
            type: format === 'json' ? 'application/json' : 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrip_bug_reports_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearBugs() {
        this.bugs = [];
        this.saveBugs();
        console.log('[BUG REPORTER] All bug reports cleared');
    }

    getStatistics() {
        const stats = {
            totalBugs: this.bugs.length,
            byType: {},
            bySeverity: {},
            byUser: {},
            recentBugs: this.getRecentBugs(10),
            topErrors: {}
        };

        this.bugs.forEach(bug => {
            // Count by type
            stats.byType[bug.type] = (stats.byType[bug.type] || 0) + 1;

            // Count by severity
            stats.bySeverity[bug.severity] = (stats.bySeverity[bug.severity] || 0) + 1;

            // Count by user
            stats.byUser[bug.username] = (stats.byUser[bug.username] || 0) + 1;

            // Top error messages
            const msgKey = bug.message.substring(0, 100);
            stats.topErrors[msgKey] = (stats.topErrors[msgKey] || 0) + 1;
        });

        return stats;
    }

    // Test error reporting (for development)
    testErrorReporting() {
        console.log('[BUG REPORTER] Testing error capture...');

        // Test 1: Throw error
        setTimeout(() => {
            try {
                throw new Error('TEST ERROR: This is a test bug report');
            } catch (e) {
                this.reportBug({
                    type: 'TEST_ERROR',
                    message: e.message,
                    stack: e.stack,
                    severity: 'INFO',
                    details: { test: true }
                });
            }
        }, 100);

        // Test 2: Unhandled rejection
        setTimeout(() => {
            Promise.reject(new Error('TEST REJECTION: Unhandled promise test'));
        }, 200);

        console.log('[BUG REPORTER] Test errors generated. Check bug viewer.');
    }
}

// Create global instance
window.bugReporter = new BugReporter();

// Auto-log initialization
window.addEventListener('DOMContentLoaded', () => {
    window.bugReporter.reportBug({
        type: 'SYSTEM_INIT',
        message: 'Bug reporter initialized',
        severity: 'INFO',
        details: { page: window.location.pathname }
    });
});

// Log page unload
window.addEventListener('beforeunload', () => {
    window.bugReporter.reportBug({
        type: 'SYSTEM_EXIT',
        message: 'User leaving page',
        severity: 'INFO'
    });
});
