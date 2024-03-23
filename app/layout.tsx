import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import WalletProvider from '@/providers/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sr. Degen',
  description: 'Your trustworthy and legend-telling bartender',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const NAVBAR_HEIGHT = '64px' // ~4rem or h-16 (tailwind)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <main
            className={`min-h-[calc(100svh-${NAVBAR_HEIGHT})] overflow-x-hidden t-[${NAVBAR_HEIGHT}]`}
          >
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  )
}
