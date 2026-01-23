import parseComments from "../utils/parseComments.js";
import { logger } from "../utils/logger.js";
export class RedditService {
    static BASE_URL = 'https://www.reddit.com';
    static CACHE_TTL = 5 * 60 * 1000;
    cache;
    client;
    constructor(client, cache) {
        this.client = client;
        this.cache = cache;
    }
    async fetchWithCache(url) {
        const start = Date.now();
        // 1. Try Cache
        const cached = await this.cache.get(url);
        if (cached) {
            logger.info({
                event: "cache_hit",
                url,
                duration: Date.now() - start
            }, "Serving from memory");
            return cached;
        }
        logger.info({ event: "cache_miss", url }, "Fetching via Client");
        try {
            const data = await this.client.fetch(url);
            await this.cache.set(url, data, RedditService.CACHE_TTL);
            logger.debug({
                event: "fetch_success",
                url,
                duration: Date.now() - start
            }, "Request completed");
            return data;
        }
        catch (error) {
            logger.error({
                event: "fetch_error",
                url,
                error: error.message
            }, "Failed to fetch data");
            throw error;
        }
    }
    async getSubredditPosts(subreddit) {
        const url = `${RedditService.BASE_URL}/r/${subreddit}/hot.json?limit=500`;
        const response = await this.fetchWithCache(url);
        return response.data.children.map((child) => ({
            title: child.data.title,
            url: `${RedditService.BASE_URL}${child.data.permalink}`,
            author: child.data.author,
            score: child.data.score || 0,
            num_comments: child.data.num_comments || 0,
            created_utc: child.data.created_utc
        }));
    }
    async searchReddit(query, sort = 'relevance') {
        const safeQuery = encodeURIComponent(query);
        let apiSort = sort;
        let timeFrame = 'all';
        let limit = 50;
        if (sort === 'relevance') {
            timeFrame = 'year';
            apiSort = 'relevance';
        }
        else if (sort === 'top') {
            timeFrame = 'all';
            apiSort = 'top';
        }
        else if (sort === 'comments') {
            timeFrame = 'all';
            apiSort = 'relevance';
            limit = 100;
        }
        const url = `${RedditService.BASE_URL}/search.json?q=${safeQuery}&limit=${limit}&sort=${apiSort}&t=${timeFrame}`;
        const response = await this.fetchWithCache(url);
        let posts = response.data.children.map((child) => ({
            title: child.data.title,
            url: `${RedditService.BASE_URL}${child.data.permalink}`,
            author: child.data.author,
            score: child.data.score || 0,
            num_comments: child.data.num_comments || 0,
            created_utc: child.data.created_utc
        }));
        if (sort === 'comments') {
            posts.sort((a, b) => b.num_comments - a.num_comments);
            posts = posts.slice(0, 50);
        }
        return posts;
    }
    async getPostComments(permalink) {
        const url = `${RedditService.BASE_URL}${permalink}.json`;
        const response = await this.fetchWithCache(url);
        const commentData = response[1].data.children;
        return parseComments(commentData);
    }
}
//# sourceMappingURL=reddit.js.map