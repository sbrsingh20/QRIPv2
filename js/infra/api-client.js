/**
 * API CLIENT - Backend Integration Layer
 * Provides abstraction for all backend communication
 * 
 * Features:
 * - RESTful API wrapper (GET, POST,PUT, DELETE)
 * - WebSocket connection manager
 * - Request/response interceptors
 * - Automatic retry with exponential backoff
 * - Request caching
 * - Error handling
 * - Authentication token management
 */

class APIClient {
    constructor(baseURL = 'http://localhost:3000/api/v1') {
        this.baseURL = baseURL;
        this.token = null;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.websocket = null;
        this.wsUrl = baseURL.replace('/api/v1', '').replace('http', 'ws') + '/ws';

        console.log('[API CLIENT] Initialized with base URL:', this.baseURL);
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('qrip_api_token', token);
    }

    // Get stored token
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem('qrip_api_token');
        }
        return this.token;
    }

    // Clear authentication
    clearAuth() {
        this.token = null;
        localStorage.removeItem('qrip_api_token');
    }

    // Build full URL
    buildURL(endpoint) {
        return `${this.baseURL}${endpoint}`;
    }

    // Get default headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Generic request method with retry logic
    async request(method, endpoint, options = {}) {
        const url = this.buildURL(endpoint);
        const maxRetries = options.retries || 3;
        let lastError = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(url, {
                    method,
                    headers: { ...this.getHeaders(), ...options.headers },
                    body: options.body ? JSON.stringify(options.body) : undefined,
                    ...options.fetchOptions
                });

                // Check if response is ok
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Log success
                if (window.auditLogger) {
                    window.auditLogger.log('API_REQUEST', {
                        method,
                        endpoint,
                        status: response.status
                    });
                }

                return { success: true, data, status: response.status };

            } catch (error) {
                lastError = error;
                console.error(`[API CLIENT] Attempt ${attempt + 1} failed:`, error.message);

                // Report error
                if (window.bugReporter) {
                    window.bugReporter.reportBug({
                        type: 'API_ERROR',
                        message: `API request failed: ${method} ${endpoint}`,
                        severity: attempt === maxRetries - 1 ? 'ERROR' : 'WARNING',
                        details: { method, endpoint, error: error.message, attempt }
                    });
                }

                // Wait before retry (exponential backoff)
                if (attempt < maxRetries - 1) {
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        // All retries failed
        return {
            success: false,
            error: lastError.message,
            status: 0
        };
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // GET request with caching
    async get(endpoint, useCache = true) {
        // Check cache first
        if (useCache) {
            const cached = this.getFromCache(endpoint);
            if (cached) {
                console.log('[API CLIENT] Cache hit:', endpoint);
                return { success: true, data: cached, cached: true };
            }
        }

        const result = await this.request('GET', endpoint);

        // Cache successful responses
        if (result.success && useCache) {
            this.saveToCache(endpoint, result.data);
        }

        return result;
    }

    // POST request
    async post(endpoint, body) {
        return await this.request('POST', endpoint, { body });
    }

    // PUT request
    async put(endpoint, body) {
        return await this.request('PUT', endpoint, { body });
    }

    // DELETE request
    async delete(endpoint) {
        return await this.request('DELETE', endpoint);
    }

    // Cache management
    saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if cache expired
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clearCache() {
        this.cache.clear();
        console.log('[API CLIENT] Cache cleared');
    }

    // WebSocket connection
    connectWebSocket(handlers = {}) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            console.log('[API CLIENT] WebSocket already connected');
            return this.websocket;
        }

        console.log('[API CLIENT] Connecting to WebSocket:', this.wsUrl);

        this.websocket = new WebSocket(this.wsUrl);

        this.websocket.onopen = () => {
            console.log('[API CLIENT] WebSocket connected');
            if (handlers.onOpen) handlers.onOpen();

            // Send authentication
            if (this.token) {
                this.websocket.send(JSON.stringify({
                    type: 'auth',
                    token: this.token
                }));
            }
        };

        this.websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('[API CLIENT] WebSocket message:', message.type);

                if (handlers.onMessage) {
                    handlers.onMessage(message);
                }

                // Type-specific handlers
                if (message.type && handlers[message.type]) {
                    handlers[message.type](message.data);
                }
            } catch (error) {
                console.error('[API CLIENT] WebSocket message parse error:', error);
            }
        };

        this.websocket.onerror = (error) => {
            console.error('[API CLIENT] WebSocket error:', error);
            if (handlers.onError) handlers.onError(error);

            if (window.bugReporter) {
                window.bugReporter.reportBug({
                    type: 'WEBSOCKET_ERROR',
                    message: 'WebSocket connection error',
                    severity: 'ERROR'
                });
            }
        };

        this.websocket.onclose = () => {
            console.log('[API CLIENT] WebSocket closed');
            if (handlers.onClose) handlers.onClose();

            // Auto-reconnect after 5 seconds
            setTimeout(() => {
                console.log('[API CLIENT] Attempting WebSocket reconnect...');
                this.connectWebSocket(handlers);
            }, 5000);
        };

        return this.websocket;
    }

    // Send WebSocket message
    sendWebSocketMessage(type, data) {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            console.error('[API CLIENT] WebSocket not connected');
            return false;
        }

        this.websocket.send(JSON.stringify({ type, data }));
        return true;
    }

    // Disconnect WebSocket
    disconnectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
            console.log('[API CLIENT] WebSocket disconnected');
        }
    }

    // Health check
    async healthCheck() {
        try {
            const result = await this.get('/health', false);
            return result.success;
        } catch (error) {
            return false;
        }
    }
}

// Global instance
window.apiClient = new APIClient();

// Test connection on load
window.addEventListener('DOMContentLoaded', async () => {
    const healthy = await window.apiClient.healthCheck();
    if (healthy) {
        console.log('[API CLIENT] ✅ Backend connection established');
    } else {
        console.warn('[API CLIENT] ⚠️ Backend not available - using mock data');
    }
});
