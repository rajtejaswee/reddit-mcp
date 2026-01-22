import type { ICache } from "../types/types.js";

interface CacheEntry<T> {
    data: T;
    expiry: number
}

export class MemoryCache implements ICache {
    private cache = new Map<string, CacheEntry<any>>();

    async get<T>(key: string) : Promise<T | null> {
        const entry = this.cache.get(key);
        if(!entry) {
            return null;
        }

        return entry.data;
    }

    async set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000) : Promise<void> {
        this.cache.set(key, {
            data: value,
            expiry: Date.now() + ttl,
        })
    }
 }