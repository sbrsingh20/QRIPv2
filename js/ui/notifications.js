class NotificationManager {
    constructor() {
        this.container = document.getElementById('intelFeedList');
        this.init();
    }

    init() {
        if (!window.InsightsLayer || !this.container) {
            console.warn('[NM] Insights Layer or Container not found.');
            return;
        }

        console.log('[NM] UI Notification Manager ONLINE');

        // Subscribe to stream
        window.InsightsLayer.Notifications.subscribe(this.renderNotification.bind(this));

        // System Boot Sequence
        this.bootSequence();
    }

    bootSequence() {
        const logs = [
            { msg: "SYSTEM START: QUANTUM ILLUMINATION PROTOCOL", delay: 500 },
            { msg: "GENERATING ENTANGLED PAIRS... [OK]", delay: 1200 },
            { msg: "IDLER STORAGE: OPTICAL DELAY LINE ACTIVE", delay: 1800 },
            { msg: "TRANSMIT: X-BAND 9.6 GHz @ 10 WATTS", delay: 2400 },
            { msg: "CLUTTER FILTER: QUANTUM CORRELATION MODE [ON]", delay: 3000 }
        ];

        logs.forEach(log => {
            setTimeout(() => {
                this.renderNotification({
                    type: 'SYSTEM',
                    title: 'SYSTEM LOG',
                    message: `> ${log.msg}`,
                    time: new Date().toLocaleTimeString(),
                    risk: 'LOW'
                });
            }, log.delay);
        });
    }

    renderNotification(event) {
        if (!this.container) return;

        const item = document.createElement('div');
        item.className = 'intel-item';
        item.style.borderBottom = '1px solid rgba(0,212,255,0.1)';
        item.style.padding = '10px';
        item.style.marginBottom = '5px';
        item.style.background = 'rgba(0, 20, 40, 0.4)';
        item.style.fontSize = '0.85rem';
        item.style.animation = 'fadeIn 0.3s ease-in';

        // Icon based on type
        const icon = event.type === 'THREAT_DETECTED' ? '🚨' : (event.type === 'INTERCEPT' ? '💥' : 'ℹ️');
        const color = event.risk === 'HIGH' ? '#ff3232' : (event.risk === 'MEDIUM' ? '#ffcc00' : '#00d4ff');

        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="color: ${color}; font-weight: bold;">${icon} ${event.title}</span>
                <span style="color: #666; font-size: 0.75rem;">${event.time}</span>
            </div>
            <div style="color: #ddd; margin-bottom: 8px;">${event.message}</div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-micro" onclick="window.showCaseStudy('${event.contactId}')" style="background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: #00d4ff; padding: 2px 6px; font-size: 0.7rem; cursor: pointer;">🔍 ANALYZE</button>
                <button class="btn-micro" style="background: rgba(255, 50, 50, 0.1); border: 1px solid rgba(255, 50, 50, 0.3); color: #ff3232; padding: 2px 6px; font-size: 0.7rem; cursor: pointer;">🚀 INTERCEPT</button>
            </div>
        `;

        this.container.prepend(item);

        // Prune old
        if (this.container.children.length > 50) {
            this.container.lastElementChild.remove();
        }
    }
}

// Global helper for the "Analyze" button
window.showCaseStudy = (contactId) => {
    const study = window.InsightsLayer.InferenceEngine.caseStudies.get(contactId);
    if (!study) return alert("Data expired or encrypted.");

    // Fill Modal
    const modalContent = document.getElementById('caseStudyContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <h3 style="color: #ffcc00; border-bottom: 1px solid #ffcc00; padding-bottom: 10px;">CASE STUDY: ${study.id}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div>
                    <div class="label">CLASSIFICATION</div>
                    <div class="value">${study.classification}</div>
                </div>
                <div>
                    <div class="label">THREAT LEVEL</div>
                    <div class="value" style="color: red;">${study.threatLevel}</div>
                </div>
                <div>
                    <div class="label">RCS SIGNATURE</div>
                    <div class="value">${study.inference.rcsSignature}</div>
                </div>
                <div>
                    <div class="label">PROPULSION</div>
                    <div class="value">${study.inference.propulsionType}</div>
                </div>
                <div style="grid-column: span 2;">
                    <div class="label">PROBABLE ORIGIN</div>
                    <div class="value">${study.inference.originProb}</div>
                </div>
                 <div style="grid-column: span 2; border: 1px dashed #00d4ff; padding: 10px; margin-top: 10px;">
                    <div class="label" style="color: #00d4ff;">AI RECOMMENDATION</div>
                    <div class="value" style="font-weight: bold;">${study.recommendation}</div>
                </div>
            </div>
        `;
        document.getElementById('caseStudyModal').style.display = 'flex';
    }
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new NotificationManager();
    }, 2000); // Wait for Core layers
});
