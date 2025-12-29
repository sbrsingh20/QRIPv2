class DigitalTwin {
    constructor() {
        this.canvas = document.getElementById('twinCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.terrain = 'Urban Canyon';
        this.elevation = 1500;

        window.addEventListener('resize', () => this.resize());

        this.rotation = 0;
        this.isSimulating = false;

        this.animate();
    }

    initialize() {
        console.log("Initializing Digital Twin...");
        this.resize();
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }

    runSimulation() {
        this.isSimulating = true;
        const el = document.getElementById('twinElevation');
        const ter = document.getElementById('twinTerrain');
        const sky = document.getElementById('twinSky');
        const precip = document.getElementById('twinPrecip');

        this.elevation = parseInt(el.value);
        this.terrain = ter.value;

        const skyCond = sky ? sky.value : "Clear";
        const precipCond = precip ? precip.value : "None";

        // Simulate processing calculation
        document.getElementById('simProb').textContent = "CALCULATING...";
        document.getElementById('accRF').textContent = "--";
        document.getElementById('accCNN').textContent = "--";
        document.getElementById('accQSVM').textContent = "--";
        document.getElementById('modelRec').textContent = "EVALUATING MODELS...";

        setTimeout(() => {
            // Weather penalties
            let attenuation = 0;
            let noise = 0;

            // Sky penalties
            if (skyCond === "Scattered Clouds") attenuation += 2;
            if (skyCond === "Overcast") attenuation += 5;

            // Precip penalties
            if (precipCond === "Light Drizzle") { attenuation += 8; noise += 5; }
            if (precipCond === "Heavy Rain") { attenuation += 25; noise += 15; }
            if (precipCond === "Thunderstorm") { attenuation += 40; noise += 30; }
            if (precipCond === "Snow / Ice") { attenuation += 15; noise += 10; }

            const totalPenalty = attenuation + noise;

            const prob = Math.max(0, (98 - totalPenalty) + (Math.random() * 2));
            const blind = this.elevation > 2000 ? (Math.random() * 5) : (10 + Math.random() * 20);
            const range = 400 + (this.elevation / 10) - (attenuation * 3);

            document.getElementById('simProb').textContent = prob.toFixed(1) + "%";
            document.getElementById('simBlind').textContent = blind.toFixed(1) + "%";
            document.getElementById('simRange').textContent = range.toFixed(0) + " km";

            // AI Model Benchmarking Logic
            // RF: Robust to noise, but lower peak accuracy
            // CNN: High accuracy, sensitive to visual occlusion (rain/clouds)
            // QSVM: High accuracy, computationally expensive, resistant to noise via quantum kernel

            let rfAcc = 92 - (noise * 0.2);
            let cnnAcc = 96 - (attenuation * 1.5) - (noise * 0.5); // CNN hates occlusion
            let qsvmAcc = 98 - (noise * 0.05) - (attenuation * 0.1); // QSVM is robust

            // Normalize
            rfAcc = Math.min(99.9, Math.max(60, rfAcc));
            cnnAcc = Math.min(99.9, Math.max(50, cnnAcc));
            qsvmAcc = Math.min(99.9, Math.max(70, qsvmAcc));

            document.getElementById('accRF').textContent = rfAcc.toFixed(1) + "%";
            document.getElementById('accCNN').textContent = cnnAcc.toFixed(1) + "%";
            document.getElementById('accQSVM').textContent = qsvmAcc.toFixed(1) + "%";

            // Recommended Model
            let best = "Random Forest";
            let bestScore = rfAcc;

            if (cnnAcc > bestScore) { best = "Deep CNN"; bestScore = cnnAcc; }
            if (qsvmAcc > bestScore) { best = "Quantum SVM"; bestScore = qsvmAcc; }

            const recEl = document.getElementById('modelRec');
            recEl.textContent = best;
            recEl.style.color = best === "Quantum SVM" ? "#00ff00" : "#00d4ff";

            this.isSimulating = false;
        }, 1500);
    }



    animate() {
        this.draw();
        this.rotation += 0.002;
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Draw 3D Grid Effect
        ctx.strokeStyle = '#004488';
        ctx.lineWidth = 1;

        const cx = w / 2;
        const cy = h / 2 + 100;

        ctx.save();
        ctx.translate(cx, cy);

        // Terrain Lattice
        for (let i = -10; i <= 10; i++) {
            // Perspective lines
            ctx.beginPath();
            ctx.moveTo(i * 50, 0);
            ctx.lineTo(i * 150 * Math.cos(this.rotation), -300);
            ctx.stroke();

            // Cross lines
            ctx.beginPath();
            ctx.moveTo(-500, -i * 30);
            ctx.lineTo(500, -i * 30);
            ctx.stroke();
        }

        // Radar Dome
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.arc(0, -50 - (this.elevation / 100), 10, 0, Math.PI * 2);
        ctx.fill();

        // Coverage Fan (Cone)
        if (this.isSimulating || !this.isSimulating) { // Always show
            ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
            ctx.beginPath();
            ctx.moveTo(0, -50 - (this.elevation / 100));
            ctx.lineTo(-200, -300);
            ctx.lineTo(200, -300);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }
}
