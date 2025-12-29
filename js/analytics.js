// Real-time Analytics Engine
class AnalyticsEngine {
    constructor() {
        this.systemMetrics = {
            quantumCorrelation: 0.94,
            sensorArrays: 24,
            activeScans: 8,
            processedSignals: 0,
            uptime: 0,
            contactsDetected: 0,
            contactsNeutralized: 0
        };

        this.startTime = Date.now();
    }

    updateMetrics(detectionSystem, inventorySystem) {
        // Update contact-based metrics
        const stats = detectionSystem.getContactStats();
        this.systemMetrics.contactsDetected = stats.total;
        this.systemMetrics.activeScans = Math.floor(Math.random() * 3) + 6; // Simulate 6-9 scans

        // Update processed signals (incremental)
        this.systemMetrics.processedSignals += Math.floor(Math.random() * 50) + 20;

        // Update quantum correlation (slight fluctuation)
        this.systemMetrics.quantumCorrelation = Math.max(
            0.85,
            Math.min(0.99, this.systemMetrics.quantumCorrelation + (Math.random() - 0.5) * 0.02)
        );

        // Update uptime
        const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        this.systemMetrics.uptime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return this.systemMetrics;
    }

    renderMetrics(containerId, detectionSystem, inventorySystem) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const metrics = this.updateMetrics(detectionSystem, inventorySystem);
        const contactStats = detectionSystem.getContactStats();
        const inventoryStats = inventorySystem.getInventoryStats();

        container.innerHTML = `
            <div class="metric-card">
                <div class="metric-label">Quantum Correlation</div>
                <div class="metric-value">${(metrics.quantumCorrelation * 100).toFixed(1)}<span class="metric-unit">%</span></div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Active Contacts</div>
                <div class="metric-value ${contactStats.hostile > 0 ? 'text-danger' : ''}">${contactStats.total}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Hostile Threats</div>
                <div class="metric-value text-danger">${contactStats.hostile}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Sensor Arrays</div>
                <div class="metric-value">${metrics.sensorArrays}<span class="metric-unit">/25</span></div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Active Scans</div>
                <div class="metric-value text-success">${metrics.activeScans}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Signals Processed</div>
                <div class="metric-value">${metrics.processedSignals.toLocaleString()}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Resource Readiness</div>
                <div class="metric-value text-success">${inventoryStats.readiness}<span class="metric-unit">%</span></div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">System Uptime</div>
                <div class="metric-value" style="font-size: 1.5rem">${metrics.uptime}</div>
            </div>
        `;
    }

    generateContactTrend() {
        // Could be used for charts/graphs
        return {
            labels: ['1h ago', '45m', '30m', '15m', 'Now'],
            data: [3, 5, 7, 6, this.systemMetrics.contactsDetected]
        };
    }

    calculateSystemHealth() {
        const health = {
            quantum: this.systemMetrics.quantumCorrelation * 100,
            sensors: (this.systemMetrics.sensorArrays / 25) * 100,
            overall: 0
        };

        health.overall = (health.quantum * 0.6 + health.sensors * 0.4);

        return {
            percentage: health.overall.toFixed(1),
            status: health.overall > 90 ? 'Optimal' : health.overall > 70 ? 'Good' : health.overall > 50 ? 'Fair' : 'Critical'
        };
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsEngine;
}
