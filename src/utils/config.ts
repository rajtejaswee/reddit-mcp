import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
    reddit: {
        clientId?: string | undefined;      
        clientSecret?: string | undefined;  
        userAgent: string;
    };
    redis:{
        url?: string | undefined;
    }
    server: {
        port: number;
        env: 'development' | 'production';
    };
    logging: {
        level: string;
    }
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key];

    if (value) {
        return value;
    }


    if (defaultValue !== undefined) {
        return defaultValue;
    }

    throw new Error(`FATAL: Missing required environment variable: ${key}`);
};

export const config: Config = {
    reddit: {
        clientId: process.env.REDDIT_CLIENT_ID, 
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        userAgent: getEnvVar('REDDIT_USER_AGENT', 'RedditMCP/1.0.0 (by /u/rajtejaswee)'),
    },
    redis: {
        url: process.env.REDIS_URL || "",
    },
    server: {
        port: parseInt(getEnvVar("PORT", "3000"), 10),
        env: (process.env.NODE_ENV as 'development' | 'production') || 'development',
    },
    logging: {
        level: getEnvVar("LOG_LEVEL", "info"),
    }
};