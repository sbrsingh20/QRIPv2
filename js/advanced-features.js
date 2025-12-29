// Advanced Radar Features Module
class AdvancedRadarFeatures {
    constructor() {
        // Detection probability constants
        this.radarPowerWatts = 1000000; // 1MW
        this.radarFrequencyGHz = 10; // X-band
        this.antennaGainDb = 40;
        this.systemNoiseFigureDb = 3;
        this.detectionThresholdDb = 13; // SNR required for detection

        // Weather effects
        this.weatherConditions = 'clear'; // clear, rain, fog, storm
        this.weatherAttenuation = {
            clear: 1.0,
            rain: 0.85,
            fog: 0.75,
            storm: 0.6
        };

        // Track quality thresholds
        this.trackQualityLevels = {
            excellent: { min: 0.9, color: '#00ff88', label: 'Excellent' },
            good: { min: 0.75, color: '#00d4ff', label: 'Good' },
            fair: { min: 0.6, color: '#ffcc00', label: 'Fair' },
            poor: { min: 0.4, color: '#ff9933', label: 'Poor' },
            critical: { min: 0, color: '#ff3366', label: 'Critical' }
        };

        // Engagement zones (weapon systems)
        this.weaponSystems = [
            { name: 'Long-Range SAM', minRange: 5, maxRange: 400, color: 'rgba(179, 102, 255, 0.15)' },
            { name: 'Medium-Range SAM', minRange: 2, maxRange: 150, color: 'rgba(0, 212, 255, 0.15)' },
            { name: 'Short-Range SAM', minRange: 1, maxRange: 50, color: 'rgba(0, 255, 136, 0.15)' },
            { name: 'CIWS/Point Defense', minRange: 0.5, maxRange: 5, color: 'rgba(255, 204, 0, 0.2)' }
        ];

        // Range ring configurations
        this.rangeRingModes = {
            tactical: { spacing: 10, count: 5, showBearings: true },
            regional: { spacing: 50, count: 10, showBearings: true },
            strategic: { spacing: 200, count: 10, showBearings: false },
            custom: { spacing: 100, count: 10, showBearings: true }
        };

        this.currentRingMode = 'tactical';
        this.showEngagementZones = true;
        this.showDetectionProbability = false;
    }

    // Calculate detection probability using radar equation
    calculateDetectionProbability(contact, range) {
        // Simplified radar equation: Pr = (Pt * G^2 * λ^2 * σ) / ((4π)^3 * R^4 * L)

        const wavelength = 0.03; // meters (for 10 GHz)
        const rcs = contact.rcs;

        // Range factor (R^4 in denominator means probability drops rapidly with distance)
        const rangeFactor = Math.pow(range / 1000, 4); // Convert to meters

        // RCS factor (larger RCS = easier to detect)
        const rcsFactor = rcs / 10; // Normalized

        // Weather attenuation
        const weatherFactor = this.weatherAttenuation[this.weatherConditions];

        // Base probability from radar equation
        let baseProbability = (rcsFactor * weatherFactor) / (rangeFactor * 0.0001);

        // Stealth reduction
        if (contact.classData && contact.classData.type === 'UAV' && rcs < 1) {
            baseProbability *= 0.7; // Stealth drones harder to detect
        }

        // ECM degradation
        if (contact.ecmActive) {
            baseProbability *= 0.5; // Heavy jamming reduces detection
        }

        // Altitude factor (higher altitude = better detection for airborne targets)
        if (contact.altitude > 5000) {
            baseProbability *= 1.2;
        } else if (contact.altitude < 500) {
            baseProbability *= 0.8; // Low-altitude masking
        }

        // Clamp to [0, 1]
        return Math.max(0.1, Math.min(0.99, baseProbability));
    }

    // Calculate track quality based on multiple factors
    calculateTrackQuality(contact) {
        let quality = 0;

        // Signal strength contribution (40%)
        quality += (contact.signalStrength || 0.8) * 0.4;

        // Track history contribution (30%)
        const historyQuality = contact.trackHistory && contact.trackHistory.length > 0
            ? Math.min(contact.trackHistory.length / 10, 1)
            : 0;
        quality += historyQuality * 0.3;

        // RCS consistency (20%)
        const rcsQuality = contact.rcs > 1 ? 0.9 : contact.rcs > 0.5 ? 0.7 : 0.5;
        quality += rcsQuality * 0.2;

        // Update rate (10%)
        const updateQuality = 0.9; // Assume good update rate
        quality += updateQuality * 0.1;

        // Penalize ECM
        if (contact.ecmActive) {
            quality *= 0.7;
        }

        // Penalize low signal
        if (contact.signalStrength < 0.4) {
            quality *= 0.8;
        }

        // Fusion quality bonus
        if (contact.fusionMetadata && contact.fusionMetadata.numSources > 2) {
            quality *= 1.15; // Multi-sensor tracking is more reliable
        }

        return Math.max(0.1, Math.min(1, quality));
    }

    // Get track quality level and color
    getTrackQualityLevel(quality) {
        for (const [level, config] of Object.entries(this.trackQualityLevels)) {
            if (quality >= config.min) {
                return { level, ...config };
            }
        }
        return this.trackQualityLevels.critical;
    }

