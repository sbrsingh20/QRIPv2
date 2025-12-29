class RadarCalibration {
    constructor(radarSystem) {
        this.radarSystem = radarSystem;
        this.currentProfile = 'standard';
        this.profiles = {
            'standard': { name: 'Standard Surveillance', gain: 100, noise: 15, beam: 2.5 },
            'spy1': { name: 'AN/SPY-1D(V) (Naval)', gain: 110, noise: 10, beam: 1.0 },
            'tpy2': { name: 'AN/TPY-2 (Missile Defense)', gain: 130, noise: 8, beam: 0.5 },
            'sentinel': { name: 'AN/MPQ-64 Sentinel', gain: 90, noise: 18, beam: 3.0 }
        };

        this.calibrationData = {
            signalStrength: 100,
            noiseFloor: 15,
            frequencyOffset: 0,
            beamWidth: 2.5,
            calibrated: true
        };
        this.isCalibrating = false;
    }

    initialize() {
        console.log('🔧 Initializing Radar Calibration Module...');
        this.renderCalibrationPanel();
        this.setupEventListeners();
    }

    renderCalibrationPanel() {
        const container = document.getElementById('calibrationContent');
        if (!container) return;

        container.innerHTML = `
            <div class="calibration-controls">
                <div class="control-group" style="margin-bottom: 20px; border-bottom: 1px solid rgba(0,212,255,0.2); padding-bottom: 15px;">
                    <label style="color: var(--quantum-blue);">Target Radar System</label>
                    <select class="cyber-select" id="calibProfile">
                        <option value="standard">Standard Surveillance Configuration</option>
                        <option value="spy1">AN/SPY-1D(V) Multi-Function Array</option>
                        <option value="tpy2">AN/TPY-2 X-Band (FBR Mode)</option>
                        <option value="sentinel">AN/MPQ-64 Sentinel (Short Range)</option>
                    </select>
                </div>

                <div class="control-group">
                    <label>Signal Strength Gain (%)</label>
                    <div class="slider-container">
                        <input type="range" id="sigStrength" min="0" max="150" value="${this.calibrationData.signalStrength}">
                        <span id="sigStrengthVal">${this.calibrationData.signalStrength}%</span>
                    </div>
                </div>

                <div class="control-group">
                    <label>Noise Floor Threshold (dB)</label>
                    <div class="slider-container">
                        <input type="range" id="noiseFloor" min="0" max="50" value="${this.calibrationData.noiseFloor}">
                        <span id="noiseFloorVal">${this.calibrationData.noiseFloor} dB</span>
                    </div>
                </div>

                <div class="control-group">
                    <label>Frequency Offset (MHz)</label>
                    <div class="input-container">
                        <input type="number" id="freqOffset" value="${this.calibrationData.frequencyOffset}" step="0.1">
                    </div>
                </div>

                <div class="control-group">
                    <label>Beam Width (deg)</label>
                    <select id="beamWidth" class="select-input">
                        <option value="0.5">Ultra-Narrow (0.5°)</option>
                        <option value="1.0">Narrow (1.0°)</option>
                        <option value="2.5" selected>Standard (2.5°)</option>
                        <option value="5.0">Wide (5.0°)</option>
                    </select>
                </div>

                <div class="calibration-status-area">
                    <div class="status-indicator">
                        <span class="status-dot ${this.calibrationData.calibrated ? 'active' : ''}" id="calibStatusDot"></span>
                        <span id="calibStatusText">${this.calibrationData.calibrated ? 'SYSTEM CALIBRATED' : 'CALIBRATION REQUIRED'}</span>
                    </div>
                    <button class="btn btn-primary" id="startCalibration">📡 Auto-Calibrate System</button>
                    <div class="progress-bar-container" style="display:none;" id="calibProgressContainer">
                        <div class="progress-bar" id="calibProgressBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const sigStrength = document.getElementById('sigStrength');
        const noiseFloor = document.getElementById('noiseFloor');
        const freqOffset = document.getElementById('freqOffset');
        const beamWidth = document.getElementById('beamWidth');
        const calibBtn = document.getElementById('startCalibration');
        const profileSelect = document.getElementById('calibProfile');

        if (profileSelect) {
            profileSelect.addEventListener('change', (e) => this.loadProfile(e.target.value));
        }

        if (sigStrength) {
            sigStrength.addEventListener('input', (e) => {
                this.calibrationData.signalStrength = parseInt(e.target.value);
                document.getElementById('sigStrengthVal').textContent = `${this.calibrationData.signalStrength}%`;
                this.flagCalibrationRequired();
            });
        }

        if (noiseFloor) {
            noiseFloor.addEventListener('input', (e) => {
                this.calibrationData.noiseFloor = parseInt(e.target.value);
                document.getElementById('noiseFloorVal').textContent = `${this.calibrationData.noiseFloor} dB`;
                this.flagCalibrationRequired();
            });
        }

        if (freqOffset) {
            freqOffset.addEventListener('input', (e) => {
                this.calibrationData.frequencyOffset = parseFloat(e.target.value);
                this.flagCalibrationRequired();
            });
        }

        if (beamWidth) {
            beamWidth.addEventListener('change', (e) => {
                this.calibrationData.beamWidth = parseFloat(e.target.value);
                this.flagCalibrationRequired();
            });
        }

        if (calibBtn) {
            calibBtn.addEventListener('click', () => this.runAutoCalibration());
        }
    }

    loadProfile(profileKey) {
        const profile = this.profiles[profileKey];
        if (!profile) return;

        this.currentProfile = profileKey;
        this.calibrationData.signalStrength = profile.gain;
        this.calibrationData.noiseFloor = profile.noise;
        this.calibrationData.beamWidth = profile.beam;

        // Update UI
        document.getElementById('sigStrength').value = profile.gain;
        document.getElementById('sigStrengthVal').textContent = profile.gain + '%';

        document.getElementById('noiseFloor').value = profile.noise;
        document.getElementById('noiseFloorVal').textContent = profile.noise + ' dB';

        // Select closest beam width
        const beamSelect = document.getElementById('beamWidth');
        if (beamSelect) beamSelect.value = profile.beam.toString();

        this.flagCalibrationRequired();
        console.log(`Loaded Profile: ${profile.name}`);
    }

    flagCalibrationRequired() {
        this.calibrationData.calibrated = false;
        this.updateStatusDisplay();
    }

    updateStatusDisplay() {
        const dot = document.getElementById('calibStatusDot');
        const text = document.getElementById('calibStatusText');

        if (dot && text) {
            if (this.calibrationData.calibrated) {
                dot.classList.add('active');
                dot.classList.remove('warning');
                text.textContent = 'SYSTEM CALIBRATED';
                text.style.color = 'var(--quantum-neon)';
            } else {
                dot.classList.remove('active');
                dot.classList.add('warning');
                text.textContent = 'CALIBRATION REQUIRED';
                text.style.color = '#ffcc00';
            }
        }
    }

    runAutoCalibration() {
        if (this.isCalibrating) return;
        this.isCalibrating = true;

        const btn = document.getElementById('startCalibration');
        const progressContainer = document.getElementById('calibProgressContainer');
        const progressBar = document.getElementById('calibProgressBar');

        if (btn) btn.disabled = true;
        if (progressContainer) progressContainer.style.display = 'block';

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                this.completeCalibration();
            }
        }, 100);
    }

    completeCalibration() {
        this.isCalibrating = false;
        this.calibrationData.calibrated = true;

        const btn = document.getElementById('startCalibration');
        const progressContainer = document.getElementById('calibProgressContainer');

        if (btn) {
            btn.disabled = false;
            btn.textContent = '✓ Calibration Complete';
            setTimeout(() => {
                btn.textContent = '📡 Auto-Calibrate System';
            }, 2000);
        }

        if (progressContainer) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        }

        this.updateStatusDisplay();
        console.log('✅ System successfully calibrated with parameters:', this.calibrationData);
    }
}
