import type { IRedditClient, RedditPost, ICache } from "../types/types.js";
export declare class RedditService {
    private static readonly BASE_URL;
    private static readonly CACHE_TTL;
    private cache;
    private client;
    constructor(client: IRedditClient, cache: ICache);
    private fetchWithCache;
    getSubredditPosts(subreddit: string): Promise<RedditPost[]>;
    searchReddit(query: string, sort?: 'relevance' | 'top' | 'comments'): Promise<RedditPost[]>;
    getPostComments(permalink: string): Promise<string[]>;
}
