/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

const imagesArray = [
  { name: 'chat', url: 'https://i.ibb.co/qWdnp6r/SRDEGEN2.jpg', text: 'wanna talk about it?' },
  { name: 'drink', url: 'https://i.ibb.co/KqXz2Ny/SRDEGEN5-1.jpg', text: 'tell me...' },
  { name: 'chat', url: 'https://i.ibb.co/qWdnp6r/SRDEGEN2.jpg', text: 'choose a base' },
  { name: 'start', url: 'https://i.ibb.co/F039TJt/SRDEGEN5.jpg', text: 'secret ingredient?' },
  { name: 'drink', url: 'https://i.ibb.co/KqXz2Ny/SRDEGEN5-1.jpg', text: '420 $DEGEN' },
]
const totalPages = imagesArray.length
const frames = createFrames({
  basePath: '/api/frames/drink',
  initialState: {
    pageIndex: 0,
    feeling: '',
    reason: '',
    base: '',
    secretIngredient: '',
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
  const pageIndex = Number(ctx.searchParams.pageIndex || 0)
  console.log(ctx.state)
  console.log('pageIndex>>>>>>>', pageIndex)
  if (pageIndex === 0) {
    ctx.state.feeling = ctx.searchParams.value ?? ''
    return {
      image: imagesArray[pageIndex].url,
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex - 1 },
          }}
        >
          Nah, drink
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex + 1 },
          }}
        >
          Yes plz
        </Button>,
      ],
      textInput: imagesArray[pageIndex].text,
    }
  }
  if (pageIndex === 1) {
    return {
      image: imagesArray[pageIndex].url,
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex - 1 },
          }}
        >
          Return
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex + 1 },
          }}
        >
          Vent
        </Button>,
      ],
      textInput: imagesArray[pageIndex].text,
    }
  }
  if (pageIndex === 2) {
    ctx.state.reason = message?.inputText ?? ''
    return {
      image: imagesArray[pageIndex].url,
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target={{ query: { pageIndex: pageIndex + 1, value: 'beer' } }}>
          🍺
        </Button>,
        <Button action="post" target={{ query: { pageIndex: pageIndex + 1, value: 'wine' } }}>
          🍷
        </Button>,
        <Button action="post" target={{ query: { pageIndex: pageIndex + 1, value: 'cocktail' } }}>
          🍸
        </Button>,
        <Button action="post" target={{ query: { pageIndex: pageIndex + 1, value: 'hard' } }}>
          🥃
        </Button>,
      ],
      textInput: imagesArray[pageIndex].text,
    }
  }

  if (pageIndex === 3) {
    ctx.state.base = ctx.searchParams.value ?? ''
    return {
      image: imagesArray[pageIndex].url,
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex - 1 },
          }}
        >
          Cancel
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageIndex: pageIndex + 1 },
          }}
        >
          Order $
        </Button>,
      ],
      textInput: imagesArray[pageIndex].text,
    }
  }

  console.log('ctx>>>>>>>', ctx.state)
  console.log('message for special ingredient>>>>>>>', ctx.message?.inputText)
  return {
    image: imagesArray[pageIndex].url,
    imageOptions: {
      aspectRatio: '1:1',
    },
    buttons: [
      <Button
        action="post"
        target={{
          query: { pageIndex: pageIndex - 1 },
        }}
      >
        Cancel
      </Button>,
      <Button
        action="post"
        target={{
          query: { pageIndex: pageIndex + 1 },
        }}
      >
        420 $DEGEN
      </Button>,
    ],
    textInput: `${ctx.state.feeling} ${ctx.state.base}, ${ctx.message?.inputText}`,
  }
})

export const GET = handleRequest
export const POST = handleRequest
