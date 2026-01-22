import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
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
        env: 'development' | 'production';
    };
}

const getEnvVar = (key: string, required = true): string => {
    const value = process.env[key];
    if (!value && required) {
        throw new Error(`FATAL: Missing required environment variable: ${key}`);
    }
    return value || '';
};

export const config: Config = {
    reddit: {
        clientId: process.env.REDDIT_CLIENT_ID, 
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        userAgent: getEnvVar('REDDIT_USER_AGENT') || 'mcp-reddit-cli/1.0',
    },
    redis: {
        url: process.env.REDIS_URL
    },
    server: {
        env: (process.env.NODE_ENV as 'development' | 'production') || 'development',
    }
};