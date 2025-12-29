// Military Inventory Management System
class InventorySystem {
    constructor() {
        this.inventory = this.initializeInventory();
    }

    initializeInventory() {
        return [
            {
                id: 'INV-001',
                name: 'Interceptor Missiles',
                category: 'Weapons',
                quantity: 45,
                maxQuantity: 60,
                unit: 'units',
                status: 'available',
                effectivenessAgainst: ['Aerial', 'Ballistic']
            },
            {
                id: 'INV-002',
                name: 'Anti-Aircraft Artillery',
                category: 'Weapons',
                quantity: 12,
                maxQuantity: 15,
                unit: 'units',
                status: 'available',
                effectivenessAgainst: ['Aerial']
            },
            {
                id: 'INV-003',
                name: 'Surface-to-Air Missiles',
                category: 'Weapons',
                quantity: 28,
                maxQuantity: 40,
                unit: 'units',
                status: 'available',
                effectivenessAgainst: ['Aerial', 'Ballistic']
            },
            {
                id: 'INV-004',
                name: 'Tank Battalions',
                category: 'Vehicles',
                quantity: 8,
                maxQuantity: 12,
                unit: 'battalions',
                status: 'available',
                effectivenessAgainst: ['Ground']
            },
            {
                id: 'INV-005',
                name: 'Fighter Jets',
                category: 'Aircraft',
                quantity: 18,
                maxQuantity: 24,
                unit: 'units',
                status: 'available',
                effectivenessAgainst: ['Aerial', 'Ground']
            },
            {
                id: 'INV-006',
                name: 'Naval Destroyers',
                category: 'Naval',
                quantity: 6,
                maxQuantity: 8,
                unit: 'ships',
                status: 'available',
                effectivenessAgainst: ['Naval', 'Aerial']
            },
            {
                id: 'INV-007',
                name: 'Cyber Defense Units',
                category: 'Cyber',
                quantity: 15,
                maxQuantity: 20,
                unit: 'teams',
                status: 'available',
                effectivenessAgainst: ['Cyber']
            },
            {
                id: 'INV-008',
                name: 'Ground Troops',
                category: 'Personnel',
                quantity: 2500,
                maxQuantity: 3000,
                unit: 'soldiers',
                status: 'available',
                effectivenessAgainst: ['Ground']
            },
            {
                id: 'INV-009',
                name: 'Radar Systems',
                category: 'Equipment',
                quantity: 22,
                maxQuantity: 25,
                unit: 'units',
                status: 'operational',
                effectivenessAgainst: ['Aerial', 'Ballistic', 'Naval']
            },
            {
                id: 'INV-010',
                name: 'EMP Weapons',
                category: 'Weapons',
                quantity: 8,
                maxQuantity: 10,
                unit: 'units',
                status: 'available',
                effectivenessAgainst: ['Cyber', 'Ground']
            }
        ];
    }

    getInventory() {
        return this.inventory;
    }

    getAvailableResources() {
        return this.inventory.filter(item =>
            item.status === 'available' || item.status === 'operational'
        );
    }

    getResourceById(id) {
        return this.inventory.find(item => item.id === id);
    }

    getResourcesForThreatType(threatType) {
        return this.inventory.filter(item =>
            item.effectivenessAgainst.includes(threatType) &&
            item.quantity > 0
        );
    }

    allocateResources(resourceId, quantity) {
        const resource = this.getResourceById(resourceId);
        if (!resource) return false;

        if (resource.quantity >= quantity) {
            resource.quantity -= quantity;
            if (resource.quantity === 0) {
                resource.status = 'depleted';
            }
            return true;
        }
        return false;
    }

    restockResource(resourceId, quantity) {
        const resource = this.getResourceById(resourceId);
        if (!resource) return false;

        resource.quantity = Math.min(resource.quantity + quantity, resource.maxQuantity);
        if (resource.quantity > 0) {
            resource.status = 'available';
        }
        return true;
    }

    getInventoryStats() {
        const total = this.inventory.length;
        const available = this.inventory.filter(i => i.quantity > 0).length;
        const depleted = this.inventory.filter(i => i.quantity === 0).length;

        const categories = {};
        this.inventory.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = 0;
            }
            categories[item.category] += item.quantity;
        });

        return {
            total,
            available,
            depleted,
            categories,
            readiness: ((available / total) * 100).toFixed(1)
        };
    }

    renderInventory(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.inventory.map(item => {
            const percentage = (item.quantity / item.maxQuantity) * 100;
            const statusColor = percentage > 70 ? 'success' : percentage > 30 ? 'warning' : 'danger';

            return `
                <div class="inventory-item">
                    <div class="inventory-name">${item.name}</div>
                    <div class="inventory-quantity">
                        <span>${item.quantity} / ${item.maxQuantity} ${item.unit}</span>
                        <div class="quantity-bar">
                            <div class="quantity-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Simulate resource usage over time
    simulateUsage() {
        this.inventory.forEach(item => {
            if (Math.random() < 0.1 && item.quantity > 0) {
                // 10% chance to use resources
                const used = Math.floor(Math.random() * 3) + 1;
                item.quantity = Math.max(0, item.quantity - used);
                if (item.quantity === 0) {
                    item.status = 'depleted';
                }
            }
        });
    }

    // Simulate restocking
    simulateRestock() {
        this.inventory.forEach(item => {
            if (item.quantity < item.maxQuantity && Math.random() < 0.15) {
                // 15% chance to restock
                const restocked = Math.floor(Math.random() * 5) + 1;
                item.quantity = Math.min(item.maxQuantity, item.quantity + restocked);
                if (item.quantity > 0) {
                    item.status = 'available';
                }
            }
        });
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventorySystem;
}
