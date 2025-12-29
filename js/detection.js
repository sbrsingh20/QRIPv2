// Realistic Warfare Detection System
class DetectionSystem {
    constructor() {
        this.UPDATE_RATE = 100; // ms
        this.contacts = [];
        this.maxContacts = 300; // Scaled for Big Data
        this.lastId = 0;
        this.contactIdCounter = 1;
        this.radarMode = 'surveillance';

        // Simulation area (km)
        this.range = 500;

        this.scenarios = {
            'peace': { hostile: 0.05, civilian: 0.9, speed: 0.5 },
            'tension': { hostile: 0.3, civilian: 0.6, speed: 0.8 },
            'conflict': { hostile: 0.8, civilian: 0.1, speed: 1.2 },
            'mixed': { hostile: 0.4, civilian: 0.5, speed: 1.0 },
            'swarm': { hostile: 0.9, density: 'HIGH', swarmMode: true }
        };

        // Realistic range bands for different contact types (UPDATED WITH MILITARY SPECS)
        this.rangeProfiles = {
            // User Specified Classes
            avian: { minRange: 1, maxRange: 15, rcs: 0.01, maxSpeed: 40, microDoppler: "Flapping wing oscillation (irregular)" },
            rotaryUAV: { minRange: 2, maxRange: 25, rcs: 0.1, maxSpeed: 80, microDoppler: "High-frequency harmonics, rigid body" },
            fixedWingStealth: { minRange: 50, maxRange: 400, rcs: 0.001, maxSpeed: 950, microDoppler: "Low-RCS, specific JEM signature" },
            loiteringMunition: { minRange: 5, maxRange: 60, rcs: 0.05, maxSpeed: 180, microDoppler: "Propeller modulation + Dive profile" },

            // Legacy/Background
            civilianHelo: { minRange: 3, maxRange: 60, rcs: 6, maxSpeed: 250, microDoppler: "Main rotor flash, 350 RPM" },
            commercialAirliner: { minRange: 100, maxRange: 900, rcs: 40, maxSpeed: 900, microDoppler: "Dual-spool turbofan modulation" },
            fighterJet: { minRange: 100, maxRange: 800, rcs: 5, maxSpeed: 2200, microDoppler: "Jet Turbine Modulation (JEM)" }
        };

        // Contact type metadata
        this.classifications = {
            // User Classes
            avian: { category: 'civilian', type: 'Biological', name: 'Avian (Biological)', icon: '🕊️', confidence: 0.998 },
            rotaryUAV: { category: 'hostile', type: 'UAV', name: 'Rotary UAV (Quad)', icon: '🚁', confidence: 0.994 },
            fixedWingStealth: { category: 'hostile', type: 'Aircraft', name: 'Fixed Wing (Stealth)', icon: '✈️', confidence: 0.972 },
            loiteringMunition: { category: 'hostile', type: 'Munition', name: 'Loitering Munition', icon: '💣', confidence: 0.989 },

            // Legacy
            civilianHelo: { category: 'civilian', type: 'Aircraft', name: 'Civilian Helicopter', icon: '🚁', confidence: 0.95 },
            commercialAirliner: { category: 'civilian', type: 'Aircraft', name: 'Commercial Airliner', icon: '✈️', confidence: 0.98 },
            fighterJet: { category: 'hostile', type: 'Aircraft', name: 'Fighter Jet', icon: '✈️', confidence: 0.90 }
        };
    }

    // Generate realistic contacts distributed across ranges
    generateRealisticScenario(scenario = 'mixed') {
        this.contacts = [];
        this.contactIdCounter = 1;

        // "Wall of Steel" Scenario: Massive Swarm + Stealth
        if (scenario === 'swarm' || scenario === 'conflict') {
            // Target A: Stealth Jet
            this.contacts.push(this.createContact('fixedWingStealth'));

            // T-04 to T-54: Loitering Munitions (50 drones)
            for (let i = 0; i < 50; i++) {
                this.contacts.push(this.createContact('loiteringMunition'));
            }

            // Background Clutter
            this.addContactsByRange(['avian', 'civilianHelo'], 20, 30);
        } else {
            // Mixed Training
            this.addContactsByRange(['avian', 'rotaryUAV', 'commercialAirliner', 'fighterJet'], 50, 100);
        }

        return this.contacts;
    }

