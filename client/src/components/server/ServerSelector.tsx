import { PAGE_ROUTE } from '@/constants/routeName'
import { useLocation, useNavigate } from 'react-router-dom'
import CreateServerForm from './CreateServerForm'
import InviteServerForm from './InviteServerForm'
import useModal from '@/hooks/useModal'
import { hasNewMessageOnChannel } from '@/utils/hasNewMessageOnChannel'
import { useAuth } from '@/contexts/AuthContext'
import { useUserServersWithChannels } from '@/hooks/server'
import { Server } from '@/@types'
import React from 'react'
import { LogOut, Mail, Plus, ShoppingCart } from 'lucide-react'

const SidebarButton = ({
  icon,
  text,
  onClick,
  isNewMessage,
  isSelected,
}: {
  icon?: React.ReactNode
  text: string
  onClick: () => void
  isNewMessage?: boolean
  isSelected?: boolean
}) => {
  return (
    <div className="relative flex items-center justify-center gap-1">
      {isNewMessage ? (
        <div className="absolute left-0 h-2 w-2 rounded-full bg-secondary-light"></div>
      ) : null}
      <div
        className={`flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background-light-tertiary ${
          isSelected && 'border-2 border-secondary-light'
        }`}
        onClick={onClick}
      >
        {icon ? (
          icon
        ) : (
          <p className="text-nowrap text-center text-sm">{text}</p>
        )}
      </div>
    </div>
  )
}

const Sidebar = () => {
  const navigate = useNavigate()

  const onClickChannels = (server: number, channel: number) => {
    navigate(PAGE_ROUTE.GOTO_CHANNEL(server, channel))
  }

  const { data } = useUserServersWithChannels()

  const { logout } = useAuth()

  const { showModalWithoutControls } = useModal()

  const openCreateServerModal = () => {
    showModalWithoutControls({
      title: '서버 만들기',
      text: '',
      children: <CreateServerForm />,
    })
  }

  const openInviteServerModal = () => {
    showModalWithoutControls({
      title: '서버 들어가기',
      text: '',
      children: <InviteServerForm />,
    })
  }

  const hasServerNewMessage = (server: Server) => {
    return server.channels.some((channel) =>
      hasNewMessageOnChannel(channel.lastMessageId, channel.lastSeenMessageId)
    )
  }

  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="flex h-full w-[72px] flex-shrink-0 flex-col gap-3 overflow-auto bg-primary-dark py-3">
      {data?.map((server) => {
        const hasNewMessage = hasServerNewMessage(server)

        const isSelected =
          currentPath.includes(`/channels/${server.id}`) && Boolean(server.id)

        return (
          <SidebarButton
            key={server.id}
            text={server.name}
            isNewMessage={hasNewMessage}
            onClick={() => onClickChannels(server.id, server.channels[0].id)}
            isSelected={isSelected}
          ></SidebarButton>
        )
      })}

      <SidebarButton
        icon={<Plus size={24} />}
        text="추가"
        onClick={openCreateServerModal}
      ></SidebarButton>
      <SidebarButton
        icon={<Mail size={24} />}
        text="초대"
        onClick={openInviteServerModal}
      ></SidebarButton>
      <SidebarButton
        icon={<ShoppingCart size={24} />}
        text="상품"
        onClick={() => {
          navigate(PAGE_ROUTE.PRODUCTS)
        }}
      ></SidebarButton>
      <SidebarButton
        icon={<LogOut size={24} className="text-danger-light" />}
        text="로그아웃"
        onClick={() => logout()}
      ></SidebarButton>
    </div>
  )
}

export default Sidebar
