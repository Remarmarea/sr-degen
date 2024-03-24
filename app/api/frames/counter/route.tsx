/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

const frames = createFrames({
  basePath: '/api/frames/counter',
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
  initialState: {
    count: 0,
  },
})

const handleRequest = frames(async (ctx) => {
  console.log(ctx)
  return {
    image: (
      <div tw="flex w-full h-full bg-slate-700 text-white justify-center items-center">
        {ctx.state.count ?? 0}
      </div>
    ),
    buttons: [<Button action="post">Increment counter</Button>],
    state: { count: (ctx.state.count ?? 0) + 1 },
  }
})

export const GET = handleRequest
export const POST = handleRequest
