import axios from "axios";
import {config} from "../utils/config.js"
import type { IRedditClient } from "../types/types.js";
import { error } from "node:console";

export class PublicClient implements IRedditClient {
    async fetch<T>(url:string): Promise<T> {
        console.log(`[PublicClient] Fetching : ${url}`)

        try {
            const response = await axios.get<T>(url, {
                headers: {
                    "User-Agent": config.reddit.userAgent
                }
            })
            return response.data;
        }
        catch(err) {
            if(axios.isAxiosError(error) && error.response?.status === 429) {
                throw new Error("Rate Limited by Reddit (Public API limit reached). ")
            }
            throw error;
        }
    }
}