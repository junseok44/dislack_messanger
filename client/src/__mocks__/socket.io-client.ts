import { Socket } from 'socket.io-client'

const socket: Partial<Socket> = {
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
}

export const io = jest.fn(() => socket as Socket)
