import { User } from '../@types/user'
import { getRedisClient } from '../config/redis'

export async function addUserToRoom(roomId: number, user: User) {
  const redisClient = getRedisClient()

  await redisClient.sAdd(`room:${roomId}`, JSON.stringify(user))
}

// Removing a user from a room
export async function removeUserFromRoom(roomId: number, user: User) {
  const redisClient = getRedisClient()

  await redisClient.sRem(`room:${roomId}`, JSON.stringify(user))
}

export async function getUsersInRoom(roomId: number) {
  const redisClient = getRedisClient()

  const members = await redisClient.sMembers(`room:${roomId}`)
  return members.map((member) => JSON.parse(member))
}
