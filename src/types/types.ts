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

export interface IRedditClient {
  fetch<T>(url: string) : Promise<T>;
}

export interface ICache {
  get<T>(key: string) : Promise<T | null>
  set<T>(key: string, value: T, ttl?: number) : Promise<void>
}