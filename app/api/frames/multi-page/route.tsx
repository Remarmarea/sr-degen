/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

const totalPages = 5

const frames = createFrames({
  basePath: '/api/frames/multi-page',
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
  console.log('message>>>>>>>', message)
  console.log('pressedButton>>>>>>>', pressedButton)
  const pageIndex = Number(ctx.searchParams.pageIndex || 0)

  const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`

  return {
    image: (
      <div tw="flex flex-col">
        <img width={300} height={200} src={imageUrl} alt="Image" />
        <div tw="flex flex-col">
          <p>{message?.inputText}</p>
          <p>
            This is slide {pageIndex + 1} / {totalPages}
          </p>
        </div>
      </div>
    ),
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
