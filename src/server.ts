#!/usr/bin/env node
import express from "express"
import { PublicClient } from "./services/publicClient.js"
import { RedditService } from "./services/reddit.js"
import { RedisCache } from "./services/redisCache.js"
import { MemoryCache } from "./services/memoryCache.js"
import { config } from "./utils/config.js"
import { logger } from "./utils/logger.js"
import { ICache } from "./types/types.js"
import cors from "cors";
import rateLimit from "express-rate-limit";

const client = new PublicClient();
let cache: ICache;

if(config.redis.url) {
    cache = new RedisCache(config.redis.url)
}
else {
    cache = new MemoryCache();
}

const service = new RedditService(client, cache);

const app = express();
app.use(cors());

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 30, 
    standardHeaders: true,
	legacyHeaders: false,
    message: { error: "Too many requests, please slow down." }
});

app.use("/api/", limiter);

app.get("/api/subreddit/:name", async (req, res) => {
    try {
        const posts = await service.getSubredditPosts(req.params.name);
        res.json({data: posts});
    }
    catch(error: any) {
        logger.error({error: error.message}, "API Error");
        res.status(500).json({ error: error.message });
    }
})

app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.q as string;
        // Fix: Cast sort to the union type including 'comments'
        const sort = (req.query.sort as string) || 'relevance';

        if(!query) {
            throw new Error("Missing q parameter");
        }

        const posts = await service.searchReddit(query, sort as 'relevance' | 'top' | 'comments');
        res.json({ data: posts });
    }
    catch(error: any) {
        logger.error({error: error.message}, "API Error");
        if (error.message.includes("429")) {
             res.status(429).json({ error: "Reddit is overloaded. Try again in a minute." });
        } else {
             res.status(500).json({ error: error.message });
        }
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`HTTP Server running on port ${PORT}`);
});
