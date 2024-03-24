import { MockERC20ABI } from '@/contracts/MockERC20ABI'
import { SrDegenDrinkABI } from '@/contracts/SrDegenDrinkABI'
import { TransactionTargetResponse } from 'frames.js'
import { getFrameMessage } from 'frames.js/next/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
  isAddress,
  parseEther,
} from 'viem'
import { baseSepolia } from 'viem/chains'

const SR_DEGEN_DRINK_ADDRESS = '0x67DF1Fe7DFb1b5F3F6318E429A5dC8dF2D2CD8B8'
const ERC_20_ADDRESS = '0xd66cd7D7698706F8437427A3cAb537aBc12c8C88'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json()

  const frameMessage = await getFrameMessage(json)

  if (!frameMessage) {
    throw new Error('No frame message')
  }
  console.log(frameMessage)
  const mintToAddress = isAddress(frameMessage.inputText ?? '')
    ? frameMessage.inputText
    : frameMessage.connectedAddress
  console.log(mintToAddress)

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  })

  const srDegenDrinkContract = getContract({
    address: SR_DEGEN_DRINK_ADDRESS as `0x${string}`,
    abi: SrDegenDrinkABI,
    client: publicClient,
  })

  const price = await srDegenDrinkContract.read.calculatePrice([1n, 1n])

  console.log((price as bigint).toString())

  const calldata = encodeFunctionData({
    abi: MockERC20ABI,
    functionName: 'approve',
    args: [SR_DEGEN_DRINK_ADDRESS, price as bigint],
  })

  return NextResponse.json({
    chainId: 'eip155:84532', // Base Sepolia
    method: 'eth_sendTransaction',
    params: {
      abi: MockERC20ABI as Abi,
      to: ERC_20_ADDRESS as `0x${string}`,
      data: calldata,
      value: '0',
    },
  })
}
