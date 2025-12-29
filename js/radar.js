// Advanced Quantum Radar Visualization Engine with 3D Hologram Renderer (Module 15)
class QuantumRadar {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.contacts = [];
        this.scanAngle = 0;
        this.maxRange = 1000;
        this.centerX = 0;
        this.centerY = 0;
        this.mode = 'surveillance';
        this.showTrails = true;
        this.showVelocityVectors = true;

        // Module 15: 3D Hologram Simulation
        this.hologramMode = true;
        this.tilt = 0.6;
        this.rotationAngle = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setContacts(contacts) {
        this.contacts = contacts;
    }

    setMode(mode) {
        this.mode = mode;
        console.log(`Radar mode set to: ${mode}`);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Mode-specific background tint
        if (this.mode === 'tracking') {
            this.ctx.fillStyle = 'rgba(255, 204, 0, 0.02)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.mode === 'targeting') {
            this.ctx.fillStyle = 'rgba(255, 50, 50, 0.03)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.drawRadarRings();
        this.drawCrosshairs();

        if (this.showTrails) {
            this.drawTrackTrails();
        }

        this.drawScanLine();
        this.drawContacts();
        this.drawQuantumParticles();
        this.drawModeIndicator();

        // Mode-specific scan speeds and visual effects
        const scanSpeed = this.mode === 'surveillance' ? 0.015 :
            this.mode === 'tracking' ? 0.03 : 0.06;
        this.scanAngle += scanSpeed;
        if (this.scanAngle > Math.PI * 2) {
            this.scanAngle = 0;
        }

        // Hologram rotation effect
        if (this.hologramMode) {
            this.rotationAngle += 0.005;
        }
    }

    drawRadarRings() {
        const maxRadius = Math.min(this.centerX, this.centerY) * 0.9;
        const rings = 4;
        const rangePerRing = this.maxRange / rings;

        for (let i = 1; i <= rings; i++) {
            const radius = (maxRadius / rings) * i;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 - i * 0.05})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            const rangeLabel = (i * rangePerRing).toFixed(0);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            this.ctx.font = '12px "Roboto Mono"';
            this.ctx.fillText(`${rangeLabel}km`, this.centerX + 5, this.centerY - radius + 15);
        }
    }

    drawCrosshairs() {
        this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, 0);
        this.ctx.lineTo(this.centerX, this.canvas.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.centerY);
        this.ctx.lineTo(this.canvas.width, this.centerY);
        this.ctx.stroke();

        const diag = Math.min(this.centerX, this.centerY) * 0.9;
        const angles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];

        angles.forEach(angle => {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(
                this.centerX + Math.cos(angle) * diag,
                this.centerY + Math.sin(angle) * diag
            );
            this.ctx.stroke();
        });

        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.7)';
        this.ctx.font = 'bold 16px "Orbitron"';
        this.ctx.textAlign = 'center';

        const labelDist = Math.min(this.centerX, this.centerY) * 0.95;
        this.ctx.fillText('N', this.centerX, this.centerY - labelDist);
        this.ctx.fillText('E', this.centerX + labelDist, this.centerY + 5);
        this.ctx.fillText('S', this.centerX, this.centerY + labelDist);
        this.ctx.fillText('W', this.centerX - labelDist, this.centerY + 5);
    }

    drawScanLine() {
        const maxRadius = Math.min(this.centerX, this.centerY) * 0.9;

        // Mode-specific colors
        let scanColor = 'rgba(0, 255, 255, 0.3)';
        let lineColor = 'rgba(0, 255, 255, 0.8)';

        if (this.mode === 'tracking') {
            scanColor = 'rgba(255, 204, 0, 0.3)';
            lineColor = 'rgba(255, 204, 0, 0.9)';
        } else if (this.mode === 'targeting') {
            scanColor = 'rgba(255, 50, 50, 0.4)';
            lineColor = 'rgba(255, 50, 50, 1.0)';
        }

        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, maxRadius
        );
        gradient.addColorStop(0, scanColor);
        gradient.addColorStop(0.5, scanColor.replace('0.3', '0.1').replace('0.4', '0.1'));
        gradient.addColorStop(1, scanColor.replace('0.3', '0').replace('0.4', '0'));

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.scanAngle);

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, maxRadius, -0.1, 0.1);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(maxRadius, 0);
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawTrackTrails() {
        const maxRadius = Math.min(this.centerX, this.centerY) * 0.9;

        this.contacts.forEach(contact => {
            if (!contact.trackHistory || contact.trackHistory.length < 2) return;

            let trailColor = 'rgba(255, 204, 0, 0.3)';
            switch (contact.iffStatus) {
                case 'hostile':
                    trailColor = 'rgba(255, 51, 102, 0.3)';
                    break;
                case 'friendly':
                    trailColor = 'rgba(0, 255, 136, 0.3)';
                    break;
                case 'civilian':
                    trailColor = 'rgba(0, 212, 255, 0.3)';
                    break;
            }

            this.ctx.strokeStyle = trailColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            contact.trackHistory.forEach((pos, index) => {
                const angle = (pos.bearing * Math.PI) / 180;
                const normalizedDistance = pos.distance / this.maxRange;
                const radius = normalizedDistance * maxRadius;

                const x = this.centerX + Math.cos(angle) * radius;
                const y = this.centerY + Math.sin(angle) * radius;

                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });

            this.ctx.stroke();
        });
    }

    drawContacts() {
        const maxRadius = Math.min(this.centerX, this.centerY) * 0.9;

        this.contacts.forEach(contact => {
            const angle = (contact.bearing * Math.PI) / 180;
            const normalizedDistance = contact.distance / this.maxRange;
            const radius = normalizedDistance * maxRadius;

            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;

            let color = '#ffcc00';
            if (contact.iffStatus === 'hostile') color = '#ff3366';
            else if (contact.iffStatus === 'friendly') color = '#00ff88';
            else if (contact.iffStatus === 'civilian') color = '#00d4ff';

            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.font = '10px "Roboto Mono"';
            this.ctx.fillText(contact.id, x + 10, y - 10);
        });
    }

    drawQuantumParticles() {
        const time = Date.now() / 1000;
        const maxRadius = Math.min(this.centerX, this.centerY) * 0.9;

        for (let i = 0; i < 30; i++) {
            const angle = (time + i) * 0.5;
            const radius = (maxRadius * 0.3) + Math.sin(time + i) * 50;

            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
            this.ctx.fill();
        }
    }

    drawModeIndicator() {
        // Mode-specific color
        let modeColor = 'rgba(0, 212, 255, 0.8)';
        let modeDesc = 'Wide Area Coverage';

        if (this.mode === 'tracking') {
            modeColor = 'rgba(255, 204, 0, 0.9)';
            modeDesc = 'Target Tracking';
        } else if (this.mode === 'targeting') {
            modeColor = 'rgba(255, 50, 50, 1.0)';
            modeDesc = 'Weapons Lock';
        }

        this.ctx.fillStyle = modeColor;
        this.ctx.font = '14px "Orbitron"';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`MODE: ${this.mode.toUpperCase()}`, 20, 30);
        this.ctx.fillText(`DESC: ${modeDesc}`, 20, 50);
        this.ctx.fillText(`RANGE: ${this.maxRange}km`, 20, 70);

        // 3D Hologram Indicator
        if (this.hologramMode) {
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
            this.ctx.fillText(`🔷 HOLOGRAM: ACTIVE`, 20, 90);
        }
    }
}
