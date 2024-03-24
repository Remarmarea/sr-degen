/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

const frames = createFrames({
  basePath: '/api/frames',
  middleware: [
    farcasterHubContext({
      hubHttpUrl: 'hub.pinata.cloud',
    }),
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
  return {
    image: (
      <span>{ctx.pressedButton ? `I clicked ${ctx.searchParams.value}` : `Click some button`}</span>
    ),
    buttons: [
      <Button action="post" target={{ query: { value: 'Yes' } }}>
        Say Yes
      </Button>,
      <Button action="post" target={{ query: { value: 'No' } }}>
        Say No
      </Button>,
    ],
  }
})

export const GET = handleRequest
export const POST = handleRequest
