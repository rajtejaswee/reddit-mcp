import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { RedditService } from "./services/reddit.js";
const server = new McpServer({
    name: "reddit-mcp",
    version: "1.0.0"
});
const transport = new StdioServerTransport();
async function main() {
    server.tool("get_subreddit_posts", "Get recent post from specific subreddit", {
        subreddit: z.string().describe("The name of the subreddit (eg: 'reactjs')")
    }, async ({ subreddit }) => {
        try {
            const post = await RedditService.getSubredditPosts(subreddit);
            const formatted = post.map(p => {
                return `[${p.data.score} upvotes] ${p.data.title} (ID: ${p.data.id})`;
            }).join("\n");
            return {
                content: [{ type: "text", text: formatted }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    });
    server.tool("search-reddit", "Search for posts on Reddit by keyword", {
        query: z.string().describe("The search keywords (eg: 'Reactjs 19 release')"),
    }, async ({ query }) => {
        try {
            const post = await RedditService.searchReddit(query);
            const formatted = post.map(p => {
                return `[${p.data.score} upvotes] ${p.data.title} (Subreddit: ${p.data.subreddit}) (ID: ${p.data.id})`;
            }).join("\n");
            return {
                content: [{ type: "text", text: formatted }]
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true
            };
        }
    });
    await server.connect(transport);
    console.error("Reddit MCP Server running on Studio");
}
main().catch((error) => {
    console.error("Fatal error", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map