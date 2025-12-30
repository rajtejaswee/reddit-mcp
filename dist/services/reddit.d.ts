import type { RedditPost } from "../types.js";
export declare class RedditService {
    private static base_url;
    static getSubredditPosts(subreddit: string): Promise<RedditPost[]>;
    static searchReddit(query: string): Promise<RedditPost[]>;
}
//# sourceMappingURL=reddit.d.ts.map