import { Channel, Server } from '@/@types'
import { ChannelType } from '@/@types/channel'
import { Divider } from '@/components/ui/Divider'
import Typography from '@/components/ui/Typography'
import { useAuth } from '@/contexts/AuthContext'
import useModal from '@/hooks/useModal'
import useMediaChatStore from '@/store/mediaStore'
import {
  ChevronDown,
  ChevronRight,
  Mic,
  MicOff,
  PhoneOff,
  Plus,
  Settings,
  User,
  Video,
  VideoOff,
  Wifi,
} from 'lucide-react'
import { memo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDeleteChannel } from '../hooks'
import s from '../styles/ChannelSideBar'
import { ChannelItem } from './ChannelItem'
import ChannelSettingForm from './ChannelSettingForm'
import CreateChannelForm from './CreateChannelForm'

const ChannelContainer = ({
  channelType,
  children,
  isServerOwner,
  onClickAddChannel,
}: {
  channelType: string
  children: React.ReactNode
  isServerOwner: boolean
  onClickAddChannel: () => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mt-2 gap-1 text-xs text-text-light-muted">
      <div className="mb-1 flex items-center justify-between">
        <div
          className="flex flex-grow cursor-pointer items-center gap-1 hover:text-text-dark"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {channelType} 채널
        </div>
        {isServerOwner && (
          <Plus
            size={12}
            onClick={onClickAddChannel}
            className="cursor-pointer hover:text-text-dark"
          />
        )}
      </div>
      {<div>{isExpanded && children}</div>}
    </div>
  )
}

const ChannelSideBar = ({
  channels,
  server,
  onClickChannels,
  userId,
}: {
  channels: Channel[]
  server: Pick<Server, 'id' | 'name' | 'inviteCode' | 'ownerId'>
  onClickChannels: (channelId: number, channelType: ChannelType) => void
  userId?: number
}) => {
  const { mutate: deleteChannel } = useDeleteChannel()

  const { showModalWithControls, showModalWithoutControls, closeModal } =
    useModal()

  const { user } = useAuth()

  const { channelId } = useParams<{
    channelId: string
  }>()

  const parsedChannelId = channelId ? parseInt(channelId) : undefined

  const {
    mediaRoomId,
    disconnect,
    videoEnabled,
    toggleVideo,
    audioEnabled,
    toggleAudio,
  } = useMediaChatStore()

  const onClickShowSettings = () => {
    showModalWithoutControls({
      title: '서버 설정',
      children: (
        <ChannelSettingForm
          ownerId={server.ownerId}
          serverId={server.id}
          inviteCode={server.inviteCode}
        />
      ),
    })
  }

  const onClickAddChannel = () => {
    showModalWithoutControls({
      title: '채널 생성',
      children: <CreateChannelForm serverId={server.id} />,
    })
  }

  const handleDeleteChannel = (channelId: number) => {
    showModalWithControls({
      title: '채널 삭제',
      text: '정말로 채널을 삭제하시겠습니까?\n삭제된 채널은 복구할 수 없습니다.',
      onConfirm: () => {
        deleteChannel(channelId)
        closeModal()
      },
      onRequestClose: () => {
        closeModal()
      },
    })
  }

  return (
    <div className="flex h-full w-60 flex-shrink-0 flex-col overflow-auto bg-secondary-dark">
      <div className="border-bottom-[1px] h-12 border-b-2 border-primary-dark px-4 py-3">
        <header className="flex h-6 items-center">
          <h2 className="mr-4 overflow-hidden text-ellipsis text-nowrap leading-4">
            {server.name}
          </h2>
        </header>
      </div>
      <div className="mr-sidebar_gutter">
        <div className="h-3"></div>
        <div
          className={`ml-sidebar_gutter flex items-center gap-1 p-2 text-base ${s.ButtonWithHover}`}
          onClick={onClickShowSettings}
        >
          <Settings size={16} />
          <div className={`${s.TextWithMargin}`}>설정</div>
        </div>
        <div className="ml-sidebar_gutter mt-2 h-[0.5px] bg-text-light-muted"></div>
      </div>
      <div className="h-3"></div>
      <div className="mr-sidebar_gutter flex-grow overflow-auto pb-4">
        <ChannelContainer
          channelType="채팅"
          onClickAddChannel={onClickAddChannel}
          isServerOwner={server.ownerId === userId}
        >
          {channels
            .filter((channel) => {
              return channel.type === ChannelType.TEXT
            })
            .map((channel) => {
              return (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  onClickChannel={onClickChannels}
                  isOwner={server.ownerId === userId}
                  onClickDeleteChannel={handleDeleteChannel}
                  currentChannelId={parsedChannelId}
                />
              )
            })}
        </ChannelContainer>
        <ChannelContainer
          channelType="음성"
          onClickAddChannel={onClickAddChannel}
          isServerOwner={server.ownerId === userId}
        >
          {channels
            .filter((channel) => {
              return channel.type === ChannelType.VOICE
            })
            .map((channel) => {
              return (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  onClickChannel={onClickChannels}
                  isOwner={server.ownerId === userId}
                  onClickDeleteChannel={handleDeleteChannel}
                  currentChannelId={parsedChannelId}
                />
              )
            })}
        </ChannelContainer>
      </div>
      <div className="bg-black">
        {mediaRoomId && (
          <>
            <div className="flex items-center justify-between p-2 py-3">
              <div className="flex flex-col gap-1 font-medium leading-4">
                <div className="flex items-center text-secondary-light">
                  <Wifi size={16} className="mr-1" />
                  <Typography size="medium" weight="semibold">
                    연결됨
                  </Typography>
                </div>
                <Typography size="small">{mediaRoomId}번 방</Typography>
              </div>
              <PhoneOff
                size={24}
                onClick={() => {
                  disconnect()
                }}
                className={`${s.ButtonWithHover}`}
              />
            </div>
            <Divider />
          </>
        )}
        <div className="flex w-full items-center p-2 py-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary-dark">
            <User size={16} />
          </div>
          <div className="mx-2 flex flex-grow flex-col justify-center gap-0.5 overflow-hidden text-ellipsis text-nowrap">
            <Typography size="small" weight="semibold">
              {user?.username}
            </Typography>
            <Typography size="small" weight="normal">
              온라인
            </Typography>
          </div>
          <div className="flex gap-2">
            {videoEnabled ? (
              <Video
                size={24}
                onClick={() => {
                  toggleVideo()
                }}
                className={`${s.ButtonWithHover}`}
              />
            ) : (
              <VideoOff
                size={24}
                onClick={() => {
                  toggleVideo()
                }}
                className={`${s.ButtonWithHover}`}
              />
            )}
            {audioEnabled ? (
              <Mic
                size={24}
                onClick={() => {
                  toggleAudio()
                }}
                className={`${s.ButtonWithHover}`}
              />
            ) : (
              <MicOff
                size={24}
                onClick={() => {
                  toggleAudio()
                }}
                className={`${s.ButtonWithHover}`}
              />
            )}
            <Settings
              size={24}
              className={`cursor-pointer ${s.ButtonWithHover}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ChannelSideBar)
