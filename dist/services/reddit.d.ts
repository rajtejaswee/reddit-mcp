import type { RedditPost } from "../types.js";
export declare class RedditService {
    private static base_url;
    private static cache;
    private static fetchWithCache;
    static getSubredditPosts(subreddit: string): Promise<RedditPost[]>;
    static searchReddit(query: string): Promise<RedditPost[]>;
    static getPostComments(permalink: string): Promise<string[]>;
}
//# sourceMappingURL=reddit.d.ts.map