'use client'

import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { baseSepolia } from 'viem/chains'
import { WagmiProvider } from '@privy-io/wagmi'
import { wagmiConfig } from './wagmiConfig'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['google'],
        appearance: {
          theme: 'light',
          accentColor: '#3730a3',
          logo: 'https://i.ibb.co/gPVq7Sv/kukulcan-auth.png',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
