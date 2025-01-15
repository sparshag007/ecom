"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: '127.0.0.1', // Default Redis host
    port: 6379, // Default Redis port
    // Add authentication if your Redis instance requires it:
    // password: 'your_redis_password',
});
redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});
// /opt/homebrew/etc/redis.conf
exports.default = redis;
