import React from 'react'
import useModal from '@/hooks/useModal'
import { useDeleteServer } from '@/hooks/server'
import { useAuth } from '@/contexts/AuthContext'

interface ChannelSettingFormProps {
    serverId: number
    inviteCode: string
    ownerId: number
}

const ChannelSettingForm: React.FC<ChannelSettingFormProps> = ({
    serverId,
    inviteCode,
    ownerId,
}) => {
    const { closeModal, showModalWithControls } = useModal()
    const { mutate: deleteServer } = useDeleteServer()

    const { user } = useAuth()

    const onClickDeleteServer = (id: number) => {
        showModalWithControls({
            title: '서버 삭제',
            text: '정말로 서버를 삭제하시겠습니까?\n삭제된 서버는 복구할 수 없습니다.',
            onConfirm: () => {
                deleteServer(id, {
                    onSuccess: () => {
                        closeModal()
                    },
                })
                closeModal()
            },
        })
    }

    return (
        <div className="">
            <div className="mb-4">
                <label className="text-text-light-default dark:text-text-dark-default mb-2 block">
                    서버 초대 코드:
                </label>
                <p className="mt-1 w-full rounded-md border border-gray-300 p-2">
                    {inviteCode}
                </p>
            </div>
            <div className="mb-4 flex items-center justify-between">
                {ownerId === user?.id && (
                    <button
                        onClick={() => onClickDeleteServer(serverId)}
                        className="rounded-md bg-red-600 px-4 py-2 text-white"
                    >
                        서버 삭제하기
                    </button>
                )}

                <button
                    onClick={closeModal}
                    className="rounded-md bg-gray-600 px-4 py-2 text-white"
                >
                    닫기
                </button>
            </div>
        </div>
    )
}

export default ChannelSettingForm
