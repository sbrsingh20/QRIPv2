/**
 * LAYER B/H: INSIGHTS & INTELLIGENCE ENGINE
 * Generates deep inference tables, case studies, and actionable actionable_insights.
 */

class InferenceEngine {
    constructor() {
        this.caseStudies = new Map();
        console.log('[IE] Inference Engine ONLINE');
    }

    analyzeContact(contact) {
        // Generate a detailed "Case Study"
        const study = {
            id: contact.id,
            timestamp: new Date().toISOString(),
            threatLevel: contact.severity,
            classification: contact.classification,

            // Deep Inference Data (MIL-STD)
            inference: {
                rcsSignature: `${(contact.rcs).toFixed(4)} m² (Calibrated)`,
                microDoppler: contact.microDoppler || "Ambiguous / Noise",
                confidence: contact.confidence ? `${(contact.confidence * 100).toFixed(1)}%` : "85.0%",
                intent: this.calculateIntent(contact),
                behavior: contact.classification === 'loiteringMunition' ? 'ATTACK PROFILE (DIVING)' : 'SURVEILLANCE'
            },

            // Actionable Insight
            recommendation: this.getRecommendation(contact)
        };

        this.caseStudies.set(contact.id, study);
        return study;
    }

    calculateIntent(contact) {
        if (contact.classification === 'loiteringMunition') return 'SATURATION ATTACK';
        if (contact.classification === 'fixedWingStealth') return 'DEEP STRIKE';
        if (contact.classification === 'avian') return 'MIGRATORY PATTERN';
        return 'UNKNOWN';
    }

    getRecommendation(contact) {
        // Specific Weapon Assignments per User Request
        if (contact.classification === 'fixedWingStealth') {
            return "ASSIGNED: MR-SAM BATTERY 1 (LAUNCH-ON-REMOTE)";
        }
        if (contact.classification === 'loiteringMunition' || contact.classification === 'rotaryUAV') {
            return "ASSIGNED: L-70 ELECTRONIC GUN (FRAG ROUNDS) + HEL (SOFT KILL)";
        }
        if (contact.classification === 'avian') {
            return "ACTION: FILTER CLUTTER (NEGATIVE HOSTILE)";
        }

        // Generic Fallbacks
        if (contact.threat) return "RECOMMEND: ALERT STATUS RED";
        return "RECOMMEND: MONITOR ONLY";
    }
}

class ActionNotifications {
    constructor() {
        this.stream = [];
        this.subscribers = [];
        console.log('[AN] Action Notifications Stream ONLINE');
    }

    publish(event) {
        const payload = {
            id: Date.now(),
            ...event,
            time: new Date().toLocaleTimeString()
        };
        this.stream.unshift(payload);
        if (this.stream.length > 50) this.stream.pop(); // Keep buffer small

        this.notifySubscribers(payload);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers(payload) {
        this.subscribers.forEach(cb => cb(payload));
    }
}

// Export
window.InsightsLayer = {
    InferenceEngine: new InferenceEngine(),
    Notifications: new ActionNotifications()
};
