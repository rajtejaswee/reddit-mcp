import axios from "axios";
import type { RedditResponse } from "../types.js"
import type { RedditPost } from "../types.js"
import parseComments from "../utils/parseComments.js";

interface CacheMemory<T> {
    data: T;
    timestamp: number
}

const CACHE_TL = 5 * 60 * 1000;

export class RedditService {

    private static base_url = 'https://www.reddit.com';
    private static cache = new Map<string, CacheMemory<any>>();

    private static async fetchWithCache<T>(url:string) : Promise<T> {
        const now = Date.now();
        const cached = this.cache.get(url)

        if(cached && (now - cached.timestamp < CACHE_TL)) {
            console.error(`[CACHE HIT] Serving from memory : ${url}`);
            return cached.data
        }

        console.error(`[CACHE MISS] Fetching the API : ${url}`)
        const response = await axios.get<T>(url, {
            headers : {
                "User-Agent" : "reddit-mcp-client/1.0"
            }
        })

        this.cache.set(url, {
            data : response.data,
            timestamp: now
        })

        return response.data;
    }

    static async getSubredditPosts(subreddit: string) : Promise<RedditPost[]> {
        try {
            const url = `${this.base_url}/r/${subreddit}/hot.json?limit=100`;

            const response = await this.fetchWithCache<RedditResponse>(url)
            return response.data.children;
        } catch (error) {
            if(axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch the subreddit: ${error.message}`)
            }
            throw error;
        }
    }

    static async searchReddit(query: string ) : Promise<RedditPost[]> {
        try {
            const safeQuery = encodeURIComponent(query);
            const url = `${this.base_url}/search.json?q=${safeQuery}&limit=100`;

            const response = await this.fetchWithCache<RedditResponse>(url)

            return response.data.children;
        } catch (error) {
             if(axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch the search reddit: ${error.message}`)
             }
             throw error;
        }
    }

    static async getPostComments(permalink: string) : Promise<string[]> {
        try {
            const url = `${this.base_url}${permalink}.json`

            const response = await this.fetchWithCache<any[]>(url)

            const commentData = response[1].data.children;

            return parseComments(commentData)
        } catch (error) {
            if(axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch comments ${error.message}`)
            }
            throw error
        }
    }
}