class PostAnalysis {
    constructor() {
        this.canvas = document.getElementById('replayCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.logList = document.getElementById('missionLogList');

        this.timeSlider = document.getElementById('replayTimeline');
        this.timeDisplay = document.getElementById('replayTime');

        window.addEventListener('resize', () => this.resize());

        this.isPlaying = false;
        this.playbackTime = 0;
        this.logs = [];
        this.currentLog = null;

        this.initList();
        this.animate();
    }

    initialize() {
        console.log("Initializing Post Analysis...");
        this.resize();
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
    }

    initList() {
        this.logs = [
            { id: "LOG-2025-10-24-001", title: "Sector 7 Incursion", date: "2025-10-24 08:30:00", threat: "UAV Swarm" },
            { id: "LOG-2025-10-23-042", title: "Routine Patrol Scan", date: "2025-10-23 14:15:00", threat: "None" },
            { id: "LOG-2025-10-22-118", title: "Aggressive Intercept", date: "2025-10-22 23:45:00", threat: "Fighter Jet (Hostile)" }
        ];

        if (!this.logList) return;
        this.logList.innerHTML = '';

        this.logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'log-item';
            item.style.padding = '15px';
            item.style.borderBottom = '1px solid rgba(0,212,255,0.1)';
            item.style.cursor = 'pointer';
            item.style.transition = 'background 0.3s';

            item.innerHTML = `
                <div style="font-weight: bold; color: var(--quantum-blue);">${log.title}</div>
                <div style="font-size: 0.8rem; color: #888; margin-top: 5px;">${log.id} | ${log.date}</div>
                <div style="font-size: 0.8rem; margin-top: 5px;">Primary Threat: <span style="color: ${log.threat === 'None' ? '#00ff00' : '#ff3232'}">${log.threat}</span></div>
            `;

            item.addEventListener('mouseenter', () => item.style.background = 'rgba(0,212,255,0.05)');
            item.addEventListener('mouseleave', () => item.style.background = 'transparent');
            item.addEventListener('click', () => {
                this.currentLog = log;
                this.isPlaying = true;
                this.playbackTime = 0;
            });

            this.logList.appendChild(item);
        });
    }

    animate() {
        this.drawReplay();

        if (this.isPlaying) {
            this.playbackTime += 0.5;
            if (this.playbackTime > 100) this.playbackTime = 0;
            if (this.timeSlider) this.timeSlider.value = this.playbackTime;
            if (this.timeDisplay) {
                const totalSeconds = Math.floor((this.playbackTime / 100) * 90); // 90 mins max
                this.timeDisplay.textContent = `00:${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    drawReplay() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Radar Grid (Simplified)
        ctx.strokeStyle = '#004488';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, h * 0.4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, h * 0.2, 0, Math.PI * 2); ctx.stroke();

        // Scan Line
        const angle = (Date.now() / 1000) * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * h * 0.4, cy + Math.sin(angle) * h * 0.4);
        ctx.strokeStyle = '#00ff00';
        ctx.stroke();

        // Replay Text
        if (!this.currentLog) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("SELECT MISSION LOG TO PLAY", cx, cy);
        } else {
            ctx.fillStyle = '#00d4ff';
            ctx.fillText("REPLAYING: " + this.currentLog.id, cx, 30);

            // Fake Dots
            const seed = this.currentLog.id.length;
            const t = this.playbackTime / 100;
            const x = cx + Math.cos(t * 5 + seed) * (h * 0.3);
            const y = cy + Math.sin(t * 3) * (h * 0.3);

            ctx.fillStyle = '#ff3232';
            ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
}
