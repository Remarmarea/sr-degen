import { createPublicClient, createWalletClient, Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { Zora1155ABI } from '@/contracts/Zora1155ABI'

const nftContractAddress = '0x0d8c9e75f0307e4eb542446bd88dffe9a0cfbd3a'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.gateway.tenderly.co'),
})

const walletClient = createWalletClient({
  chain: sepolia,
  transport: http('https://sepolia.gateway.tenderly.co'),
})

export async function adminMintNft(toAddress: `0x${string}`) {
  console.log('address in mint function', toAddress)
  const { request } = await publicClient.simulateContract({
    address: nftContractAddress,
    abi: Zora1155ABI,
    functionName: 'adminMint',
    args: [toAddress, 1n, 1n, '0x'],
    account: privateKeyToAccount(process.env.MINTER_PRIVATE_KEY as Hex),
  })
  if (!request) {
    console.log('Ocurrió un error')
  }
  try {
    const hash = await walletClient.writeContract(request)
    return {
      hash,
      isSuccess: true,
    }
  } catch (error) {
    console.log(error)
    return {
      error,
      isSuccess: false,
    }
  }
}

export async function publicMintNft(nftAddress: `0x${string}`, toAddress: `0x${string}`) {
  console.log('address in mint function', toAddress)
  const { request } = await publicClient.simulateContract({
    address: nftContractAddress,
    abi: Zora1155ABI,
    functionName: 'mint',
    args: [nftAddress, 1n, 1n, [toAddress], '0x'],
    account: privateKeyToAccount(process.env.MINTER_PRIVATE_KEY as Hex),
  })
  if (!request) {
    console.log('Ocurrió un error')
  }
  try {
    const hash = await walletClient.writeContract(request)
    return {
      hash,
      isSuccess: true,
    }
  } catch (error) {
    console.log(error)
    return {
      error,
      isSuccess: false,
    }
  }
}
