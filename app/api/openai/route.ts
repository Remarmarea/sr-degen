import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
export async function POST(request: NextRequest) {
  const { emotions, cocktail_type, time } = await request.json()
  const formatedPrompt = `Create an image of a luxurious ${cocktail_type} in
   a clear glass, on a dark wooden bar table. The drink captures a singular emotions with its color:
    ${emotions}  which varies in intensity to reflect the time of day: ${time}, translated into a palette of cool blues, mirroring the depth of the feeling.
     The liquid is caught mid-splash, dynamic and full of motion, but the colors remain true to the emotion,
      without turning into a rainbow. In the background, the warm, subdued ambiance of a classic bar softly
       illuminates the scene, with the focus intensely on the glass that tells a story through its singular color theme`
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: formatedPrompt,
    n: 1,
    size: '1024x1024',
  })
  return NextResponse.json(response.data[0].url)
}
