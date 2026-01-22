import pino from 'pino';
import { config } from '../config.js';

export const logger = pino({
    level: config.server.env === 'development' ? 'debug' : 'info',
    ...(config.server.env === 'development' && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        }
    }),

    base: {
        env: config.server.env,
    }
});