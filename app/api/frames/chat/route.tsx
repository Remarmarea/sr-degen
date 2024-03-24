/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

const totalPages = 5

const imagesArray = [
  { name: 'chat', url: 'https://i.ibb.co/qWdnp6r/SRDEGEN2.jpg' },
  { name: 'drink', url: 'https://i.ibb.co/KqXz2Ny/SRDEGEN5-1.jpg' },
  { name: 'start', url: 'https://i.ibb.co/F039TJt/SRDEGEN5.jpg' },
]

const frames = createFrames({
  basePath: '/api/frames/chat',
  initialState: {
    pageIndex: 0,
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
  const { message, pressedButton } = ctx
  console.log(ctx.searchParams)
  console.log('message>>>>>>>', message?.inputText)
  console.log('pressedButton>>>>>>>', pressedButton)
  const pageIndex = Number(ctx.searchParams.pageIndex || 0)

  return {
    image: imagesArray[pageIndex % imagesArray.length].url,
    imageOptions: {
      aspectRatio: '1:1',
    },
    buttons: [
      <Button
        action="post"
        target={{
          query: { pageIndex: (pageIndex - 1) % totalPages },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: { pageIndex: (pageIndex + 1) % totalPages },
        }}
      >
        →
      </Button>,
    ],
    textInput: 'Type something!',
  }
})

export const GET = handleRequest
export const POST = handleRequest
