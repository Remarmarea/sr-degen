import { SrDegenDrinkABI } from '@/contracts/SrDegenDrinkABI'
import { Zora1155ABI } from '@/contracts/Zora1155ABI'
import { TransactionTargetResponse } from 'frames.js'
import { getFrameMessage } from 'frames.js/next/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  Abi,
  Hex,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const ZORA_COLLECTION_ADDRESS = '0xf511594f3fa481cc34461eb6300f0803f96b5111'
const SR_DEGEN_ADDRESS_SEP = '0x8711C6426E1732726eE3A3dfE95dCfcd91f365bE'
const SR_DEGEN_ADDRESS_BASE_SEP = '0xf62b1d2aab57401ACbCDcD4793De7628eB0b9Fa9'
const DEGEN_INNVERTIR = '0x1cD1Fd04bA50E2E6876B0835f664b6F1864CDd06'

export async function POST(req: NextRequest): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json()

  const frameMessage = await getFrameMessage(json)

  if (!frameMessage) {
    throw new Error('No frame message')
  }
  console.log(frameMessage.inputText)
  const calldata = encodeFunctionData({
    abi: SrDegenDrinkABI,
    functionName: 'mint',
    args: [frameMessage.inputText as `0x${string}`, 1n, 1n],
  })

  console.log(calldata)
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

  console.log(balance)

  console.log('NO jalaaa', frameMessage.inputText)

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
