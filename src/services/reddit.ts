import axios from "axios";
import type { IRedditClient, RedditResponse, RedditPost, ICache } from "../types/types.js"
import parseComments from "../utils/parseComments.js";
import {logger} from "../utils/logger.js"


export class RedditService {
    private static readonly BASE_URL = 'https://www.reddit.com';
    private static readonly CACHE_TTL = 5 * 60 * 1000;

    private cache: ICache;
    private client: IRedditClient;

    constructor(client: IRedditClient, cache: ICache) {
        this.client = client;
        this.cache = cache;
    }

    private async fetchWithCache<T>(url: string): Promise<T> {
        const start = Date.now();
        
        // 1. Try Cache
        const cached = await this.cache.get<T>(url);
        if (cached) {
            logger.info({ 
                event: "cache_hit", 
                url, 
                duration: Date.now() - start 
            }, "Serving from memory");
            return cached;
        }

        // 2. Fetch if missing
        logger.info({ event: "cache_miss", url }, "Fetching via Client");
        
        try {
            const data = await this.client.fetch<T>(url);
            
            // 3. Save to Cache
            await this.cache.set(url, data, RedditService.CACHE_TTL);
            
            logger.debug({ 
                event: "fetch_success", 
                url, 
                duration: Date.now() - start 
            }, "Request completed");

            return data;
        } catch (error: any) {
            logger.error({ 
                event: "fetch_error", 
                url, 
                error: error.message 
            }, "Failed to fetch data");
            throw error;
        }
    }

    async getSubredditPosts(subreddit: string): Promise<RedditPost[]> {
        const url = `${RedditService.BASE_URL}/r/${subreddit}/hot.json?limit=500`;
        const response = await this.fetchWithCache<RedditResponse>(url);
        return response.data.children;
    }

    async searchReddit(query: string): Promise<RedditPost[]> {
        const safeQuery = encodeURIComponent(query);
        const url = `${RedditService.BASE_URL}/search.json?q=${safeQuery}&limit=500`;
        const response = await this.fetchWithCache<RedditResponse>(url);
        return response.data.children;
    }

    async getPostComments(permalink: string): Promise<string[]> {
        const url = `${RedditService.BASE_URL}${permalink}.json`;
        const response = await this.fetchWithCache<any[]>(url);
        const commentData = response[1].data.children;
        return parseComments(commentData);
    }
}