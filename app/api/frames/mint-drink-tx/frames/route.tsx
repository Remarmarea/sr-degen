/* eslint-disable react/jsx-key */
import { Zora1155ABI } from '@/contracts/Zora1155ABI'
import { Button } from 'frames.js/next'
import { createFrames } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'
import { createPublicClient, encodeFunctionData, getContract, http } from 'viem'
import { sepolia } from 'viem/chains'

const ZORA_COLLECTION_ADDRESS = '0xf511594f3fa481cc34461eb6300f0803f96b5111'

const frames = createFrames({
  basePath: '/api/frames',
  middleware: [
    farcasterHubContext(),
    openframes({
      clientProtocol: {
        id: 'xmtp',
        version: '2024-02-09',
      },
      handler: {
        isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body: JSON) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined
          }
          const result = await getXmtpFrameMessage(body)

          return { ...result }
        },
      },
    }),
  ],
})

const handleRequest = frames(async (ctx) => {
  if (ctx.message?.transactionId) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="link" target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}>
          View on block explorer
        </Button>,
      ],
    }
  }

  const calldata = encodeFunctionData({
    abi: Zora1155ABI,
    functionName: 'getTokenInfo',
    args: [1n],
  })

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  })

  const zoraCollection = getContract({
    address: ZORA_COLLECTION_ADDRESS as `0x${string}`,
    abi: Zora1155ABI,
    client: publicClient,
  })

  const tokenInfo = await zoraCollection.read.getTokenInfo([1n])

  console.log(tokenInfo)

  return {
    image: (
      <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">Mint NFT</div>
    ),
    imageOptions: {
      aspectRatio: '1:1',
    },
    buttons: [
      <Button action="tx" target="/transaction" post_url="/api/frames">
        Mint NFT
      </Button>,
    ],
    textInput: 'Mint to...',
  }
})

export const GET = handleRequest
export const POST = handleRequest
