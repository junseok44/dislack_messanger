import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType

const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379

export const createRedisClient = async (): Promise<void> => {
  if (!redisClient) {
    redisClient = createClient({
      pingInterval: 1000 * 20 * 60,
      url: `redis://${redisHost}:${redisPort}`,
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err)
    })

    await redisClient.connect()

    console.log('Connected to Redis')
  }
}

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error(
      'Redis client is not initialized. Call createRedisClient first.'
    )
  }
  return redisClient
}
