import React from 'react'

const FullScreenCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {children}
    </div>
  )
}

export const FullWidthCenter = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex h-full w-full flex-grow items-center justify-center">
      {children}
    </div>
  )
}

export default FullScreenCenter
