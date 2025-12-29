class FleetManager {
    constructor() {
        this.mapCanvas = document.getElementById('fleetMapCanvas');
        this.ctx = this.mapCanvas ? this.mapCanvas.getContext('2d') : null;
        this.fleetList = document.getElementById('radarFleetList');
        this.radars = [];
        this.isRunning = false;

        this.initialized = false;

        // World Map Image (Placeholder or procedural)
        // We will draw a procedural grid/continent outline for sci-fi look

        window.addEventListener('resize', () => this.resize());
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;
        console.log("Initializing Fleet Manager...");

        this.generateFleet();
        this.renderList();
        this.resize();
        this.animate();
    }

    resize() {
        if (this.mapCanvas) {
            this.mapCanvas.width = this.mapCanvas.offsetWidth;
            this.mapCanvas.height = this.mapCanvas.offsetHeight;
            this.drawMap();
        }
    }

    generateFleet() {
        const locations = [
            { region: "North America (NORAD)", lat: 0.3, long: 0.2 },
            { region: "North Atlantic (NATO)", lat: 0.25, long: 0.4 },
            { region: "Europe (Eastern Flank)", lat: 0.35, long: 0.5 },
            { region: "Indo-Pacific (7th Fleet)", lat: 0.45, long: 0.8 },
            { region: "Middle East (CENTCOM)", lat: 0.45, long: 0.55 },
            { region: "Arctic Watch", lat: 0.1, long: 0.3 }
        ];

        const radarTypes = [
            { id: "AN/SPY-6", name: "AMDR (Naval)", range: "2000km" },
            { id: "AN/TPY-2", name: "THAAD (Missile Def)", range: "3000km" },
            { id: "AN/MPQ-64", name: "Sentinel A4 (Army)", range: "120km" },
            { id: "Giraffe 4A", name: "AESA (Mobile)", range: "400km" },
            { id: "Sea-Based X-Band", name: "SBX-1 (Strategic)", range: "5000km" },
            { id: "Quantum-1", name: "Q-SSR (Prototype)", range: "Unknown" }
        ];
        this.updateCounts();
    }

    updateCounts() {
        const active = this.radars.filter(r => r.status === 'ONLINE').length;
        const critical = this.radars.filter(r => r.status === 'CRITICAL').length;
        document.getElementById('activeNodesCount').textContent = active;
        document.getElementById('criticalAlertsCount').textContent = critical;
    }

    renderList() {
        if (!this.fleetList) return;
        this.fleetList.innerHTML = '';

        this.radars.forEach(r => {
            const item = document.createElement('div');
            item.className = 'fleet-item';
            item.style.padding = '15px';
            item.style.borderBottom = '1px solid rgba(0,212,255,0.1)';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.background = r.status === 'CRITICAL' ? 'rgba(255, 50, 50, 0.1)' : 'transparent';

            const color = r.status === 'ONLINE' ? '#00ff00' : (r.status === 'WARNING' ? '#ffcc00' : '#ff3232');

            item.innerHTML = `
                <div>
                    <div style="font-weight: bold; color: var(--quantum-blue);">${r.id} <span style="font-size: 0.8em; color: #888;">[${r.region}]</span></div>
                    <div style="font-size: 0.8rem; color: #aaa; margin-top: 2px;">${r.type} | Range: ${r.range}</div>
                    <div style="font-size: 0.85rem; margin-top: 5px;">Uptime: ${r.uptime} | Temp: ${r.temp.toFixed(1)}°C</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: ${color}; font-weight: bold; border: 1px solid ${color}; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${r.status}</div>
                </div>
            `;
            this.fleetList.appendChild(item);
        });
    }

    animate() {
        this.drawMap();
        requestAnimationFrame(() => this.animate());
    }

    drawMap() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.mapCanvas.width;
        const h = this.mapCanvas.height;

        ctx.clearRect(0, 0, w, h);

        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < w; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

        // Draw World Map Placeholder (simplified outline)
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Abstract contents
        ctx.moveTo(w * 0.1, h * 0.3); ctx.lineTo(w * 0.3, h * 0.2); ctx.lineTo(w * 0.35, h * 0.5); // NA
        ctx.moveTo(w * 0.4, h * 0.2); ctx.lineTo(w * 0.6, h * 0.15); ctx.lineTo(w * 0.55, h * 0.4); // EU
        ctx.stroke();

        // Draw Radars
        const time = Date.now() / 1000;

        this.radars.forEach(r => {
            const x = r.x * w;
            const y = r.y * h;

            const color = r.status === 'ONLINE' ? '#00ff00' : (r.status === 'WARNING' ? '#ffcc00' : '#ff3232');

            // Pulse
            if (r.status !== 'ONLINE' || Math.sin(time * 5 + x) > 0) {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Ring
                ctx.beginPath();
                ctx.arc(x, y, 8 + Math.sin(time * 3) * 2, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }

            // Label
            if (r.status === 'CRITICAL') {
                ctx.fillStyle = '#ff3232';
                ctx.font = '10px monospace';
                ctx.fillText(`ALERT: ${r.id}`, x + 10, y + 3);
            }
        });
    }
}
