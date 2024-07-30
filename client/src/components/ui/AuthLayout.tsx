import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col justify-center">
      <main className="flex-grow bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto flex h-full flex-col items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
