import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useAuth } from '@/contexts/AuthContext'
import { useSendMessage } from '../../hooks'
import MessageInput from '../MessageInput'

// Mock useAuth and useSendMessage
jest.mock('@/contexts/AuthContext')
jest.mock('../../hooks')

// Mocked data
const mockUser = { id: 1, name: 'Test User' }
const mockSendMessage = jest.fn()

// Mock implementations
;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
;(useSendMessage as jest.Mock).mockReturnValue({ mutate: mockSendMessage })

describe('MessageInput Component', () => {
  const scrollToBottom = jest.fn()
  const parsedChannelId = 123
  const parsedServerId = 456

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the input field', () => {
    render(
      <MessageInput
        scrollToBottom={scrollToBottom}
        parsedChannelId={parsedChannelId}
        parsedServerId={parsedServerId}
      />
    )

    const input = screen.getByPlaceholderText('Enter your message')
    expect(input).toBeInTheDocument()
  })

  test('allows the user to type a message', () => {
    render(
      <MessageInput
        scrollToBottom={scrollToBottom}
        parsedChannelId={parsedChannelId}
        parsedServerId={parsedServerId}
      />
    )

    const input = screen.getByPlaceholderText('Enter your message')
    fireEvent.change(input, { target: { value: 'Hello, World!' } })
    expect(input).toHaveValue('Hello, World!')
  })

  test('sends a message when the form is submitted', () => {
    render(
      <MessageInput
        scrollToBottom={scrollToBottom}
        parsedChannelId={parsedChannelId}
        parsedServerId={parsedServerId}
      />
    )

    const input = screen.getByPlaceholderText('Enter your message')
    fireEvent.change(input, { target: { value: 'Hello, World!' } })

    // 추가: 폼 요소에 data-testid를 추가하여 더 명확하게 선택
    const form = screen.getByTestId('message-form')
    fireEvent.submit(form)

    expect(mockSendMessage).toHaveBeenCalledWith({
      channelId: parsedChannelId,
      content: 'Hello, World!',
      tempId: expect.any(Number),
      serverId: parsedServerId,
      authorId: mockUser.id,
    })
    expect(scrollToBottom).toHaveBeenCalled()
  })

  test('does not send a message if the input is empty', () => {
    render(
      <MessageInput
        scrollToBottom={scrollToBottom}
        parsedChannelId={parsedChannelId}
        parsedServerId={parsedServerId}
      />
    )

    const form = screen.getByTestId('message-form')
    fireEvent.submit(form)

    expect(mockSendMessage).not.toHaveBeenCalled()
  })
})
