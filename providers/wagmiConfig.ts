import { baseSepolia } from 'viem/chains'
import { http } from 'wagmi'
import { createConfig } from '@privy-io/wagmi'

export const wagmiConfig = createConfig({
  chains: [baseSepolia], // Pass your required chains as an array
  transports: {
    [baseSepolia.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
})
