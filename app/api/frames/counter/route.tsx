/* eslint-disable react/jsx-key */
import { createFrames, Button } from 'frames.js/next'

const appBasePath = process.env.VERCEL_URL ?? ''

const frames = createFrames({
  basePath: `${appBasePath}/api/frames`,
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
