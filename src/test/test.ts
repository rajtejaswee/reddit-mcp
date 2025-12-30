import { RedditService } from "../services/reddit.js";

async function test() {
    console.log("Fetching data")
    const posts = await RedditService.getSubredditPosts("javascript")
    console.log(`Found ${posts.length} posts. `)
    console.log("Top post: ", posts[0]?.data.title);
}

test();