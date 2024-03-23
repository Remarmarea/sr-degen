'use client'

import { useLogout, usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'

const TopNav = () => {
  const { ready, authenticated } = usePrivy()
  const { logout } = useLogout()

  return (
    <div className="fixed left-0 top-0 z-20 w-full bg-zinc-900 pt-safe">
      <header className="border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-20 max-w-screen-md items-center justify-between px-4 md:px-6">
          <h1 className="text-lg font-medium md:text-xl">🎩Sr. Degen</h1>

          <nav className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              {ready && authenticated && (
                <>
                  <Link href="/dashboard" className="cursor-pointer text-sm text-gray-600">
                    home
                  </Link>
                  <Link href="/embedded-wallet" className="cursor-pointer text-sm text-gray-600">
                    play
                  </Link>
                  <Link href="/load-assets" className="cursor-pointer text-sm text-gray-600">
                    load
                  </Link>
                  <button
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                    onClick={logout}
                  >
                    logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default TopNav
