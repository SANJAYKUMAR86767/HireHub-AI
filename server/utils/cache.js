const { createClient } = require("redis");

const redisConfigured = Boolean(process.env.REDIS_URL);
let client = null;
let connected = false;

async function getClient() {
  if (!redisConfigured) return null;
  if (client && connected) return client;
  try {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.warn("Redis error:", err.message));
    await client.connect();
    connected = true;
    return client;
  } catch (err) {
    console.warn("Redis connection failed, continuing without cache:", err.message);
    connected = false;
    return null;
  }
}

const JOBS_CACHE_KEY = "hirehub:jobs:list";

async function getCachedJobs(filterKey) {
  const c = await getClient();
  if (!c) return null;
  try {
    const raw = await c.get(`${JOBS_CACHE_KEY}:${filterKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function setCachedJobs(filterKey, data, ttlSeconds = 60) {
  const c = await getClient();
  if (!c) return;
  try {
    await c.setEx(`${JOBS_CACHE_KEY}:${filterKey}`, ttlSeconds, JSON.stringify(data));
  } catch {
    // caching is best-effort, ignore failures
  }
}

async function invalidateJobsCache() {
  const c = await getClient();
  if (!c) return;
  try {
    const keys = await c.keys(`${JOBS_CACHE_KEY}:*`);
    if (keys.length) await c.del(keys);
  } catch {
    // ignore
  }
}

module.exports = { getCachedJobs, setCachedJobs, invalidateJobsCache, redisConfigured };
