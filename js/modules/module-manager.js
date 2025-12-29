/**
 * MODULE MANAGER - Interactive System for All 28 Modules
 * Handles module detail panels, controls, and outputs
 */

class ModuleManager {
    constructor() {
        this.activeModule = null;
        this.moduleStates = {};
        this.initializeModules();
        console.log('[MODULE MANAGER] All 28 modules initialized');

        // Update status on page
        const statusEl = document.getElementById('moduleStatusText');
        if (statusEl) {
            statusEl.innerHTML = '✅ <span style="color: #00ff88;">READY - Click any module below or use test button</span>';
        }
    }

    initializeModules() {
        console.log('[MODULE MANAGER] Initializing click handlers...');
        const moduleItems = document.querySelectorAll('.module-item');
        console.log(`[MODULE MANAGER] Found ${moduleItems.length} module items`);

        if (moduleItems.length === 0) {
            console.warn('[MODULE MANAGER] No module items found! Retrying in 1 second...');
            setTimeout(() => this.initializeModules(), 1000);
            return;
        }

        // Add click handlers to all module items
        moduleItems.forEach((item, index) => {
            const moduleId = index + 1;
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                console.log(`[MODULE MANAGER] Module ${moduleId} clicked`);
                this.openModule(moduleId);
            });
        });

        console.log(`[MODULE MANAGER] Successfully initialized ${moduleItems.length} modules`);
    }

    openModule(moduleId) {
        this.activeModule = moduleId;
        const moduleDef = this.getModuleDefinition(moduleId);

        // Log module access
        if (window.auditLogger) {
            window.auditLogger.log('MODULE_OPEN', {
                moduleId: moduleId,
                moduleName: moduleDef.name,
                layer: moduleDef.layer
            });
        }

        this.showModulePanel(moduleDef);
    }

    getModuleDefinition(id) {
        const modules = {
            // Layer A: Quantum Radar Core
            1: {
                name: 'QRIP Core Radar Engine',
                layer: 'A',
                purpose: 'Central processor integrating quantum illumination + classical radar DSP',
                controls: ['FFT Window Size', 'CFAR Threshold', 'Quantum Correlation Gain'],
                action: 'processRadarData',
                outputs: ['Cleaned Returns', 'Low-RCS Detections', 'SNR Enhancement']
            },
            2: {
                name: 'Quantum Illumination Simulator',
                layer: 'A',
                purpose: 'Simulates entangled photon detection for stealth objects',
                controls: ['Source Power (mW)', 'Target RCS', 'Environment Noise'],
                action: 'runQuantumSim',
                outputs: ['Detection Probability Map', 'Quantum Scatter Field']
            },
            3: {
                name: 'Classical DSP Engine',
                layer: 'A',
                purpose: 'Filters, transforms, and enhances classical radar data',
                controls: ['Filter Type (FIR/IIR)', 'STFT Resolution', 'Clutter Rejection'],
                action: 'applyDSP',
                outputs: ['Doppler Spectrum', 'Cleaned Signal', 'Waterfall Plot']
            },
            4: {
                name: 'Radar Network Fusion Engine',
                layer: 'A',
                purpose: 'Fuses data from multiple radars (land/air/sea)',
                controls: ['Fusion Algorithm', 'Node Selection', 'Confidence Threshold'],
                action: 'fuseNetworkData',
                outputs: ['Unified Airspace Picture', 'Multi-Radar Mesh', 'Track Quality']
            },

            // Layer B: Threat Intelligence
            5: {
                name: 'AI Threat Cognition Engine',
                layer: 'B',
                purpose: 'Classifies threat type & intent using LSTM/Vision Transformers',
                controls: ['Classification Model', 'Confidence Threshold', 'Auto-Classify'],
                action: 'classifyThreats',
                outputs: ['Threat Types', 'Confidence Scores', 'Intent Predictions']
            },
            6: {
                name: 'Micro-Doppler Pattern Analyzer',
                layer: 'B',
                purpose: 'Detects propeller signatures and gait patterns',
                controls: ['Time-Frequency Window', 'Pattern Library', 'Sensitivity'],
                action: 'analyzeMicroDoppler',
                outputs: ['Blade Flash Detection', 'JEM Signature', 'Classification']
            },
            7: {
                name: 'Swarm Behaviour Prediction Engine',
                layer: 'B',
                purpose: 'Predicts group swarm intent using multi-agent ML',
                controls: ['Prediction Horizon (sec)', 'Swarm Detection', 'Vector Field'],
                action: 'predictSwarm',
                outputs: ['Future Positions', 'Intent Assessment', 'Trajectory Arcs']
            },
            8: {
                name: 'Hypersonic Track Predictor',
                layer: 'B',
                purpose: 'High-speed target prediction with non-linear Kalman',
                controls: ['Aero Model', 'Prediction Window', 'Track Coasting'],
                action: 'predictHypersonic',
                outputs: ['3-5 sec Prediction', 'Predictive Cone', 'Impact Zone']
            },

            // Layer EW: Electronic Warfare
            9: {
                name: 'Jammer Detection Engine',
                layer: 'EW',
                purpose: 'Identifies EW interference patterns via DRFM fingerprinting',
                controls: ['Scan Spectrum', 'Frequency Range (1-18 GHz)', 'Sensitivity'],
                action: 'detectJamming',
                outputs: ['Jammer Location', 'Interference Type', 'Countermeasures']
            },
            10: {
                name: 'Anti-DRFM Countermeasure Engine',
                layer: 'EW',
                purpose: 'Defeats replay/ghost targets with time-coded waveforms',
                controls: ['Waveform Type', 'Phase Randomness', 'Chirp Distortion'],
                action: 'deployAntiDRFM',
                outputs: ['Defeat Plan', 'Effectiveness %', 'Ghost Elimination']
            },
            11: {
                name: 'Noise Floor Inflation Detector',
                layer: 'EW',
                purpose: 'Identifies broadband jamming via noise variance statistics',
                controls: ['Baseline Noise', 'Threshold (dB)', 'Alert Level'],
                action: 'monitorNoiseFloor',
                outputs: ['Noise Floor Map', 'Jamming Alert', 'Source Bearing']
            },

            // Layer D: Automated Decision
            12: {
                name: 'AIDE (Autonomous Interceptor Decision Engine)',
                layer: 'D',
                purpose: 'Selects best countermeasure using utility-based ML',
                controls: ['Auto-Engage', 'Rules of Engagement', 'Evaluate Threats'],
                action: 'autDecide',
                outputs: ['Recommended Action', 'Priority List', 'Probability of Kill']
            },
            13: {
                name: 'Countermeasure Assignment Engine',
                layer: 'D',
                purpose: 'Assigns jammers, lasers, interceptors to threats',
                controls: ['Asset Inventory', 'Assignment Strategy', 'Execute'],
                action: 'assignCountermeasures',
                outputs: ['Assignment Commands', 'Resource Allocation', 'Timeline']
            },
            14: {
                name: 'Priority Ranking Engine',
                layer: 'D',
                purpose: 'Ranks threats by risk score',
                controls: ['Ranking Criteria', 'Weight Factors', 'Recalculate'],
                action: 'rankThreats',
                outputs: ['Priority Leaderboard', 'Risk Scores', 'Engagement Order']
            },

            // Layer H: Situational Awareness
            15: {
                name: '3D Radar Hologram Renderer',
                layer: 'H',
                purpose: 'Creates 3D map of the battlespace',
                controls: ['Hologram Mode', 'Tilt Angle', 'Rotation Speed'],
                action: 'render3D',
                outputs: ['WebGL Visualization', 'Volumetric Display', 'Depth Map']
            },
            16: {
                name: 'Geospatial Intelligence Layer',
                layer: 'H',
                purpose: 'Terrain + weather integration',
                controls: ['Map Provider', 'Weather Overlay', 'Terrain Masking'],
                action: 'loadGeoIntel',
                outputs: ['Map Tiles', 'Weather Radar', 'Terrain-Aware Tracks']
            },
            17: {
                name: 'Multi-Track Visualization Engine',
                layer: 'H',
                purpose: 'Displays all objects in real time',
                controls: ['Icon Set', 'Trail Length', 'Label Density'],
                action: 'renderTracks',
                outputs: ['Track Icons', 'Real-time Updates', 'Vector Overlays']
            },

            // Layer C: Simulation & Digital Twin
            18: {
                name: 'Radar Digital Twin Engine',
                layer: 'C',
                purpose: 'Mirrors physical radar behaviour',
                controls: ['Twin Sync', 'Hardware Profile', 'Calibration'],
                action: 'syncDigitalTwin',
                outputs: ['Twin Dashboard', 'Performance Deltas', 'Health Status']
            },
            19: {
                name: 'Scenario Simulator',
                layer: 'C',
                purpose: 'Build attack/defence scenarios',
                controls: ['Load Scenario', 'Threat Models', 'Run Simulation'],
                action: 'runScenario',
                outputs: ['Simulation Results', 'Outcome Probability', 'Replay']
            },
            20: {
                name: 'Quantum-Radar Sandbox',
                layer: 'C',
                purpose: 'Experiment with quantum models',
                controls: ['Qubit Count', 'Entanglement Strength', 'Run Model'],
                action: 'quantumExperiment',
                outputs: ['Model Results', 'Quantum Field Graph', 'Performance']
            },

            // Layer I: Cloud/Edge
            21: {
                name: 'Radar Edge Compute Stack',
                layer: 'I',
                purpose: 'On-device ML + DSP processing',
                controls: ['Edge Nodes', 'Local Processing', 'Offload Ratio'],
                action: 'configureEdge',
                outputs: ['Edge Stats', 'Latency Metrics', 'Processing Load']
            },
            22: {
                name: 'Defence Cloud Orchestrator',
                layer: 'I',
                purpose: 'Multi-radar cloud control',
                controls: ['Cloud Provider', 'Node Sync', 'Scale Policy'],
                action: 'orchestrateCloud',
                outputs: ['Cloud Map', 'Node Status', 'Sync Health']
            },
            23: {
                name: 'Secure Telemetry Engine (PQC)',
                layer: 'I',
                purpose: 'Post-quantum cryptography for telemetry',
                controls: ['Encryption Algorithm', 'Key Rotation', 'Audit'],
                action: 'secureTelemetry',
                outputs: ['Encryption Health', 'Key Status', 'Attack Log']
            },

            // Layer E: Storage/Forensics
            24: {
                name: 'Forensic Reconstruction Engine',
                layer: 'E',
                purpose: 'Rebuilds attack sequences from logs',
                controls: ['Time Range', 'Event Filter', 'Reconstruct'],
                action: 'reconstructForensics',
                outputs: ['Timeline Scrubber', 'Event Sequence', 'Replay Video']
            },
            25: {
                name: 'Radar Log Compression Engine',
                layer: 'E',
                purpose: 'Compress radar data 10×',
                controls: ['Compression Algorithm', 'Quality Level', 'Compress'],
                action: 'compressLogs',
                outputs: ['Storage Dashboard', 'Compression Ratio', 'Archive Size']
            },
            26: {
                name: 'Threat Archive Engine',
                layer: 'E',
                purpose: 'Saves classified threats with metadata',
                controls: ['Search Query', 'Classification Filter', 'Export'],
                action: 'searchArchive',
                outputs: ['Forensic Browser', 'Threat Records', 'Metadata']
            },

            // Layer K: C2
            27: {
                name: 'Mission Planner & Playbook Engine',
                layer: 'K',
                purpose: 'Auto-generate defence plans',
                controls: ['Coverage Area', 'Threat Scenario', 'Generate Plan'],
                action: 'planMission',
                outputs: ['Defence Playbooks', 'Mission Map', 'Resource Needs']
            },
            28: {
                name: 'Command OS (Unified Dashboard)',
                layer: 'K',
                purpose: 'Unified UI and control panel for all modules',
                controls: ['View Mode', 'Alert Priority', 'Quick Actions'],
                action: 'updateCommandOS',
                outputs: ['Main Dashboard', 'Operator Interface', 'System Health']
            }
        };

        return modules[id] || { name: 'Unknown Module', layer: '?', purpose: 'N/A' };
    }

    showModulePanel(module) {
        // Create modal backdrop
        let modal = document.getElementById('moduleDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'moduleDetailModal';
            modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10001; align-items:center; justify-content:center;';
            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
        modal.innerHTML = `
            <div style="background: rgba(10, 20, 30, 0.95); border: 2px solid #00d4ff; width: 700px; max-height: 80vh; overflow-y: auto; padding: 30px; box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #00d4ff; margin: 0;">${module.name}</h2>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="window.showModuleHelp(${this.activeModule})" style="background: linear-gradient(135deg, #ffcc00, #ff9900); border: none; color: #000; font-size: 1.2rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-weight: bold;" title="Help & Documentation">?</button>
                        <button onclick="document.getElementById('moduleDetailModal').style.display='none'" style="background: none; border: none; color: #ff3232; font-size: 2rem; cursor: pointer; padding: 0 10px;">&times;</button>
                    </div>
                </div>

                <div style="background: rgba(0, 212, 255, 0.05); padding: 15px; margin-bottom: 20px; border-left: 3px solid #00d4ff;">
                    <div style="color: #ffcc00; font-weight: bold; margin-bottom: 5px;">LAYER ${module.layer}</div>
                    <div style="color: #ddd; font-size: 0.95rem;">${module.purpose}</div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #00ff88; border-bottom: 1px solid #00ff88; padding-bottom: 5px;">Controls</h3>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        ${module.controls.map(control => `
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-left: 2px solid rgba(0, 255, 136, 0.5);">
                                <label style="color: #ddd; font-size: 0.9rem;">${control}</label>
                                ${this.renderControl(control)}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <button onclick="window.moduleManager.executeModule(${this.activeModule})" 
                            style="background: linear-gradient(135deg, #00d4ff, #0099cc); border: none; color: #000; padding: 15px 40px; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 5px; box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                        ▶ EXECUTE MODULE
                    </button>
                </div>

                <div>
                    <h3 style="color: #ffcc00; border-bottom: 1px solid #ffcc00; padding-bottom: 5px;">Outputs</h3>
                    <div id="moduleOutputs" style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border: 1px dashed rgba(255, 204, 0, 0.3); min-height: 100px; color: #ddd; font-family: monospace;">
                        <em style="color: #666;">Click EXECUTE to see results...</em>
                    </div>
                </div>
            </div>
        `;
    }

    renderControl(controlName) {
        // Render appropriate input type based on control name
        if (controlName.includes('Threshold') || controlName.includes('Gain') || controlName.includes('Power')) {
            return `<input type="range" min="0" max="100" value="50" style="width: 100%; margin-top: 5px;">`;
        } else if (controlName.includes('Toggle') || controlName.includes('Auto')) {
            return `<input type="checkbox" style="margin-top: 5px;">`;
        } else if (controlName.includes('Select') || controlName.includes('Type') || controlName.includes('Algorithm')) {
            return `<select style="width: 100%; margin-top: 5px; padding: 5px; background: rgba(0, 0, 0, 0.5); color: #ddd; border: 1px solid #00d4ff;">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
            </select>`;
        } else {
            return `<button style="margin-top: 5px; padding: 5px 15px; background: rgba(0, 212, 255, 0.2); border: 1px solid #00d4ff; color: #00d4ff; cursor: pointer;">${controlName}</button>`;
        }
    }

    executeModule(moduleId) {
        const module = this.getModuleDefinition(moduleId);

        // Log module execution
        if (window.auditLogger) {
            window.auditLogger.log('MODULE_EXECUTE', {
                moduleId: moduleId,
                moduleName: module.name,
                layer: module.layer,
                action: module.action
            });
        }

        const outputDiv = document.getElementById('moduleOutputs');

        outputDiv.innerHTML = `
            <div style="color: #00ff88; margin-bottom: 10px;">✓ MODULE ${moduleId} EXECUTED</div>
            ${module.outputs.map((output, i) => `
                <div style="margin: 8px 0; padding: 8px; background: rgba(0, 255, 136, 0.05); border-left: 2px solid #00ff88;">
                    <strong style="color: #ffcc00;">${output}:</strong> 
                    <span style="color: #ddd;">${this.generateMockOutput(output)}</span>
                </div>
            `).join('')}
            <div style="margin-top: 15px; padding: 10px; background: rgba(0, 212, 255, 0.1); border: 1px solid #00d4ff; color: #00d4ff;">
                <strong>STATUS:</strong> Operation completed successfully
            </div>
        `;
    }

    generateMockOutput(outputName) {
        // Generate realistic mock data based on output type
        if (outputName.includes('Probability') || outputName.includes('Confidence')) {
            return `${(Math.random() * 30 + 70).toFixed(1)}%`;
        } else if (outputName.includes('Detection') || outputName.includes('Location')) {
            return `Bearing ${Math.floor(Math.random() * 360)}°, Range ${(Math.random() * 500 + 10).toFixed(1)} km`;
        } else if (outputName.includes('Classification') || outputName.includes('Type')) {
            const types = ['Hostile UAV', 'Stealth Aircraft', 'Loitering Munition', 'Electronic Jammer'];
            return types[Math.floor(Math.random() * types.length)];
        } else if (outputName.includes('Map') || outputName.includes('Visualization')) {
            return '[Rendered in main display]';
        } else {
            return `Data: ${Math.floor(Math.random() * 1000)} samples processed`;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[MODULE MANAGER] DOM loaded, waiting for full initialization...');
    setTimeout(() => {
        console.log('[MODULE MANAGER] Creating Module Manager instance...');
        window.moduleManager = new ModuleManager();
    }, 3500); // Wait for other systems to initialize
});
