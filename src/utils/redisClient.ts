import Redis from 'ioredis';

const redis = new Redis({
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
export default redis;
