/* eslint-disable react/jsx-key */
import { Zora1155ABI } from '@/contracts/Zora1155ABI'
import { Button } from 'frames.js/next'
import { createFrames } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'
import { createPublicClient, encodeFunctionData, getContract, http } from 'viem'
import { baseSepolia } from 'viem/chains'

const SR_DEGEN_DRINK_ADDRESS = '0x67DF1Fe7DFb1b5F3F6318E429A5dC8dF2D2CD8B8'
const ERC_20_ADDRESS = '0xd66cd7D7698706F8437427A3cAb537aBc12c8C88'

const frames = createFrames({
  basePath: '/api/frames/drink/approve-tx',
  initialState: {
    ipfs: '',
    imageUrl: '',
  },
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
  ctx.state.ipfs = ctx.searchParams.ipfs ?? ''
  ctx.state.imageUrl = ctx.searchParams.imageUrl ?? ''
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
        <Button action="tx" target="/mint-drink-tx" post_url="/mint-drink-tx/frames">
          Buy Drink
        </Button>,
      ],
    }
  }

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
