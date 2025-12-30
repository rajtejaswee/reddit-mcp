export interface RedditPost {
    data: {
        id: string;
        title: string;
        selftext: string;
        url: string;
        author: string;
        score: number;
        num_comments: number;
        created_utc: number;
        subreddit: string;
    };
}
export interface RedditResponse {
    data: {
        children: RedditPost[];
    };
}
//# sourceMappingURL=types.d.ts.map