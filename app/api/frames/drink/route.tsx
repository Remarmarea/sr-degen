/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'
import { farcasterHubContext, openframes } from 'frames.js/middleware'
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'
import axios from 'axios'

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
    imageUrl: '',
    ipfs: '',
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
      headers: {
        // Max cache age of 20 seconds
        'Cache-Control': 'max-age=20',
      },
    }
  }

  if (pageIndex === 3) {
    ctx.state.base = ctx.searchParams.value ?? ''

    const apiEndpoint = `${process.env.VERCEL_URL ?? 'http://localhost:3000'}/api/openai`
    const response = await axios.post(apiEndpoint, {
      emotions: ctx.state.feeling,
      cocktail_type: ctx.searchParams.value ?? 'a cold beer in a mug',
      time: 'twilight',
    })
    const { data } = response
    console.log('response data>>>>>>>', data.imageIpfs)
    console.log('IPFS LINK!!!', data.ipfs)
    ctx.state.imageUrl = data.imageIpfs
    ctx.state.ipfs = data.ipfs

    return {
      image:
        'https://purple-objective-cockroach-217.mypinata.cloud/ipfs/Qmd7yRgvdRWeSxRTmC8Cd5aXKwgw3hKJcuf5JfqjYPae1h',
      imageOptions: {
        aspectRatio: '1:1',
      },
      buttons: [
        <Button action="post" target="/api/frames">
          Cancel
        </Button>,
        <Button action="tx" target="/approve-tx" post_url="/approve-tx/frames">
          Buy
        </Button>,
      ],
      textInput: imagesArray[pageIndex].text,
      headers: {
        // Max cache age of 20 seconds
        'Cache-Control': 'max-age=20',
      },
    }
  }
  return {
    image: ctx.state.imageUrl,
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
      <Button action="tx" target="/approve-tx" post_url="/approve-tx/frames">
        Approve
      </Button>,
    ],
    textInput: `${ctx.state.feeling} ${ctx.state.base}, ${ctx.message?.inputText}`,
  }
})

export const GET = handleRequest
export const POST = handleRequest
