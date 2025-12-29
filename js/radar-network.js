// Distributed Radar Network Architecture
class RadarNetwork {
    constructor() {
        this.nodes = [];
        this.nodeIdCounter = 1;
        this.masterNode = null;
        this.networkTopology = 'hierarchical';
        this.coverageMap = null;

        this.initialize();
    }

    initialize() {
        console.log('📡 Initializing Distributed Radar Network...');
        this.createNetworkTopology();
        this.calculateCoverageMap();
        console.log(`✅ Network initialized with ${this.nodes.length} nodes`);
    }

    createNetworkTopology() {
        // Long-range nodes (1000-10000km) - Early Warning
        this.createNodes('long-range', 4, {
            minRange: 1000,
            maxRange: 10000,
            updateRate: 10, // seconds
            reliability: 0.95,
            location: 'strategic'
        });

        // Medium-range nodes (100-1000km) - Regional Defense
        this.createNodes('medium-range', 10, {
            minRange: 100,
            maxRange: 1000,
            updateRate: 3, // seconds
            reliability: 0.92,
            location: 'regional'
        });

        // Short-range nodes (1-100km) - Tactical Defense
        this.createNodes('short-range', 15, {
            minRange: 1,
            maxRange: 100,
            updateRate: 1, // seconds
            reliability: 0.90,
            location: 'tactical'
        });

        // Set master fusion node
        this.masterNode = this.nodes[0];
        this.masterNode.isMaster = true;
    }

    createNodes(type, count, config) {
        const typePrefix = type === 'long-range' ? 'LR' :
            type === 'medium-range' ? 'MR' : 'SR';

        for (let i = 0; i < count; i++) {
            const node = {
                id: `${typePrefix}-${String(this.nodeIdCounter++).padStart(2, '0')}`,
                type: type,
                status: Math.random() > 0.05 ? 'online' : 'degraded', // 95% online
                config: config,

                // Geographic positioning (simulated)
                location: {
                    lat: (Math.random() - 0.5) * 180,
                    lon: (Math.random() - 0.5) * 360,
                    elevation: Math.floor(Math.random() * 500)
                },

                // Performance metrics
                metrics: {
                    cpuLoad: Math.random() * 100,
                    signalQuality: 70 + Math.random() * 30,
                    contactsTracked: 0,
                    uptime: Math.random() * 86400, // seconds
                    lastUpdate: new Date(),
                    dataRate: Math.floor(Math.random() * 1000) + 500 // KB/s
                },

                // Contacts detected by this node
                localContacts: [],

                // Failure simulation
                failureProbability: 0.02,
                isMaster: false
            };

            this.nodes.push(node);
        }
    }

    // Distribute contacts to nodes based on range
    distributeContactsToNodes(contacts) {
        // Clear previous assignments
        this.nodes.forEach(node => node.localContacts = []);

        contacts.forEach(contact => {
            // Find all nodes that can detect this contact
            const detectingNodes = this.nodes.filter(node => {
                if (node.status === 'offline') return false;

                const inRange = contact.distance >= node.config.minRange &&
                    contact.distance <= node.config.maxRange;

                // Detection probability based on distance and node quality
                const detectionProb = node.metrics.signalQuality / 100 *
                    (1 - contact.distance / node.config.maxRange);

                return inRange && Math.random() < detectionProb;
            });

            // Add contact to detecting nodes
            detectingNodes.forEach(node => {
                // Add some noise based on distance and node quality
                const noisyContact = this.addMeasurementNoise(contact, node);
                node.localContacts.push(noisyContact);
            });
        });

        // Update node metrics
        this.nodes.forEach(node => {
            node.metrics.contactsTracked = node.localContacts.length;
            node.metrics.lastUpdate = new Date();
        });
    }

    addMeasurementNoise(contact, node) {
        const noiseLevel = (1 - node.metrics.signalQuality / 100) * 0.1;

        return {
            ...contact,
            distance: contact.distance * (1 + (Math.random() - 0.5) * noiseLevel),
            bearing: (contact.bearing + (Math.random() - 0.5) * noiseLevel * 10) % 360,
            rcs: contact.rcs * (1 + (Math.random() - 0.5) * noiseLevel * 0.5),
            sourceNode: node.id,
            measurementQuality: node.metrics.signalQuality / 100
        };
    }

    // Simulate node failures
    simulateNodeFailures() {
        this.nodes.forEach(node => {
            if (node.isMaster) return; // Master node never fails

            if (Math.random() < node.failureProbability) {
                if (node.status === 'online') {
                    node.status = 'degraded';
                    console.log(`⚠️ Node ${node.id} degraded`);
                } else if (node.status === 'degraded' && Math.random() < 0.3) {
                    node.status = 'offline';
                    console.log(`🔴 Node ${node.id} offline`);
                }
            } else {
                // Recovery
                if (node.status === 'degraded' && Math.random() < 0.4) {
                    node.status = 'online';
                    console.log(`✅ Node ${node.id} recovered`);
                } else if (node.status === 'offline' && Math.random() < 0.1) {
                    node.status = 'degraded';
                    console.log(`🟡 Node ${node.id} partially recovered`);
                }
            }
        });
    }

