const redis = require("redis");
const RedisError = require("../errors/RedisError");

const client = redis
  .createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  })
  .on("error", (err) => {
    throw new RedisError(err);
  });

(async () => await client.connect())();

async function getDataFromCache(key) {
  return await client.get(key);
}

async function setDataToCache(key, value, expiration) {
  await client.set(key, value, "EX", expiration);
}

module.exports = { getDataFromCache, setDataToCache };
