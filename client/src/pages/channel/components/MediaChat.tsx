import useMediaChatStore from '@/store/mediaStore'
import React, { useEffect, useRef } from 'react'
import { RemoteStream } from '../hooks/useMediaChat'
import FullScreenCenter, {
  FullWidthCenter,
} from '@/components/ui/FullScreenCenter'
import Button from '@/components/ui/Button'

const RemoteVideos = React.memo(
  ({ remoteStreams }: { remoteStreams: RemoteStream[] }) => {
    const cuttedRemoteStreams = remoteStreams.slice(0, 3)

    return (
      <>
        {cuttedRemoteStreams.map((remoteStream) => (
          <video
            key={remoteStream.id}
            ref={(video) => {
              if (video) {
                video.srcObject = remoteStream.stream
                video.onloadeddata = () => {
                  video.play().catch((error) => {
                    console.error('Error playing remote video:', error)
                  })
                }
              }
            }}
            autoPlay
            style={{ width: '300px' }}
          ></video>
        ))}
      </>
    )
  }
)

const LocalVideo = ({ localStream }: { localStream: MediaStream | null }) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  return <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
}

const VideoContainer = ({
  localStream,
  remoteStreams,
  currentChannelId,
  setGlobalMode,
}: {
  localStream: MediaStream | null
  remoteStreams: RemoteStream[]
  currentChannelId: number
  setGlobalMode: (mode: boolean) => void
  toggleVideo: () => void
  toggleAudio: () => void
  audioEnabled: boolean
  videoEnabled: boolean
}) => {
  useEffect(() => {
    setGlobalMode(false)

    return () => {
      setGlobalMode(true)
    }
  }, [currentChannelId])

  const getVideoContainerClass = () => {
    const numOfVideos = remoteStreams.length + 1 // Including local video
    switch (numOfVideos) {
      case 1:
        return 'flex justify-center items-center h-full'
      case 2:
        return 'flex justify-center space-x-4 items-center h-full'
      case 3:
        return 'flex flex-wrap justify-center items-center h-full gap-4'
      case 4:
        return 'grid grid-cols-2 gap-4'
      default:
        return 'grid grid-cols-2 gap-4'
    }
  }

  return (
    <FullWidthCenter>
      <div className={getVideoContainerClass()}>
        <LocalVideo localStream={localStream} />
        <RemoteVideos remoteStreams={remoteStreams} />
      </div>
    </FullWidthCenter>
  )
}

const MediaChat = ({ currentChannelId }: { currentChannelId: number }) => {
  const {
    toggleVideo,
    toggleAudio,
    localStream,
    remoteStreams,
    setGlobalMode,
    audioEnabled,
    videoEnabled,
    mediaRoomId,
    setMediaRoomId,
  } = useMediaChatStore()

  return (
    <div className="flex-grow">
      {currentChannelId === mediaRoomId ? (
        <VideoContainer
          localStream={localStream}
          remoteStreams={remoteStreams}
          currentChannelId={currentChannelId}
          setGlobalMode={setGlobalMode}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
        />
      ) : (
        <FullWidthCenter>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-center text-2xl font-bold text-text-light-muted">
              Join the channel to start video chat
            </h1>
            <Button
              onClick={() => {
                setMediaRoomId(currentChannelId)
              }}
              variant="secondary"
            >
              join
            </Button>
          </div>
        </FullWidthCenter>
      )}
    </div>
  )
}

export default MediaChat
