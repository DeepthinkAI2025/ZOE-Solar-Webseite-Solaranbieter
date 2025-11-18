interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
    defaultTTL: number; // Default time to live in milliseconds
    maxSize: number; // Maximum number of entries in cache
    cleanupInterval: number; // Interval for cleaning up expired entries
}

interface AnalyticsEvent {
    type: 'message' | 'inquiry' | 'voice_input' | 'document_generation' | 'error';
    timestamp: number;
    data: any;
    sessionId?: string;
}

class AICacheService {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private config: CacheConfig;
    private cleanupTimer?: NodeJS.Timeout;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            defaultTTL: 5 * 60 * 1000, // 5 minutes default
            maxSize: 100,
            cleanupInterval: 60 * 1000, // 1 minute
            ...config,
        };

        this.startCleanup();
    }

    private startCleanup() {
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }

        // If cache is still too large, remove oldest entries
        if (this.cache.size > this.config.maxSize) {
            const entries = Array.from(this.cache.entries())
                .sort(([, a], [, b]) => a.timestamp - b.timestamp);

            const toDelete = entries.slice(0, this.cache.size - this.config.maxSize);
            toDelete.forEach(([key]) => this.cache.delete(key));
        }
    }

    public set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.config.defaultTTL,
        };

        this.cache.set(key, entry);

        // Prevent cache from growing too large
        if (this.cache.size > this.config.maxSize) {
            this.cleanup();
        }
    }

    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    public has(key: string): boolean {
        return this.get(key) !== null;
    }

    public delete(key: string): boolean {
        return this.cache.delete(key);
    }

    public clear(): void {
        this.cache.clear();
    }

    public size(): number {
        return this.cache.size;
    }

    public keys(): string[] {
        return Array.from(this.cache.keys());
    }

    // Specialized cache methods for AI chat
    public cacheMessageResponse(prompt: string, response: string, ttl = 300000): void {
        const key = `message:${this.hashString(prompt)}`;
        this.set(key, response, ttl);
    }

    public getCachedMessageResponse(prompt: string): string | null {
        const key = `message:${this.hashString(prompt)}`;
        return this.get<string>(key);
    }

    public cacheRoofAnalysis(address: string, analysis: any, ttl = 3600000): void {
        const key = `roof:${this.hashString(address)}`;
        this.set(key, analysis, ttl);
    }

    public getCachedRoofAnalysis(address: string): any | null {
        const key = `roof:${this.hashString(address)}`;
        return this.get(key);
    }

    public cacheProductComparison(products: string[], analysis: string, ttl = 1800000): void {
        const key = `comparison:${this.hashString(products.join(','))}`;
        this.set(key, analysis, ttl);
    }

    public getCachedProductComparison(products: string[]): string | null {
        const key = `comparison:${this.hashString(products.join(','))}`;
        return this.get(key);
    }

    private hashString(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    public destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.clear();
    }
}

class AIAnalyticsService {
    private events: AnalyticsEvent[] = [];
    private sessionId: string;
    private config: {
        maxEvents: number;
        flushInterval: number;
    };

    constructor(config: Partial<{ maxEvents: number; flushInterval: number }> = {}) {
        this.sessionId = this.generateSessionId();
        this.config = {
            maxEvents: 1000,
            flushInterval: 30000, // 30 seconds
            ...config,
        };

        this.startFlushInterval();
        this.loadPersistedEvents();
    }

    private generateSessionId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private startFlushInterval() {
        setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);
    }

    private loadPersistedEvents() {
        try {
            const stored = sessionStorage.getItem('aiChatAnalytics');
            if (stored) {
                this.events = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load analytics events:', error);
        }
    }

    private persistEvents() {
        try {
            sessionStorage.setItem('aiChatAnalytics', JSON.stringify(this.events));
        } catch (error) {
            console.error('Failed to persist analytics events:', error);
        }
    }

    public trackMessage(data: { sender: string; messageLength: number; responseTime?: number; isError?: boolean }) {
        this.trackEvent('message', {
            ...data,
            timestamp: Date.now(),
        });
    }

    public trackInquiry(data: { serviceType?: string; userType?: string; completionTime: number; success: boolean }) {
        this.trackEvent('inquiry', {
            ...data,
            timestamp: Date.now(),
        });
    }

    public trackVoiceInput(data: { duration: number; success: boolean; language?: string }) {
        this.trackEvent('voice_input', {
            ...data,
            timestamp: Date.now(),
        });
    }

    public trackDocumentGeneration(data: { type: string; success: boolean; generationTime: number }) {
        this.trackEvent('document_generation', {
            ...data,
            timestamp: Date.now(),
        });
    }

    public trackError(data: { error: string; context?: string; severity?: 'low' | 'medium' | 'high' }) {
        this.trackEvent('error', {
            ...data,
            timestamp: Date.now(),
        });
    }

    private trackEvent(type: AnalyticsEvent['type'], data: any) {
        const event: AnalyticsEvent = {
            type,
            timestamp: Date.now(),
            data,
            sessionId: this.sessionId,
        };

        this.events.push(event);

        // Prevent memory leaks
        if (this.events.length > this.config.maxEvents) {
            this.events = this.events.slice(-this.config.maxEvents);
        }

        this.persistEvents();
    }

    public getAnalytics(timeRange?: { start: number; end: number }) {
        let filteredEvents = this.events;

        if (timeRange) {
            filteredEvents = this.events.filter(
                event => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
            );
        }

        return {
            totalEvents: filteredEvents.length,
            eventsByType: this.groupEventsByType(filteredEvents),
            averageResponseTime: this.calculateAverageResponseTime(filteredEvents),
            errorRate: this.calculateErrorRate(filteredEvents),
            sessionDuration: this.calculateSessionDuration(filteredEvents),
        };
    }

    private groupEventsByType(events: AnalyticsEvent[]) {
        return events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    private calculateAverageResponseTime(events: AnalyticsEvent[]) {
        const messageEvents = events.filter(event => event.type === 'message' && event.data.responseTime);
        if (messageEvents.length === 0) return 0;

        const totalTime = messageEvents.reduce((sum, event) => sum + event.data.responseTime, 0);
        return totalTime / messageEvents.length;
    }

    private calculateErrorRate(events: AnalyticsEvent[]) {
        const allEvents = events.filter(event => event.type !== 'error');
        const errorEvents = events.filter(event => event.type === 'error');

        if (allEvents.length === 0) return 0;
        return (errorEvents.length / (allEvents.length + errorEvents.length)) * 100;
    }

    private calculateSessionDuration(events: AnalyticsEvent[]) {
        if (events.length === 0) return 0;

        const timestamps = events.map(event => event.timestamp);
        const start = Math.min(...timestamps);
        const end = Math.max(...timestamps);

        return end - start;
    }

    private flushEvents() {
        // In a real application, you would send these events to your analytics service
        // For now, we'll just keep them in sessionStorage
        console.log('Analytics flush:', {
            sessionId: this.sessionId,
            eventCount: this.events.length,
            analytics: this.getAnalytics(),
        });
    }

    public clearSession() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        sessionStorage.removeItem('aiChatAnalytics');
    }

    public exportAnalytics() {
        return {
            sessionId: this.sessionId,
            events: this.events,
            summary: this.getAnalytics(),
        };
    }
}

// Export singleton instances
export const aiCacheService = new AICacheService();
export const aiAnalyticsService = new AIAnalyticsService();

// Export classes for testing or custom instances
export { AICacheService, AIAnalyticsService };