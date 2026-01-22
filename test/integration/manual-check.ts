import { RedditService } from "../../src/services/reddit.js";
import { PublicClient } from "../../src/services/publicClient.js";
import { MemoryCache } from "../../src/services/memoryCache.js";
import { RedisCache } from "../../src/services/redisCache.js";
import { config } from "../../src/config.js";

async function runManualTest() {
    console.log("Constructing Dependencies...");
    const client = new PublicClient();
    
    // Smart Selection for Test too
    let cache;
    if (config.redis.url) {
        console.log("Selecting Redis Cache...");
        cache = new RedisCache(config.redis.url);
    } else {
        console.log("Selecting Memory Cache...");
        cache = new MemoryCache();
    }
    
    console.log("Injecting Dependencies into Service...");
    const service = new RedditService(client, cache);

    console.log("\n--- TEST START ---");

    // Test 1: Fetch Data (Should hit API)
    console.log("Fetching r/javascript (First Call - Expect API Hit)...");
    const start1 = Date.now();
    const posts1 = await service.getSubredditPosts("javascript");
    const time1 = Date.now() - start1;
    console.log(`Got ${posts1.length} posts in ${time1}ms`);

    // Test 2: Fetch Data Again (Should hit Cache)
    console.log("\nFetching r/javascript (Second Call - Expect Cache Hit)...");
    const start2 = Date.now();
    const posts2 = await service.getSubredditPosts("javascript");
    const time2 = Date.now() - start2;
    console.log(`Got ${posts2.length} posts in ${time2}ms`);

    if (time2 < 50) { // Redis might take 1-2ms, so we bump limit slightly
        console.log("\n SUCCESS: Cache is working.");
    } else {
        console.log("\n WARNING: Cache might not be working (Response was slow).");
    }
    
    // Keep process alive briefly for logs to flush
    await new Promise(r => setTimeout(r, 100));
    process.exit(0);
}

runManualTest().catch(console.error);