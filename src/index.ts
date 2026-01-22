#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import { RedditService } from "./services/reddit.js";
import { PublicClient } from "./services/publicClient.js";
import { MemoryCache } from "./services/memoryCache.js";
import { RedisCache } from "./services/redisCache.js";
import { ICache } from "./types/types.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

const redditClient = new PublicClient();
let redditCache: ICache

if(config.redis.url) {
    redditCache = new RedisCache(config.redis.url)
    logger.info("Using Redis Cache")
} else {
    redditCache = new MemoryCache();
    logger.info("Using Memory Cache")
}

const redditService = new RedditService(redditClient, redditCache)
const server = new McpServer ({
    name: "reddit-mcp",
    version: "1.0.0"
})

const transport = new StdioServerTransport();

async function main() {
    server.tool(
        "get_subreddit_posts",
        "Get recent post from specific subreddit",
        {
            subreddit: z.string().describe("The name of the subreddit (eg: 'reactjs')")
        },
        async ({subreddit}) => {
            try {
                const post = await redditService.getSubredditPosts(subreddit);

                const formatted = post.map(p => {
                    return `[${p.data.score} upvotes] ${p.data.title} (ID: ${p.data.id})`;
                }).join("\n");

                return {
                    content: [{type: "text", text : formatted}],
                }
            } catch (error: any) {
                return {
                    content: [{type:"text", text: `Error: ${error.message}`}],
                    isError: true,
                }
            }
        }
    )

    server.tool(
        "search-reddit",
        "Search for posts on Reddit by keyword",

        {
            query: z.string().describe("The search keywords (eg: 'Reactjs 19 release')"),
        },

        async ({query}) => {
            try {
                const post = await redditService.searchReddit(query);
                const formatted = post.map(p => {
                    return `[${p.data.score} upvotes] ${p.data.title} (Subreddit: ${p.data.subreddit}) (ID: ${p.data.id})`
                }).join("\n")

                return {
                    content:[{type:"text", text: formatted}]
                };
            } catch (error:any) {
                return {
                    content:[{type:"text", text: `Error: ${error.message}`}],
                    isError:true
                }
            }
        }

    )

    server.tool(
        "get_post_comments",
        "Get comments for a specific Reddit post. URL format should be: /r/subreddit/comments/id/title/",
        {
            permalink: z.string().describe("The permalink path of the post (e.g. /r/reactjs/comments/123/title/)")
        },

        async ({permalink}) => {
            try {
                const comments = await redditService.getPostComments(permalink);

                if(comments.length === 0) {
                    return {
                        content: [{type: "text", text: "No comments found"}]
                    }
                }

                const formattedComments = comments.join("\n")

                return {
                    content: [{type: "text", text: formattedComments}]
                }
            } catch (error : any ) {
                return {
                    content: [{type: "text", text: `Error: ${error.message}`}],
                    isError: true
                }
            }
        }
    )

    await server.connect(transport);
    console.error("Reddit MCP Server running on Studio")
}

main().catch((error) => {
    console.error("Fatal error", error);
    process.exit(1);
})