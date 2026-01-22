import Redis from "ioredis";
import { ICache } from "../types/types.js"; // Make sure this path points to your types file
import { logger } from "../utils/logger.js";

export class RedisCache implements ICache {
    // FIX 1: Use 'any' to bypass the "Namespace" type error
    private client: any;

    constructor(url: string) {
        // FIX 2: Move the Constructor Logic BEFORE using it
        // We do this to handle "ESM vs CommonJS" import issues
        const RedisConstructor = (Redis as any).default || Redis;

        // FIX 3: Clean instantiation (no logic inside the object)
        this.client = new RedisConstructor(url, {
            retryStrategy: (times: number) => Math.min(times * 50, 2000),
            // Prevent crashing if Redis is offline during dev
            enableOfflineQueue: true,
        });

        // FIX 4: Explicitly type 'err' as 'any'
        this.client.on("error", (err: any) => {
            // Filter out connection refused logs in dev (too noisy)
            if (err.code !== 'ECONNREFUSED') {
                logger.error({ event: "redis_error", error: err.message }, "Redis connection issue");
            }
        });

        this.client.on("connect", () => {
            logger.info({ event: "redis_connected" }, "Connected to Redis");
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.client.get(key);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error: any) {
            logger.error({ event: "redis_get_fail", key, error: error.message });
            return null; // Fail safe (act as cache miss)
        }
    }

    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        try {
            // Redis expects seconds, not ms
            const ttlSeconds = Math.ceil(ttl / 1000);
            const data = JSON.stringify(value);
            await this.client.setex(key, ttlSeconds, data);
        } catch (error: any) {
            logger.error({ event: "redis_set_fail", key, error: error.message });
        }
    }
}