// Multi-Sensor Data Fusion Engine
class FusionEngine {
    constructor(radarNetwork, mlEngine) {
        this.radarNetwork = radarNetwork;
        this.mlEngine = mlEngine;
        this.fusedContacts = [];
        this.correlationThreshold = 0.85;
    }

    // Fuse contacts from multiple radar nodes
    fuseMultiNodeData(allContacts) {
        console.log('🔗 Fusing data from multiple radar nodes...');

        // Distribute contacts to nodes
        this.radarNetwork.distributeContactsToNodes(allContacts);

        // Collect all node detections
        const nodeDetections = [];
        this.radarNetwork.getOnlineNodes().forEach(node => {
            node.localContacts.forEach(contact => {
                nodeDetections.push({
                    contact: contact,
                    node: node,
                    timestamp: new Date()
                });
            });
        });

        // Perform track-to-track correlation
        this.fusedContacts = this.correlateContacts(nodeDetections);

        // ML enhancement
        this.fusedContacts.forEach(fusedContact => {
            // Apply ML classification
            const mlResult = this.mlEngine.classifyContact(fusedContact);
            fusedContact.mlClassification = mlResult;

            // Trajectory prediction
            if (fusedContact.trackHistory && fusedContact.trackHistory.length > 3) {
                fusedContact.trajectoryPrediction = this.mlEngine.predictTrajectory(fusedContact);
            }

            // Anomaly detection
            fusedContact.anomalyDetection = this.mlEngine.detectAnomalies(fusedContact);
        });

        console.log(`✅ Fused ${this.fusedContacts.length} contacts from ${nodeDetections.length} detections`);

        return this.fusedContacts;
    }

    // Track-to-track correlation
    correlateContacts(detections) {
        const correlatedTracks = [];
        const processed = new Set();

        detections.forEach((detection, i) => {
            if (processed.has(i)) return;

            const cluster = [detection];
            processed.add(i);

            // Find correlated detections
            for (let j = i + 1; j < detections.length; j++) {
                if (processed.has(j)) continue;

                const correlation = this.calculateCorrelation(
                    detection.contact,
                    detections[j].contact
                );

                if (correlation > this.correlationThreshold) {
                    cluster.push(detections[j]);
                    processed.add(j);
                }
            }

            // Fuse clustered detections
            if (cluster.length > 0) {
                const fusedContact = this.fuseCluster(cluster);
                correlatedTracks.push(fusedContact);
            }
        });

        return correlatedTracks;
    }

    // Calculate correlation score between two contacts
    calculateCorrelation(contact1, contact2) {
        // Distance similarity (normalized)
        const distanceDiff = Math.abs(contact1.distance - contact2.distance);
        const distanceSimilarity = Math.max(0, 1 - distanceDiff / 100);

        // Bearing similarity
        let bearingDiff = Math.abs(contact1.bearing - contact2.bearing);
        if (bearingDiff > 180) bearingDiff = 360 - bearingDiff;
        const bearingSimilarity = Math.max(0, 1 - bearingDiff / 30);

        // Speed similarity
        const speedDiff = Math.abs(contact1.speed - contact2.speed);
        const speedSimilarity = Math.max(0, 1 - speedDiff / 200);

        // RCS match
        const rcsDiff = Math.abs(contact1.rcs - contact2.rcs);
        const rcsMatch = Math.max(0, 1 - rcsDiff / Math.max(contact1.rcs, contact2.rcs));

        // Quantum correlation bonus
        const quantumBonus = (contact1.quantumCorrelation + contact2.quantumCorrelation) / 2 * 0.1;

        // Weighted correlation score
        const correlationScore =
            distanceSimilarity * 0.4 +
            bearingSimilarity * 0.3 +
            speedSimilarity * 0.2 +
            rcsMatch * 0.1 +
            quantumBonus;

        return correlationScore;
    }

