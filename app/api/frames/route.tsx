/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

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
  if (ctx.pressedButton) {
    const selectedValue = ctx.searchParams.value
    const targetPath = selectedValue === 'drink' ? '/drink' : '/chat'
    return {
      image:
        selectedValue === 'drink'
          ? 'https://i.ibb.co/KqXz2Ny/SRDEGEN5-1.jpg'
          : 'https://i.ibb.co/qWdnp6r/SRDEGEN2.jpg',
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target={{ pathname: targetPath, query: { value: 'happy' } }}>
          😀
        </Button>,
        <Button action="post" target={{ pathname: targetPath, query: { value: 'sad' } }}>
          😢
        </Button>,
        <Button action="post" target={{ pathname: targetPath, query: { value: 'surprised' } }}>
          😮
        </Button>,
        <Button action="post" target={{ pathname: targetPath, query: { value: 'angry' } }}>
          😡
        </Button>,
      ],
      textInput: selectedValue === 'drink' ? 'How are you feeling today?' : 'Which story you want?',
    }
  } else {
    return {
      image: 'https://i.ibb.co/F039TJt/SRDEGEN5.jpg',
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target={{ query: { value: 'drink' } }}>
          New drink
        </Button>,
        <Button action="post" target={{ query: { value: 'chat' } }}>
          What&apos;s up
        </Button>,
      ],
    }
  }
})

export const GET = handleRequest
export const POST = handleRequest
