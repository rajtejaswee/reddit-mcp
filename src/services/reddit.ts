import axios from "axios";
import type { RedditResponse } from "../types.js"
import type { RedditPost } from "../types.js"
import parseComments from "../utils/parseComments.js";

export class RedditService {

    private static base_url = 'https://www.reddit.com';

    static async getSubredditPosts(subreddit: string) : Promise<RedditPost[]> {
        try {
            const url = `${this.base_url}/r/${subreddit}/hot.json?limit=100`;

            const response = await axios.get<RedditResponse>(url, {
                headers : {
                    "User-Agent" : "reddit-mcp-client/1.0"
                }
            })

            return response.data.data.children;
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

            const response = await axios.get<RedditResponse>(url, {
                headers : {
                    "User-Agent" : "reddit-mcp-client/1.0"
                }
            })

            return response.data.data.children;
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

            const response = await axios.get<any[]>(url, {
                headers: {
                    "User-Agent" : "reddit-mcp-client/1.0"
                }
            })

            const commentData = response.data[1].data.children;

            return parseComments(commentData)
        } catch (error) {
            if(axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch comments ${error.message}`)
            }
            throw error
        }
    }
}