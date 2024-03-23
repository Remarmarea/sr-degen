'use client'

import TopNav from '@/components/top-nav'
import BottomNav from '@/components/bottom-nav'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
}

const AuthenticatedPage = ({ children }: Props) => {
  const router = useRouter()
  const { ready, authenticated } = usePrivy()

  useEffect(() => {
    if (ready && !authenticated) router.push('/')
  }, [ready, authenticated, router])

  return (
    <div>
      <TopNav />
      <main className="mx-auto max-w-screen-md pb-16 pt-20 px-safe sm:pb-0">
        <div className="p-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}

export default AuthenticatedPage
