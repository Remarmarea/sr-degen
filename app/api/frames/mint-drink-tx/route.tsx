import { SrDegenDrinkABI } from '@/contracts/SrDegenDrinkABI'
import { TransactionTargetResponse } from 'frames.js'
import { getFrameMessage } from 'frames.js/next/server'
import { NextRequest, NextResponse } from 'next/server'
import { Abi, createPublicClient, encodeFunctionData, getContract, http, parseEther } from 'viem'
import { baseSepolia } from 'viem/chains'

const SR_DEGEN_ADDRESS_BASE_SEP = '0xf62b1d2aab57401ACbCDcD4793De7628eB0b9Fa9'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json()

  const frameMessage = await getFrameMessage(json)

  if (!frameMessage) {
    throw new Error('No frame message')
  }
  const calldata = encodeFunctionData({
    abi: SrDegenDrinkABI,
    functionName: 'mint',
    args: [frameMessage.connectedAddress ?? frameMessage.requesterCustodyAddress, 1n, 1n],
  })

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  })

  const srDegenDrinkContract = getContract({
    address: SR_DEGEN_ADDRESS_BASE_SEP as `0x${string}`,
    abi: SrDegenDrinkABI,
    client: publicClient,
  })

  const balance = await srDegenDrinkContract.read.balanceOf([frameMessage.inputText, 1n])

  return NextResponse.json({
    chainId: 'eip155:84532', // Base Sepolia
    method: 'eth_sendTransaction',
    params: {
      abi: SrDegenDrinkABI as Abi,
      to: SR_DEGEN_ADDRESS_BASE_SEP,
      data: calldata,
      value: parseEther('0.00069').toString(),
    },
  })
}
