import { ChangeEvent } from 'react'
import { Channel, Server } from '../../@types'

export interface ServerResponse extends Omit<Server, 'channels'> {
  channels: Channel[]
}
export type getAllUserServersWithChannelsResponse = ServerResponse[]
