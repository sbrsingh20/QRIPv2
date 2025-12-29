// Main Application Controller - Ultimate Distributed Network Version
class QuantumRadarApp {
    constructor() {
        this.radar = null;
        this.detectionSystem = new DetectionSystem();
        this.inventorySystem = new InventorySystem();
        this.analytics = new AnalyticsEngine();
        this.auth = new AuthManager();

        // Distributed Network Components
        this.mlEngine = new MLEngine();
        this.radarNetwork = new RadarNetwork();
        this.fusionEngine = new FusionEngine(this.radarNetwork, this.mlEngine);

        // Advanced Radar Features
        this.advancedFeatures = new AdvancedRadarFeatures();
        this.calibration = null;
        this.sigInt = null;
        this.fleetManager = null;
        this.digitalTwin = null;
        this.postAnalysis = null;

        this.updateInterval = null;
        this.radarInterval = null;

        this.selectedContact = null;
        this.currentRadarMode = 'surveillance';
    }

    initialize() {
        console.log('🚀 Initializing Ultimate Quantum Radar Intelligence Platform...');

        // Setup Login Listener
        const loginBtn = document.getElementById('loginBtn');
        const loginUser = document.getElementById('loginUser');
        const loginPass = document.getElementById('loginPass');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const result = this.auth.login(loginUser.value, loginPass.value);
                if (result.success) {
                    this.unlockApplication();
                } else {
                    document.getElementById('loginMsg').textContent = result.message;
                }
            });
        }
    }

    unlockApplication() {
        // Remove Overlay
        document.getElementById('login-overlay').style.display = 'none';

        // Unlock Content
        const appContent = document.getElementById('appContent');
        appContent.style.filter = 'none';
        appContent.style.pointerEvents = 'all';

        // Filter Tabs based on Permissions
        document.querySelectorAll('.nav-item').forEach(btn => {
            const view = btn.getAttribute('data-view');
            if (!this.auth.hasPermission(view)) {
                btn.style.display = 'none'; // Hide unauthorized modules
            }
        });

        // Initialize radar
        this.radar = new QuantumRadar('radarCanvas');

        // Initialize calibration module
        this.calibration = new RadarCalibration(this.radar);
        this.calibration.initialize();

        // Initialize SIGINT module
        this.sigInt = new SignalIntelligence();

        // Initialize Fleet Manager
        this.fleetManager = new FleetManager();

        // Initialize Digital Twin
        this.digitalTwin = new DigitalTwin();

        // Initialize Post Analysis
        this.postAnalysis = new PostAnalysis();

        // Initialize mission planner
        this.missions = new MissionPlanner();

        // Generate REALISTIC warfare scenario
        this.detectionSystem.generateRealisticScenario('mixed');

        // Update radar with contacts
        this.radar.setContacts(this.detectionSystem.getAllContacts());

        // Initial render
        this.render();
        this.radarNetwork.renderDashboard();

        // Set up event listeners
        this.setupEventListeners();

        // Start update loops
        this.startUpdateLoops();

        const stats = this.detectionSystem.getContactStats();
        const networkStats = this.radarNetwork.getNetworkStats();

        console.log('✅ Ultimate Radar System initialized');
        console.log(`🤖 ML/QML Engine: 4 models active`);
        console.log(`🌐 Distributed Network: ${networkStats.totalNodes} nodes (${networkStats.onlineNodes} online)`);
        console.log(`📊 ${stats.total} contacts across all ranges`);
        console.log(`⚠️ ${stats.hostile} hostile | ✓ ${stats.friendly} friendly | ○ ${stats.civilian} civilian`);
        console.log(`🎯 ${stats.critical} critical threats detected`);
    }

    setupEventListeners() {
        // Radar zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const resetZoomBtn = document.getElementById('resetZoom');
        const refreshBtn = document.getElementById('refreshContacts');

        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.radar.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.radar.zoomOut());
        if (resetZoomBtn) resetZoomBtn.addEventListener('click', () => this.radar.resetZoom());
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshContacts());

        // Range preset buttons
        const tacticalBtn = document.getElementById('rangeTactical');
        const regionalBtn = document.getElementById('rangeRegional');
        const strategicBtn = document.getElementById('rangeStrategic');

        if (tacticalBtn) tacticalBtn.addEventListener('click', () => this.setRangePreset('tactical'));
        if (regionalBtn) regionalBtn.addEventListener('click', () => this.setRangePreset('regional'));
        if (strategicBtn) strategicBtn.addEventListener('click', () => this.setRangePreset('strategic'));

        // Radar mode buttons
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setRadarMode(mode);
            });
        });

        // Toggle buttons
        const toggleTrailsBtn = document.getElementById('toggleTrails');
        const toggleVectorsBtn = document.getElementById('toggleVectors');

        if (toggleTrailsBtn) {
            toggleTrailsBtn.addEventListener('click', () => {
                this.radar.toggleTrails();
                toggleTrailsBtn.textContent = this.radar.showTrails ? '📍 Hide Trails' : '📍 Show Trails';
            });
        }

        if (toggleVectorsBtn) {
            toggleVectorsBtn.addEventListener('click', () => {
                this.radar.toggleVelocityVectors();
                toggleVectorsBtn.textContent = this.radar.showVelocityVectors ? '➡️ Hide Vectors' : '➡️ Show Vectors';
            });
        }

        this.setupNavigation();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.view-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Handle active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Handle view switching
                const viewId = item.dataset.view;
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                    if (section.id === viewId) {
                        section.style.display = 'block';
                        // Small timeout to allow display:block to apply before adding active class for animation
                        setTimeout(() => section.classList.add('active'), 10);


                        // Resize radar if switching to operational view
                        if (viewId === 'operational-view' && this.radar) {
                            this.radar.resize();
                        }

                        // Initialize SIGINT if switching to signal view
                        if (viewId === 'signal-view' && this.sigInt) {
                            // Only init once or resize
                            this.sigInt.initialize();
                            this.sigInt.resize();
                        }

                        // Initialize Fleet if switching to fleet view
                        if (viewId === 'fleet-view' && this.fleetManager) {
                            this.fleetManager.initialize();
                            this.fleetManager.resize();
                        }

                        // Initialize Twin if switching to twin view
                        if (viewId === 'twin-view' && this.digitalTwin) {
                            this.digitalTwin.initialize();
                            this.digitalTwin.resize();
                        }

                        // Initialize Analysis if switching to analysis view
                        if (viewId === 'analysis-view' && this.postAnalysis) {
                            this.postAnalysis.initialize();
                            this.postAnalysis.resize();
                        }
                    }
                });
            });
        });
    }

    setRadarMode(mode) {
        this.currentRadarMode = mode;
        this.radar.setMode(mode);
        this.detectionSystem.setRadarMode(mode);

        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        console.log(`🎯 Radar mode set to: ${mode.toUpperCase()}`);
    }

    setRangePreset(preset) {
        switch (preset) {
            case 'tactical':
                this.radar.setRange(50); // 0-50km
                console.log('📍 Tactical range: 0-50km');
                break;
            case 'regional':
                this.radar.setRange(500); // 0-500km
                console.log('📍 Regional range: 0-500km');
                break;
            case 'strategic':
                this.radar.setRange(2000); // 0-2000km
                console.log('📍 Strategic range: 0-2000km');
                break;
        }

        // Highlight active preset
        document.querySelectorAll('.range-preset-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`range${preset.charAt(0).toUpperCase() + preset.slice(1)}`)?.classList.add('active');
    }

    render() {
        try {
            // Fuse data from distributed network with ML enhancement
            const fusedContacts = this.fusionEngine.fuseMultiNodeData(this.detectionSystem.getAllContacts());

            // Render contacts list (using fused data with ML classification)
            this.detectionSystem.renderContactList('contactsList');

            // Render inventory
            this.inventorySystem.renderInventory('inventoryList');

            // Render metrics
            this.analytics.renderMetrics('metricsGrid', this.detectionSystem, this.inventorySystem);

            // Render network dashboard
            this.networkDashboard.renderNodeGrid('nodeGrid');
            this.networkDashboard.renderCoverageMap('coverageMap');
            this.networkDashboard.renderFusionStats('fusionStats', this.fusionEngine);
            this.networkDashboard.renderMLStats('mlStats', this.mlEngine);

            // Update radar with fused contacts
            this.radar.setContacts(fusedContacts);

            // Re-attach contact item click handlers
            this.attachContactClickHandlers();
        } catch (error) {
            console.error('Render error:', error);
        }
    }

    attachContactClickHandlers() {
        const contactItems = document.querySelectorAll('.threat-item');
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                const contactId = item.dataset.contactId;
                this.selectContact(contactId);
            });
        });
    }

    selectContact(contactId) {
        this.selectedContact = contactId;
        const contact = this.detectionSystem.getContactById(contactId);

        if (!contact) return;

        // Highlight selected contact
        document.querySelectorAll('.threat-item').forEach(item => {
            item.style.borderWidth = '1px';
        });
        const selectedItem = document.querySelector(`[data-contact-id="${contactId}"]`);
        if (selectedItem) {
            selectedItem.style.borderWidth = '3px';
        }

        // Auto-generate mission plan only for hostile contacts
        if (contact.threat) {
            this.planMission(contactId);
        } else {
            // Show contact info for non-threats with ML analysis
            this.showContactInfo(contact);
        }
    }

    showContactInfo(contact) {
        const resultContainer = document.getElementById('missionResult');
        if (!resultContainer) return;

        // Get ML analysis if available
        let mlInfo = '';
        if (contact.mlClassification) {
            mlInfo = `
                <div class="mt-md" style="background: rgba(179, 102, 255, 0.1); padding: 0.8rem; border-radius: 6px;">
                    <strong>🤖 ML Analysis:</strong>
                    <p>Classification Confidence: ${(contact.mlClassification.classificationConfidence * 100).toFixed(1)}%</p>
                    <p>Threat Probability: ${(contact.mlClassification.threatProbability * 100).toFixed(1)}%</p>
                    <p>Recommendation: ${contact.mlClassification.recommendation}</p>
                </div>
            `;
        }

        // Get anomaly detection info
        let anomalyInfo = '';
        if (contact.anomalyDetection && contact.anomalyDetection.isAnomalous) {
            anomalyInfo = `
                <div class="mt-md" style="background: rgba(255, 204, 0, 0.1); padding: 0.8rem; border-radius: 6px;">
                    <strong>⚠️ Anomaly Detected:</strong>
                    <p>Type: ${contact.anomalyDetection.anomalyType}</p>
                    <p>Score: ${(contact.anomalyDetection.anomalyScore * 100).toFixed(1)}%</p>
                    <p>Confidence: ${(contact.anomalyDetection.confidence * 100).toFixed(1)}%</p>
                </div>
            `;
        }

        // Get fusion metadata
        let fusionInfo = '';
        if (contact.fusionMetadata) {
            fusionInfo = `
                <div class="mt-md" style="background: rgba(0, 212, 255, 0.05); padding: 0.8rem; border-radius: 6px;">
                    <strong>🔗 Fusion Data:</strong>
                    <p>Sources: ${contact.fusionMetadata.numSources} nodes (${contact.fusionMetadata.sourceNodes.join(', ')})</p>
                    <p>Fusion Quality: ${(contact.fusionMetadata.fusionQuality * 100).toFixed(1)}%</p>
                </div>
            `;
        }

        resultContainer.innerHTML = `
            <div class="mission-result active">
                <div class="strategy-title" style="color: var(--quantum-blue);">
                    ${contact.classData.icon} Contact Information
                </div>
                <div class="strategy-details">
                    <p><strong>ID:</strong> ${contact.id}</p>
                    <p><strong>Classification:</strong> ${contact.classData.name}</p>
                    <p><strong>IFF Status:</strong> <span class="iff-badge ${contact.iffStatus}">${contact.iffStatus.toUpperCase()}</span></p>
                    <p><strong>Distance:</strong> ${contact.distance.toFixed(1)}km</p>
                    <p><strong>Speed:</strong> ${contact.speed}km/h</p>
                    <p><strong>Bearing:</strong> ${contact.bearing.toFixed(1)}°</p>
                    ${contact.altitude > 0 ? `<p><strong>Altitude:</strong> ${contact.altitude}m</p>` : ''}
                    <p><strong>RCS:</strong> ${contact.rcs.toFixed(2)}m²</p>
                    <p><strong>Signal Strength:</strong> ${(contact.signalStrength * 100).toFixed(1)}%</p>
                    <p><strong>Track Quality:</strong> ${(contact.trackQuality * 100).toFixed(1)}%</p>
                </div>
                ${mlInfo}
                ${anomalyInfo}
                ${fusionInfo}
                ${contact.iffStatus === 'unknown' ? `
                    <div class="resources-needed mt-md">
                        <strong>⚠️ Classification Pending:</strong>
                        <p>Continue monitoring for positive identification.</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    planMission(contactId) {
        if (!contactId) {
            // Plan for first critical threat
            const criticalThreats = this.detectionSystem.getCriticalThreats();
            if (criticalThreats.length > 0) {
                contactId = criticalThreats[0].id;
            } else {
                const hostileContacts = this.detectionSystem.getHostileContacts();
                if (hostileContacts.length > 0) {
                    contactId = hostileContacts[0].id;
                } else {
                    return;
                }
            }
        }

        const contact = this.detectionSystem.getContactById(contactId);
        if (!contact || !contact.threat) return;

        const missionPlan = this.missionPlanner.generateMissionPlan(contactId);
        this.missionPlanner.renderMissionPlan(missionPlan, 'missionResult');
    }

    refreshContacts() {
        console.log('🔄 Generating new warfare scenario...');
        this.detectionSystem.generateRealisticScenario('mixed');
        this.render();
        const stats = this.detectionSystem.getContactStats();
        console.log(`✅ New scenario: ${stats.total} contacts`);
    }

    startUpdateLoops() {
        // Radar animation loop (60 FPS)
        this.radarInterval = setInterval(() => {
            this.radar.draw();
        }, 1000 / 60);

        // Data update loop (every 3 seconds)
        this.updateInterval = setInterval(() => {
            // Update contact positions
            this.detectionSystem.updateContactPositions();

            // Update network node metrics
            this.radarNetwork.updateNodeMetrics();

            // Simulate node failures (10% chance every 3 seconds)
            if (Math.random() < 0.1) {
                this.radarNetwork.simulateNodeFailures();
            }

            // Simulate inventory changes
            if (Math.random() < 0.3) {
                this.inventorySystem.simulateUsage();
            }
            if (Math.random() < 0.2) {
                this.inventorySystem.simulateRestock();
            }

            // Render updates
            this.render();
            // Update Distributed Network UI
            this.radarNetwork.renderDashboard();

            // Occasionally add new contacts
            if (Math.random() < 0.08 && this.detectionSystem.getAllContacts().length < 30) {
                // Pick a random classification
                const allTypes = ['combatDrone', 'fighterJet', 'commercialAirliner', 'alliedFighter', 'destroyer', 'mainBattleTank'];
                const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
                const newContact = this.detectionSystem.createContact(randomType);
                this.detectionSystem.addContact(newContact);
                console.log(`📡 New contact detected: ${newContact.id} (${newContact.classData.name})`);
            }

            // Remove contacts that are too close (simulating neutralization or pass-through)
            const contacts = this.detectionSystem.getAllContacts();
            contacts.forEach(contact => {
                if (contact.distance < 30 && Math.random() < 0.3) {
                    this.detectionSystem.removeContact(contact.id);
                    if (contact.threat) {
                        console.log(`✅ Threat ${contact.id} neutralized`);
                    } else {
                        console.log(`✓ Contact ${contact.id} left detection range`);
                    }
                }
            });

        }, 3000);

        // Metrics update loop (every 1 second)
        setInterval(() => {
            this.analytics.renderMetrics('metricsGrid', this.detectionSystem, this.inventorySystem);
        }, 1000);
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.radarInterval) {
            clearInterval(this.radarInterval);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuantumRadarApp();
    app.initialize();

    // Make app globally available for debugging
    window.quantumRadarApp = app;
});
