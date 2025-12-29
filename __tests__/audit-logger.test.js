/**
 * Audit Logger Unit Tests
 * Tests logging functionality, statistics, and export features
 */

const fs = require('fs');
const path = require('path');

// Load audit logger code
const auditCode = fs.readFileSync(path.join(__dirname, '../js/audit-logger.js'), 'utf8');

// Mock window object for browser globals
global.window = {
    rbacManager: {
        currentUser: { username: 'testuser', role: 'user' }
    },
    navigator: {
        userAgent: 'Test Browser'
    }
};

// Execute code to define AuditLogger class
eval(auditCode.replace('window.auditLogger = new AuditLogger();', '').replace(/window\.addEventListener.*?\}\);/gs, ''));

describe('AuditLogger', () => {
    let auditLogger;

    beforeEach(() => {
        auditLogger = new AuditLogger();
    });

    describe('Initialization', () => {
        test('should initialize with empty logs array', () => {
            expect(auditLogger.logs).toEqual([]);
        });

        test('should have default maxLogs of 10000', () => {
            expect(auditLogger.maxLogs).toBe(10000);
        });

        test('should generate unique session ID', () => {
            const logger1 = new AuditLogger();
            const logger2 = new AuditLogger();
            expect(logger1.sessionId).not.toBe(logger2.sessionId);
        });

        test('should have storage key for persistence', () => {
            expect(auditLogger.storageKey).toBe('qrip_audit_logs');
        });
    });

    describe('Logging', () => {
        test('should log an action successfully', () => {
            const entry = auditLogger.log('TEST_ACTION', { detail: 'test' });

            expect(entry).toBeDefined();
            expect(entry.action).toBe('TEST_ACTION');
            expect(entry.details).toEqual({ detail: 'test' });
            expect(auditLogger.logs).toHaveLength(1);
        });

        test('should capture timestamp in ISO format', () => {
            const entry = auditLogger.log('TEST');
            expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

        test('should capture current user', () => {
            const entry = auditLogger.log('TEST');
            expect(entry.username).toBe('testuser');
            expect(entry.role).toBe('user');
        });

        test('should use ANONYMOUS when no user logged in', () => {
            global.window.rbacManager = null;
            const entry = auditLogger.log('TEST');
            expect(entry.username).toBe('ANONYMOUS');
            expect(entry.role).toBe('NONE');
        });

        test('should include session ID in log entry', () => {
            const entry = auditLogger.log('TEST');
            expect(entry.sessionId).toBe(auditLogger.sessionId);
        });

        test('should save logs to localStorage', () => {
            localStorage.setItem = jest.fn();
            auditLogger.log('TEST');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'qrip_audit_logs',
                expect.any(String)
            );
        });

        test('should limit logs to maxLogs', () => {
            auditLogger.maxLogs = 5;
            for (let i = 0; i < 10; i++) {
                auditLogger.log(`ACTION_${i}`);
            }
            expect(auditLogger.logs).toHaveLength(5);
        });
    });

    describe('Querying Logs', () => {
        beforeEach(() => {
            auditLogger.log('LOGIN', { user: 'user1' });
            auditLogger.log('MODULE_ACCESS', { module: 5 });
            auditLogger.log('LOGIN', { user: 'user2' });
            auditLogger.log('LOGOUT');
        });

        test('should get all logs', () => {
            const logs = auditLogger.getAllLogs();
            expect(logs).toHaveLength(4);
        });

        test('should filter logs by action', () => {
            const loginLogs = auditLogger.getLogsByAction('LOGIN');
            expect(loginLogs).toHaveLength(2);
            expect(loginLogs[0].action).toBe('LOGIN');
        });

        test('should filter logs by user', () => {
            const userLogs = auditLogger.getLogsByUser('testuser');
            expect(userLogs).toHaveLength(4);
        });

        test('should get recent logs', () => {
            const recent = auditLogger.getRecentLogs(2);
            expect(recent).toHaveLength(2);
            expect(recent[0].action).toBe('LOGOUT'); // Most recent first
        });

        test('should filter logs by date range', () => {
            const now = new Date();
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            const logs = auditLogger.getLogsByDateRange(yesterday, tomorrow);
            expect(logs).toHaveLength(4);
        });
    });

    describe('Statistics', () => {
        beforeEach(() => {
            global.window.rbacManager = {
                currentUser: { username: 'user1', role: 'user' }
            };
            auditLogger.log('LOGIN');
            auditLogger.log('MODULE_ACCESS');

            global.window.rbacManager.currentUser = { username: 'user2', role: 'admin' };
            auditLogger.log('LOGIN');
            auditLogger.log('USER_CREATED');
        });

        test('should calculate total logs', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.totalLogs).toBe(4);
        });

        test('should count unique users', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.uniqueUsers).toBe(2);
        });

        test('should count unique sessions', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.uniqueSessions).toBe(1);
        });

        test('should break down actions', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.actionBreakdown.LOGIN).toBe(2);
            expect(stats.actionBreakdown.MODULE_ACCESS).toBe(1);
            expect(stats.actionBreakdown.USER_CREATED).toBe(1);
        });

        test('should break down by user', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.userBreakdown.user1).toBe(2);
            expect(stats.userBreakdown.user2).toBe(2);
        });

        test('should break down by role', () => {
            const stats = auditLogger.getStatistics();
            expect(stats.roleBreakdown.user).toBe(2);
            expect(stats.roleBreakdown.admin).toBe(2);
        });
    });

    describe('Export', () => {
        beforeEach(() => {
            auditLogger.log('ACTION1', { data: 'test1' });
            auditLogger.log('ACTION2', { data: 'test2' });
        });

        test('should export logs as JSON', () => {
            const json = auditLogger.exportLogs('json');
            expect(json).toContain('ACTION1');
            expect(json).toContain('ACTION2');
            const parsed = JSON.parse(json);
            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed).toHaveLength(2);
        });

        test('should export logs as CSV', () => {
            const csv = auditLogger.exportLogs('csv');
            expect(csv).toContain('Timestamp,Session ID,Username');
            expect(csv).toContain('ACTION1');
            expect(csv).toContain('ACTION2');
            const lines = csv.split('\n');
            expect(lines.length).toBeGreaterThan(2);
        });
    });

    describe('Clear Logs', () => {
        test('should clear all logs', () => {
            auditLogger.log('TEST1');
            auditLogger.log('TEST2');
            expect(auditLogger.logs).toHaveLength(2);

            auditLogger.clearLogs();
            expect(auditLogger.logs).toHaveLength(0);
        });

        test('should save empty logs to localStorage when cleared', () => {
            localStorage.setItem = jest.fn();
            auditLogger.log('TEST');
            auditLogger.clearLogs();
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'qrip_audit_logs',
                '[]'
            );
        });
    });
});