    // Update node performance metrics
    updateNodeMetrics() {
        this.nodes.forEach(node => {
            // Simulate CPU load fluctuation
            node.metrics.cpuLoad = Math.max(10, Math.min(100,
                node.metrics.cpuLoad + (Math.random() - 0.5) * 20
            ));

            // Signal quality degradation based on status
            if (node.status === 'online') {
                node.metrics.signalQuality = Math.max(70, Math.min(100,
                    node.metrics.signalQuality + (Math.random() - 0.3) * 5
                ));
            } else if (node.status === 'degraded') {
                node.metrics.signalQuality = Math.max(30, Math.min(70,
                    node.metrics.signalQuality + (Math.random() - 0.5) * 10
                ));
            } else {
                node.metrics.signalQuality = 0;
            }

            // Increment uptime
            if (node.status !== 'offline') {
                node.metrics.uptime += 3; // 3 seconds elapsed
            }
        });
    }

    calculateCoverageMap() {
        // Calculate network coverage statistics
        const onlineNodes = this.nodes.filter(n => n.status === 'online');

        this.coverageMap = {
            totalNodes: this.nodes.length,
            onlineNodes: onlineNodes.length,
            degradedNodes: this.nodes.filter(n => n.status === 'degraded').length,
            offlineNodes: this.nodes.filter(n => n.status === 'offline').length,
            coverage: (onlineNodes.length / this.nodes.length * 100).toFixed(1),

            rangeTypes: {
                longRange: this.nodes.filter(n => n.type === 'long-range' && n.status === 'online').length,
                mediumRange: this.nodes.filter(n => n.type === 'medium-range' && n.status === 'online').length,
                shortRange: this.nodes.filter(n => n.type === 'short-range' && n.status === 'online').length
            },

            totalCoverage: {
                tactical: this.nodes.filter(n => n.type === 'short-range' && n.status === 'online').length /
                    this.nodes.filter(n => n.type === 'short-range').length * 100,
                regional: this.nodes.filter(n => n.type === 'medium-range' && n.status === 'online').length /
                    this.nodes.filter(n => n.type === 'medium-range').length * 100,
                strategic: this.nodes.filter(n => n.type === 'long-range' && n.status === 'online').length /
                    this.nodes.filter(n => n.type === 'long-range').length * 100
            }
        };
    }

    getAllNodes() {
        return this.nodes;
    }

    getNodeById(id) {
        return this.nodes.find(n => n.id === id);
    }

    getOnlineNodes() {
        return this.nodes.filter(n => n.status === 'online');
    }

    getNodesByType(type) {
        return this.nodes.filter(n => n.type === type);
    }

    getNetworkStats() {
        this.calculateCoverageMap();

        const avgCPU = this.nodes.reduce((sum, n) => sum + n.metrics.cpuLoad, 0) / this.nodes.length;
        const avgSignal = this.nodes.filter(n => n.status !== 'offline')
            .reduce((sum, n) => sum + n.metrics.signalQuality, 0) /
            this.nodes.filter(n => n.status !== 'offline').length;
        const totalContacts = this.nodes.reduce((sum, n) => sum + n.metrics.contactsTracked, 0);

        return {
            ...this.coverageMap,
            performance: {
                avgCPU: avgCPU.toFixed(1),
                avgSignalQuality: avgSignal.toFixed(1),
                totalContactsTracked: totalContacts,
                networkLatency: Math.floor(Math.random() * 50) + 10 // ms
            }
        };
    }

    renderDashboard() {
        const grid = document.getElementById('nodeGrid');
        const statsPanel = document.getElementById('fusionStats');
        if (!grid) return;

        // Render Nodes if grid is empty or needs update (simple implementation: clear and rebuild)
        // For performance, we might want to update existing elements, but for <30 nodes, rebuild is fine.
        grid.innerHTML = '';

        this.nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = `network-node-card ${node.status}`;
            el.style.border = `1px solid ${node.status === 'online' ? '#00d4ff' : node.status === 'offline' ? '#ff3232' : '#ffcc00'}`;
            el.style.padding = '10px';
            el.style.borderRadius = '4px';
            el.style.background = 'rgba(0, 20, 40, 0.5)';
            el.style.fontSize = '0.8rem';
            el.style.position = 'relative';

            el.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <strong style="color: ${node.status === 'online' ? '#00d4ff' : node.status === 'offline' ? '#ff3232' : '#ffcc00'}">
                        ${node.id}
                    </strong>
                    <span>${node.type.substring(0, 2).toUpperCase()}</span>
                </div>
                <div style="font-size:0.7rem; color:#aaa;">
                    Signal: ${node.metrics.signalQuality.toFixed(0)}%<br>
                    Load: ${node.metrics.cpuLoad.toFixed(0)}%
                </div>
                <div class="status-dot ${node.status}" style="position:absolute; top:5px; right:5px; width:8px; height:8px; border-radius:50%; background:${node.status === 'online' ? '#00d4ff' : node.status === 'offline' ? '#ff3232' : '#ffcc00'}; box-shadow: 0 0 5px ${node.status === 'online' ? '#00d4ff' : node.status === 'offline' ? '#ff3232' : '#ffcc00'};"></div>
            `;
            grid.appendChild(el);
        });

        // Update Stats
        if (statsPanel) {
            const stats = this.getNetworkStats();
            statsPanel.innerHTML = `
                <div class="stat-row"><strong>Online Nodes:</strong> ${stats.onlineNodes} / ${stats.totalNodes}</div>
                <div class="stat-row"><strong>Network Coverage:</strong> ${stats.coverage}%</div>
                <div class="stat-row"><strong>Avg Latency:</strong> ${stats.performance.networkLatency} ms</div>
                <div class="stat-row" style="margin-top:10px; font-size:0.75rem; color:#aaa;">FUSION ENGINE: ACTIVE</div>
            `;
        }
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RadarNetwork;
}
