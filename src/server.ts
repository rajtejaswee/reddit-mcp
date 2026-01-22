import express from "express"
import { PublicClient } from "./services/publicClient.js"
import { RedditService } from "./services/reddit.js"
import { RedisCache } from "./services/redisCache.js"
import { MemoryCache } from "./services/memoryCache.js"
import { config } from "./config.js"
import { logger } from "./utils/logger.js"
import { ICache } from "./types/types.js"
import cors from "cors";

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
        if(!query) {
            throw new Error("Missing q parameter");
            const posts = await service.searchReddit(query);
            res.json({ data: posts });
        }
    }
    catch(error: any) {
        res.status(500).json({error: error.message})
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`HTTP Server running on port ${PORT}`);
});
