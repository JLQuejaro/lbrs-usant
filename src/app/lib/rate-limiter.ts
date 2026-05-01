import { RateLimiterMemory } from 'rate-limiter-flexible';

const MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX || '5', 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);

export const loginRateLimiter = new RateLimiterMemory({
  points: MAX_ATTEMPTS,
  duration: Math.floor(WINDOW_MS / 1000),
});
