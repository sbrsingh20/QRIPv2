class MissionPlanner {
    constructor() {
        this.threatList = document.getElementById('strategicThreatList');
        this.resultArea = document.getElementById('missionResult');
        this.generatedContacts = [];

        // Mock Threat Generation
        this.generateThreats();
    }

    generateThreats() {
        if (!this.threatList) return;
        this.threatList.innerHTML = '';

        const threats = [
            { id: "T-01", type: "Su-57 Felon", range: "140km", alt: "35,000ft", bearing: "045" },
            { id: "T-02", type: "DF-21D Ballistic", range: "800km", alt: "Exo-atmo", bearing: "120" },
            { id: "T-03", type: "H-6K Bomber", range: "300km", alt: "28,000ft", bearing: "330" },
            { id: "T-04", type: "J-20 Mighty Dragon", range: "180km", alt: "40,000ft", bearing: "010" }
        ];

        threats.forEach(t => {
            const el = document.createElement('div');
            el.className = 'threat-item';
            el.style.padding = '10px';
            el.style.borderBottom = '1px solid rgba(255, 50, 50, 0.2)';
            el.style.cursor = 'pointer';
            el.style.marginBottom = '5px';
            el.style.background = 'rgba(255, 0, 0, 0.05)';

            el.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-weight:bold; color:#ff3232;">
                    <span>${t.id} [HOSTILE]</span>
                    <span>${t.bearing}°</span>
                </div>
                <div style="font-size:0.85rem; color:#ccc;">
                    ${t.type} | Rng: ${t.range} | Alt: ${t.alt}
                </div>
            `;

            el.addEventListener('click', () => {
                // Highlight logic could go here
                el.style.background = 'rgba(255, 0, 0, 0.2)';
            });

            this.threatList.appendChild(el);
        });
    }

    generatePlan() {
        const type = document.getElementById('missionType').value;
        const asset = document.getElementById('missionAsset').value;
        const roe = document.getElementById('missionROE').value;

        if (!this.resultArea) return;

        this.resultArea.innerHTML = '<div class="loading-text">Deciphering Tactical Data... Calculating Intercept Geometry...</div>';

        setTimeout(() => {
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const missionID = "OP-" + Math.floor(Math.random() * 10000);

            // Calculate Probability of Kill (Pk)
            let pk = 0;
            let analysis = "";

            // Asset Capabilities
            const isStealth = asset.includes("F-35") || asset.includes("F-22");
            const isABM = asset.includes("Aegis") || asset.includes("Patriot");
            const isJammer = asset.includes("Growler");

            // Threat Profile (Mock based on selection logic)
            // Ideally we'd pull the selected threat from the list, but for now we simulate.

            if (type.includes("ABM")) {
                if (isABM) {
                    pk = 92;
                    analysis = "Kinetic Kill Vehicle optimal for Ballistic Trajectory.";
                } else if (isStealth) {
                    pk = 45;
                    analysis = "Ineffective asset against Ballistic Threat (Altitude limitation).";
                } else {
                    pk = 10;
                    analysis = "CRITICAL: Asset incapable of intercept.";
                }
            } else if (type.includes("SEAD")) {
                if (isStealth || isJammer) {
                    pk = 88;
                    analysis = "Stealth/Jamming effective against enemy radar network.";
                } else {
                    pk = 40;
                    analysis = "Non-stealth asset vulnerable to SAM sites.";
                }
            } else if (type.includes("CAP")) {
                if (isStealth) {
                    pk = 95;
                    analysis = "Air Superiority dominance guaranteed.";
                } else {
                    pk = 75;
                    analysis = "Standard engagement profile.";
                }
            }

            // Random variance
            pk = Math.min(99, Math.max(5, pk + (Math.random() * 10 - 5)));

            this.resultArea.innerHTML = `
                <div style="border: 1px solid #00d4ff; padding: 15px; background: rgba(0, 212, 255, 0.05); font-family: monospace;">
                    <h4 style="border-bottom: 1px solid #00d4ff; padding-bottom: 5px; margin-bottom: 10px; color: #00d4ff;">
                        TACTICAL BRIEF: ${missionID}
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                        <div><strong>TYPE:</strong> ${type}</div>
                        <div><strong>ASSET:</strong> ${asset}</div>
                        <div><strong>TIME:</strong> ${timestamp} ZULU</div>
                        <div><strong>ROE:</strong> ${roe}</div>
                    </div>
                    
                    <div style="margin-top: 15px; border-top: 1px dashed rgba(0,212,255,0.3); padding-top: 10px;">
                        <strong>MISSION PROFILE:</strong><br>
                        Vectoring to Intercept. Data Link Active.
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <strong>PROBABILITY OF KILL (Pk):</strong> 
                        <span style="color: ${pk > 70 ? '#00ff00' : '#ff3232'}; font-size: 1.2rem; font-weight: bold;">
                            ${pk.toFixed(1)}%
                        </span>
                        <div style="font-size: 0.8rem; color: #ccc; margin-top:5px;">
                            Analysis: ${analysis}
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" style="width: 100%; margin-top: 15px;" onclick="alert('Mission Order Transmitted to Field Units.')">
                        TRANSMIT ORDERS
                    </button>
                </div>
            `;
        }, 1200);
    }
}
