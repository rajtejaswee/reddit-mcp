import { RedditService } from "../services/reddit.js";
async function testCache() {
    console.log("--- STARTING CACHE TEST ---\n");
    // 1. First Call (Should hit the API)
    console.log("1. Fetching r/javascript (First time)...");
    const start1 = Date.now();
    await RedditService.getSubredditPosts("javascript");
    const end1 = Date.now();
    console.log(`   Time taken: ${end1 - start1}ms (API Call)\n`);
    // 2. Second Call (Should hit the Cache)
    console.log("2. Fetching r/javascript (Second time)...");
    const start2 = Date.now();
    await RedditService.getSubredditPosts("javascript");
    const end2 = Date.now();
    console.log(`   Time taken: ${end2 - start2}ms (Cache)\n`);
    // 3. Conclusion
    if (end2 - start2 < 10) {
        console.log("SUCCESS: Second call was instant! Cache is working.");
    }
    else {
        console.log("FAIL: Second call took too long.");
    }
}
testCache();
//# sourceMappingURL=test-cache.js.map