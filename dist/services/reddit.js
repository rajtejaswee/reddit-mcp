import axios from "axios";
export class RedditService {
    static base_url = 'https://www.reddit.com';
    static async getSubredditPosts(subreddit) {
        try {
            const url = `${this.base_url}/r/${subreddit}/hot.json?limit=100`;
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "reddit-mcp-client/1.0"
                }
            });
            return response.data.data.children;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch the subreddit: ${error.message}`);
            }
            throw error;
        }
    }
    static async searchReddit(query) {
        try {
            const safeQuery = encodeURIComponent(query);
            const url = `${this.base_url}/search.json?q=${safeQuery}&limit=100`;
            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "reddit-mcp-client/1.0"
                }
            });
            return response.data.data.children;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch the search reddit: ${error.message}`);
            }
            throw error;
        }
    }
}
//# sourceMappingURL=reddit.js.map