    addContactsByRange(types, min, max) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        for (let i = 0; i < count; i++) {
            const randomType = types[Math.floor(Math.random() * types.length)];
            this.contacts.push(this.createContact(randomType));
        }
    }

    createContact(classification) {
        const classData = this.classifications[classification];
        const rangeProfile = this.rangeProfiles[classification];

        // Generate realistic position within type's range band
        const distance = rangeProfile.minRange + Math.random() * (rangeProfile.maxRange - rangeProfile.minRange);
        const bearing = Math.floor(Math.random() * 360);
        const speed = rangeProfile.maxSpeed * (0.8 + Math.random() * 0.4);

        // Determine threat level
        let severity = 'low';
        if (classData.category === 'hostile') {
            if (classification === 'loiteringMunition' || classification === 'fixedWingStealth') {
                severity = 'critical';
            } else {
                severity = 'high';
            }
        }

        const contact = {
            id: `${classData.category === 'hostile' ? 'T' : (classData.category === 'civilian' ? 'C' : 'U')}-${String(this.contactIdCounter++).padStart(2, '0')}`,
            classification: classification,
            classData: classData,
            iffStatus: classData.category,
            severity: severity,
            threat: classData.category === 'hostile',

            // Military Specs
            microDoppler: rangeProfile.microDoppler,
            confidence: classData.confidence,

            // Position & Movement
            bearing: bearing,
            distance: distance,
            altitude: Math.floor(Math.random() * 10000),
            speed: Math.floor(speed),
            heading: Math.floor(Math.random() * 360),

            // Radar Characteristics
            rcs: rangeProfile.rcs,
            signalStrength: Math.max(0.1, 1 - (distance / 500)),

            // Track Data
            firstDetected: new Date(),
            lastUpdate: new Date(),
            trackQuality: 0.99 // Quantum Precision
        };

        contact.trajectory = this.calculateTrajectory(contact);
        return contact;
    }

    calculateTrajectory(contact) {
        const timeToImpact = contact.speed > 0 ? (contact.distance / contact.speed) * 60 : 999;
        return {
            timeToImpact: timeToImpact,
            estimatedImpact: new Date(Date.now() + timeToImpact * 60000),
            probability: contact.threat ? Math.random() * 100 : 0
        };
    }

    addContact(contact) {
        this.contacts.push(contact);
    }

    removeContact(id) {
        this.contacts = this.contacts.filter(c => c.id !== id);
    }

    getContactById(id) {
        return this.contacts.find(c => c.id === id);
    }

    getAllContacts() {
        return this.contacts.sort((a, b) => {
            if (a.threat && !b.threat) return -1;
            if (!a.threat && b.threat) return 1;
            if (a.threat && b.threat) {
                const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return a.distance - b.distance;
        });
    }

    getContactsInRange(minRange, maxRange) {
        return this.contacts.filter(c => c.distance >= minRange && c.distance <= maxRange);
    }

    getHostileContacts() {
        return this.contacts.filter(c => c.iffStatus === 'hostile');
    }

    getCriticalThreats() {
        return this.contacts.filter(c => c.severity === 'critical');
    }

    getFriendlyContacts() {
        return this.contacts.filter(c => c.iffStatus === 'friendly');
    }

    getCivilianContacts() {
        return this.contacts.filter(c => c.iffStatus === 'civilian');
    }

    getUnknownContacts() {
        return this.contacts.filter(c => c.iffStatus === 'unknown');
    }

    updateContactPositions() {
        this.contacts.forEach(contact => {
            // Store track history
            if (contact.trackHistory.length === 0 || Date.now() - new Date(contact.trackHistory[contact.trackHistory.length - 1].time).getTime() > 3000) {
                contact.trackHistory.push({
                    bearing: contact.bearing,
                    distance: contact.distance,
                    time: new Date()
                });

                if (contact.trackHistory.length > 20) {
                    contact.trackHistory.shift();
                }
            }

            // Simulate movement
            if (contact.threat) {
                contact.distance = Math.max(contact.distance - (contact.speed / 1200), 0); // Approach
            } else {
                const movement = (Math.random() - 0.3) * (contact.speed / 1200);
                contact.distance = Math.max(contact.distance + movement, 0.5);
            }

            contact.bearing = (contact.bearing + Math.random() * 2 - 1) % 360;
            if (contact.bearing < 0) contact.bearing += 360;

            contact.trajectory = this.calculateTrajectory(contact);
            contact.lastUpdate = new Date();

            // Escalate close threats
            if (contact.threat && contact.distance < 200 && contact.severity !== 'critical') {
                contact.severity = 'high';
            }
            if (contact.threat && contact.distance < 100) {
                contact.severity = 'critical';
            }
        });
    }

    getContactStats() {
        return {
            total: this.contacts.length,
            hostile: this.contacts.filter(c => c.iffStatus === 'hostile').length,
            friendly: this.contacts.filter(c => c.iffStatus === 'friendly').length,
            civilian: this.contacts.filter(c => c.iffStatus === 'civilian').length,
            unknown: this.contacts.filter(c => c.iffStatus === 'unknown').length,
            critical: this.contacts.filter(c => c.severity === 'critical').length,
            tracked: this.contacts.filter(c => c.trackHistory.length > 0).length
        };
    }

    setRadarMode(mode) {
        this.radarMode = mode;
    }

    renderContactList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const contacts = this.getAllContacts();

        container.innerHTML = contacts.map(contact => {
            const iffClass = contact.iffStatus;
            const severityBadge = contact.severity ?
                `<span class="threat-severity ${contact.severity}">${contact.severity.toUpperCase()}</span>` :
                `<span class="iff-badge ${iffClass}">${iffClass.toUpperCase()}</span>`;

            return `
                <div class="threat-item ${contact.severity || iffClass}" data-contact-id="${contact.id}" data-iff="${iffClass}">
                    <div class="threat-header">
                        <span class="threat-id">${contact.id}</span>
                        ${severityBadge}
                    </div>
                    <div class="threat-type">
                        <span class="contact-icon">${contact.classData.icon}</span>
                        ${contact.classData.name} • ${contact.distance.toFixed(1)}km
                    </div>
                    <div class="threat-details">
                        <span>Speed: ${contact.speed} km/h</span>
                        <span>Bearing: ${contact.bearing.toFixed(0)}°</span>
                    </div>
                    ${contact.altitude > 0 ? `
                        <div class="threat-details">
                            <span>Alt: ${contact.altitude}m</span>
                            <span>RCS: ${contact.rcs.toFixed(1)}m²</span>
                        </div>
                    ` : ''}
                    ${contact.ecmActive ? '<div class="ecm-indicator">⚡ ECM ACTIVE</div>' : ''}
                </div>
            `;
        }).join('');
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DetectionSystem;
}