    // Check if contact is within engagement zone
    getEngagementZones(contact) {
        const zones = [];
        this.weaponSystems.forEach(weapon => {
            if (contact.distance >= weapon.minRange && contact.distance <= weapon.maxRange) {
                zones.push(weapon.name);
            }
        });
        return zones;
    }

    // Get optimal weapon for contact
    getOptimalWeapon(contact) {
        const inRange = this.weaponSystems.filter(w =>
            contact.distance >= w.minRange && contact.distance <= w.maxRange
        );

        if (inRange.length === 0) return null;

        // Prefer longest range weapon that can reach target
        inRange.sort((a, b) => b.maxRange - a.maxRange);
        return inRange[0];
    }

    // Calculate intercept time
    calculateInterceptTime(contact, weapon) {
        // Assume missile speed is 3x faster than target for SAMs
        const missileSpeed = 3000; // km/h average
        const closingSpeed = missileSpeed + contact.speed;

        const timeToIntercept = (contact.distance / closingSpeed) * 60; // minutes
        return timeToIntercept < 0.1 ? 'IMMEDIATE' : `${timeToIntercept.toFixed(1)} min`;
    }

    // Bearing marks for range rings
    getBearingMarks() {
        const marks = [];
        for (let bearing = 0; bearing < 360; bearing += 30) {
            marks.push({
                angle: bearing,
                label: bearing === 0 ? 'N' :
                    bearing === 90 ? 'E' :
                        bearing === 180 ? 'S' :
                            bearing === 270 ? 'W' :
                                `${bearing}°`
            });
        }
        return marks;
    }

    // Enhanced contact with all advanced features
    enhanceContact(contact) {
        // Calculate detection probability
        const detectionProbability = this.calculateDetectionProbability(contact, contact.distance);

        // Calculate track quality
        const trackQuality = this.calculateTrackQuality(contact);
        const trackQualityLevel = this.getTrackQualityLevel(trackQuality);

        // Get engagement zones
        const engagementZones = this.getEngagementZones(contact);
        const optimalWeapon = this.getOptimalWeapon(contact);

        // Calculate intercept time if weapon available
        let interceptTime = null;
        if (optimalWeapon && contact.threat) {
            interceptTime = this.calculateInterceptTime(contact, optimalWeapon);
        }

        return {
            ...contact,
            detectionProbability,
            trackQuality,
            trackQualityLevel,
            engagementZones,
            optimalWeapon,
            interceptTime
        };
    }

    // Render engagement zones on radar
    drawEngagementZones(ctx, centerX, centerY, maxRadius, radarMaxRange) {
        if (!this.showEngagementZones) return;

        this.weaponSystems.forEach(weapon => {
            // Draw outer range ring
            const outerRadius = (weapon.maxRange / radarMaxRange) * maxRadius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
            ctx.fillStyle = weapon.color;
            ctx.fill();
            ctx.strokeStyle = weapon.color.replace('0.15', '0.5').replace('0.2', '0.6');
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw inner range ring
            const innerRadius = (weapon.minRange / radarMaxRange) * maxRadius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();

            // Label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '10px "Roboto Mono"';
            ctx.textAlign = 'center';
            ctx.fillText(weapon.name, centerX, centerY - outerRadius - 5);
        });
    }

    // Draw enhanced range rings with bearing marks
    drawEnhancedRangeRings(ctx, centerX, centerY, maxRadius, radarMaxRange) {
        const mode = this.rangeRingModes[this.currentRingMode];
        const ringCount = Math.min(mode.count, Math.floor(radarMaxRange / mode.spacing));

        for (let i = 1; i <= ringCount; i++) {
            const distance = i * mode.spacing;
            const radius = (distance / radarMaxRange) * maxRadius;

            // Ring circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 - i * 0.02})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Distance label
            ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
            ctx.font = '11px "Roboto Mono"';
            ctx.textAlign = 'center';
            ctx.fillText(`${distance}km`, centerX, centerY - radius - 3);

            // Bearing marks on outermost ring
            if (mode.showBearings && i === ringCount) {
                this.getBearingMarks().forEach(mark => {
                    const angle = (mark.angle * Math.PI) / 180;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    // Tick mark
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    const tickLength = 8;
                    ctx.lineTo(
                        centerX + Math.cos(angle) * (radius - tickLength),
                        centerY + Math.sin(angle) * (radius - tickLength)
                    );
                    ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Label
                    ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
                    ctx.font = 'bold 11px "Roboto Mono"';
                    ctx.textAlign = 'center';
                    const labelOffset = 15;
                    ctx.fillText(
                        mark.label,
                        centerX + Math.cos(angle) * (radius + labelOffset),
                        centerY + Math.sin(angle) * (radius + labelOffset) + 4
                    );
                });
            }
        }
    }

    setWeatherCondition(condition) {
        if (this.weatherAttenuation[condition]) {
            this.weatherConditions = condition;
            console.log(`🌦️ Weather set to: ${condition}`);
        }
    }

    toggleEngagementZones() {
        this.showEngagementZones = !this.showEngagementZones;
        return this.showEngagementZones;
    }

    setRangeRingMode(mode) {
        if (this.rangeRingModes[mode]) {
            this.currentRingMode = mode;
            console.log(`📍 Range ring mode: ${mode}`);
        }
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedRadarFeatures;
}