    // Fuse a cluster of correlated detections
    fuseCluster(cluster) {
        // Weighted averaging based on measurement quality
        let totalWeight = 0;
        const fusedData = {
            distance: 0,
            bearing: 0,
            speed: 0,
            rcs: 0,
            altitude: 0,
            signalStrength: 0,
            trackQuality: 0
        };

        cluster.forEach(detection => {
            const weight = detection.contact.measurementQuality || 1;
            totalWeight += weight;

            fusedData.distance += detection.contact.distance * weight;
            fusedData.bearing += detection.contact.bearing * weight;
            fusedData.speed += detection.contact.speed * weight;
            fusedData.rcs += detection.contact.rcs * weight;
            fusedData.altitude += (detection.contact.altitude || 0) * weight;
            fusedData.signalStrength += detection.contact.signalStrength * weight;
            fusedData.trackQuality += detection.contact.trackQuality * weight;
        });

        // Normalize by total weight
        Object.keys(fusedData).forEach(key => {
            fusedData[key] /= totalWeight;
        });

        // Use first contact as base and update with fused data
        const baseContact = cluster[0].contact;
        const fusedContact = {
            ...baseContact,
            distance: fusedData.distance,
            bearing: fusedData.bearing,
            speed: Math.floor(fusedData.speed),
            rcs: fusedData.rcs,
            altitude: Math.floor(fusedData.altitude),
            signalStrength: fusedData.signalStrength,
            trackQuality: fusedData.trackQuality,

            // Fusion metadata
            fusionMetadata: {
                sourceNodes: cluster.map(d => d.node.id),
                numSources: cluster.length,
                fusionQuality: this.calculateFusionQuality(cluster),
                fusionTimestamp: new Date()
            }
        };

        return fusedContact;
    }

    calculateFusionQuality(cluster) {
        // More sources = better quality
        const sourceQuality = Math.min(1, cluster.length / 5);

        // Average measurement quality
        const avgMeasurementQuality = cluster.reduce((sum, d) =>
            sum + (d.contact.measurementQuality || 0.8), 0) / cluster.length;

        // Node diversity (different types better)
        const nodeTypes = new Set(cluster.map(d => d.node.type));
        const diversityBonus = nodeTypes.size / 3;

        return (sourceQuality * 0.4 + avgMeasurementQuality * 0.4 + diversityBonus * 0.2);
    }

    // Resolve conflicts in contradictory data
    resolveConflicts(detections) {
        // Use Bayesian probability updates
        const conflicts = [];

        detections.forEach((d1, i) => {
            for (let j = i + 1; j < detections.length; j++) {
                const d2 = detections[j];

                // Check for significant discrepancies
                const distanceConflict = Math.abs(d1.contact.distance - d2.contact.distance) > 50;
                const speedConflict = Math.abs(d1.contact.speed - d2.contact.speed) > 100;

                if (distanceConflict || speedConflict) {
                    conflicts.push({
                        detection1: d1,
                        detection2: d2,
                        conflictType: distanceConflict ? 'distance' : 'speed',
                        resolution: this.selectBestMeasurement(d1, d2)
                    });
                }
            }
        });

        return conflicts;
    }

    selectBestMeasurement(detection1, detection2) {
        // Select based on node reliability and signal quality
        const score1 = detection1.node.config.reliability *
            detection1.contact.measurementQuality;
        const score2 = detection2.node.config.reliability *
            detection2.contact.measurementQuality;

        return score1 > score2 ? detection1 : detection2;
    }

    getFusedContacts() {
        return this.fusedContacts;
    }

    getFusionStats() {
        const totalSources = this.fusedContacts.reduce((sum, c) =>
            sum + (c.fusionMetadata?.numSources || 1), 0);

        const avgFusionQuality = this.fusedContacts
            .filter(c => c.fusionMetadata)
            .reduce((sum, c) => sum + c.fusionMetadata.fusionQuality, 0) /
            this.fusedContacts.filter(c => c.fusionMetadata).length || 0;

        return {
            fusedContacts: this.fusedContacts.length,
            avgSourcesPerContact: (totalSources / this.fusedContacts.length).toFixed(1),
            avgFusionQuality: (avgFusionQuality * 100).toFixed(1),
            mlEnhanced: this.fusedContacts.filter(c => c.mlClassification).length,
            trajectoryPredicted: this.fusedContacts.filter(c => c.trajectoryPrediction).length,
            anomaliesDetected: this.fusedContacts.filter(c => c.anomalyDetection?.isAnomalous).length
        };
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FusionEngine;
}
