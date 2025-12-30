export interface RedditPost {
    data : {
        id: string;
        title: string;
        selftext: string;
        url: string;
        author: string;
        score: number;
        num_comments: number;
        created_utc:number;
        subreddit: string;
    };
}

export interface RedditResponse {
    data: {
        children: RedditPost[];
    }
}

export interface RedditComment {
  data: {
    id: string;
    author: string;
    body: string;
    score: number;
   
    replies?: {
      data: {
        children: RedditComment[];
      };
    } | ""; 
  };
}