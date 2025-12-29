class SignalIntelligence {
    constructor() {
        this.spectrumCanvas = document.getElementById('spectrumCanvas');
        this.waterfallCanvas = document.getElementById('waterfallCanvas');
        this.ctxSpectrum = this.spectrumCanvas ? this.spectrumCanvas.getContext('2d') : null;
        this.ctxWaterfall = this.waterfallCanvas ? this.waterfallCanvas.getContext('2d') : null;

        this.emitters = [];
        this.isRunning = false;

        this.frequencies = new Float32Array(512); // Simulated FFT bins
        this.waterfallData = []; // History

        // Resize observer
        this.resize();
    }

    initialize() {
        console.log("Initializing SIGINT Module...");
        if (!this.spectrumCanvas) return;

        this.isRunning = true;
        this.generateMockEmitters();
        this.animate();
        this.updateEmitterList();

        // Listen for resizing
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (this.spectrumCanvas) {
            this.spectrumCanvas.width = this.spectrumCanvas.offsetWidth;
            this.spectrumCanvas.height = this.spectrumCanvas.offsetHeight;
        }
        if (this.waterfallCanvas) {
            this.waterfallCanvas.width = this.waterfallCanvas.offsetWidth;
            this.waterfallCanvas.height = this.waterfallCanvas.offsetHeight;
        }
    }

    generateMockEmitters() {
        this.emitters = [
            { name: "Search Radar (X-Band)", freq: 9.3, power: 0.8, type: "Hostile", interval: 2000 },
            { name: "Comm Link (UHF)", freq: 0.45, power: 0.4, type: "Unknown", interval: 500 },
            { name: "Fire Control (Ku-Band)", freq: 15.2, power: 0.9, type: "Hostile", interval: 100 },
            { name: "Civilian Air Traffic", freq: 1.2, power: 0.6, type: "Friendly", interval: 4000 }
        ];
    }

    updateEmitterList() {
        const list = document.getElementById('emitterList');
        if (!list) return;
        list.innerHTML = '';

        this.emitters.forEach(e => {
            const item = document.createElement('div');
            item.className = 'emitter-item';
            item.style.padding = '10px';
            item.style.borderBottom = '1px solid rgba(0,255,255,0.1)';
            item.innerHTML = `
                <div style="color: var(--quantum-blue); font-weight: bold;">${e.name}</div>
                <div style="font-size: 0.8rem; color: #aaa;">Freq: ${e.freq} GHz | Type: <span style="color: ${e.type === 'Hostile' ? '#ff3232' : '#00ff00'}">${e.type}</span></div>
            `;
            list.appendChild(item);
        });
    }

    animate() {
        if (!this.isRunning) return;

        this.updateSpectrumData();
        this.drawSpectrum();
        this.drawWaterfall();
        this.analyzeSignals();

        requestAnimationFrame(() => this.animate());
    }

    analyzeSignals() {
        // Read controls
        const band = document.getElementById('sigBand').value;
        const mode = document.getElementById('sigMode').value;
        const analysisText = document.getElementById('sigAnalysisText');

        if (!analysisText) return;

        let detected = [];
        let noiseLevel = "Low";

        // Logic based on band selection
        if (band.includes("HF") || band.includes("Generic")) {
            detected.push("Long-range encrypted comms");
            noiseLevel = "High (Atmospheric)";
        }
        if (band.includes("X-Band") || band.includes("Generic")) {
            detected.push("Pulse-Doppler Radar (Targeting)");
        }
        if (band.includes("L-Band")) {
            detected.push("Long-range Surveillance Radar");
        }

        // Mode logic
        if (mode.includes("Attack")) {
            // QUANTUM JAMMING SHIELD LOGIC
            const integrity = Math.random();
            if (integrity > 0.4) {
                // Shield holds
                analysisText.innerHTML = `
                    <span style="color:#ffcc00; font-weight:bold;">🛡️ EW ATTACK NEUTRALIZED</span><br>
                    <span style="color:#00ff00;">Quantum Entanglement Integrity: ${(integrity * 100).toFixed(1)}%</span><br>
                    Noise floor stabilized via Error Correction.
                 `;
            } else {
                // Shield breaks
                analysisText.innerHTML = `<span style="color:#ff3232; font-weight:bold;">⚠️ ELECTRONIC ATTACK ACTIVE</span><br>Jamming noise floor raised by 15dB. Integrity restored in ${(Math.random() * 5).toFixed(1)}s`;
                this.frequencies.fill(0.8);
            }
            return;
        }

        // Output text
        analysisText.innerHTML = `
            <strong>Band:</strong> ${band} | <strong>Floor:</strong> ${noiseLevel}<br>
            <strong>Signatures:</strong> ${detected.join(", ") || "Searching..."}<br>
            <span style="color: #00d4ff;">Correlation indicates likely ${detected.length > 1 ? "Integrated Defense System" : "Isolated Emitter"}.</span>
        `;
    }

    updateSpectrumData() {
        const mode = document.getElementById('sigMode').value;
        const isActive = mode.includes("Active");

        // Noise floor base
        let baseNoise = isActive ? 0.4 : 0.1; // Active scan raises noise

        for (let i = 0; i < this.frequencies.length; i++) {
            this.frequencies[i] = Math.max(0, baseNoise + (Math.random() - 0.5) * 0.1);
        }

        // Inject signals (filtered by band if I wanted to be super complex, but we'll stick to mock emitters)
        this.emitters.forEach(e => {
            const bin = Math.floor((e.freq / 20) * 512);
            if (bin < 512 && bin >= 0) {
                // Pulse Signal with blink effect
                if (Date.now() % e.interval < 150) {
                    this.frequencies[bin] = e.power;
                    // Side lobes
                    if (bin > 2) this.frequencies[bin - 2] = e.power * 0.3;
                    if (bin < 509) this.frequencies[bin + 2] = e.power * 0.3;
                }
            }
        });

        // Waterfall history
        this.waterfallData.unshift(new Float32Array(this.frequencies));
        if (this.waterfallData.length > 100) this.waterfallData.pop();
    }

    drawSpectrum() {
        if (!this.ctxSpectrum) return;
        const ctx = this.ctxSpectrum;
        const w = this.spectrumCanvas.width;
        const h = this.spectrumCanvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        ctx.moveTo(0, h);

        const binWidth = w / 512;

        for (let i = 0; i < 512; i++) {
            const val = this.frequencies[i];
            const y = h - (val * h * 0.9);
            ctx.lineTo(i * binWidth, y);
        }

        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Grid
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.beginPath();
        for (let i = 0; i < w; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
        for (let j = 0; j < h; j += 50) { ctx.moveTo(0, j); ctx.lineTo(w, j); }
        ctx.stroke();
    }

    drawWaterfall() {
        if (!this.ctxWaterfall) return;
        const ctx = this.ctxWaterfall;
        const w = this.waterfallCanvas.width;
        const h = this.waterfallCanvas.height;

        const binWidth = w / 512;
        const rowHeight = h / 100;

        this.waterfallData.forEach((row, rowIndex) => {
            for (let i = 0; i < row.length; i++) {
                const val = row[i];
                if (val > 0.3) {
                    const intensity = Math.min(255, val * 255);
                    ctx.fillStyle = `rgba(${intensity}, ${255 - intensity}, 0, ${val})`; // Red/Green heatmap
                    ctx.fillRect(i * binWidth, rowIndex * rowHeight, binWidth, rowHeight);
                }
            }
        });
    }
}
