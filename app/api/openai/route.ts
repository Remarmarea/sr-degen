import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import pinataSDK from '@pinata/sdk'
import axios from 'axios'
import path from 'path'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

  const { emotions, cocktail_type, time } = await request.json()
  const formatedPrompt = `Create an image of a luxurious ${cocktail_type} in
   a clear glass, on a dark wooden bar table. The drink captures a singular emotions with its color:
    ${emotions}  which varies in intensity to reflect the time of day: ${time}, translated into a palette of cool blues, mirroring the depth of the feeling.
     The liquid is caught mid-splash, dynamic and full of motion, but the colors remain true to the emotion,
      without turning into a rainbow. In the background, the warm, subdued ambiance of a classic bar softly
       illuminates the scene, with the focus intensely on the glass that tells a story through its singular color theme`
  const openAIImage = await openai.images.generate({
    model: 'dall-e-3',
    prompt: formatedPrompt,
    n: 1,
    size: '1024x1024',
  })
  const promptForNameAndDescription = `You are a creative writer. First, please provide a catchy and unique name for an NFT featuring a luxurious ${cocktail_type} cocktail. Then write a separator like ///, then write a compelling description for it. The cocktail captures the emotion ${emotions} and varies in intensity to reflect the time of day: ${time}. Use less than 100 words for the description. This is for an NFT.`

  const openaiText = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a writer.' },
      { role: 'user', content: promptForNameAndDescription },
    ],
    model: 'gpt-3.5-turbo',
  })

  // Assuming the first message.content returned is the name, and the second is the description
  const generatedName = openaiText.choices[0].message.content?.split('///')[0].trim()
  const generatedDescription = openaiText.choices[0].message.content?.split('///')[1].trim()

  console.log('Generated NFT Name:', generatedName)
  console.log('Generated NFT Description:', generatedDescription)

  const name = `${cocktail_type.split(' ')[0]}-${emotions.split(' ')[0]}-${time}-${Math.random()}.png`
  const response = await downloadImage(openAIImage.data[0].url as string, name)

  try {
    const readableStreamForFile = fs.createReadStream(response as string)
    const options = {
      pinataMetadata: {
        name: name,
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2',
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }
    //@ts-expect-error
    const image = await pinata.pinFileToIPFS(readableStreamForFile, options)
    await fs.unlink(response as string, (err) => {
      if (err) console.log(err)
      else {
        console.log('\nDeleted file:', response)
      }
    })
    const nftMetadata = {
      description: generatedDescription,
      external_url: 'https://srdegen.xyz',
      image: `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${image.IpfsHash}`,
      name: generatedDescription,
      attributes: [],
    }
    //@ts-expect-error
    const res = await pinata.pinJSONToIPFS(nftMetadata, options)
    return NextResponse.json(
      { ipfs: res.IpfsHash },
      { status: 201 },
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

async function downloadImage(url: string, filename: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })
  const filePath = path.resolve(
    path.join(serverRuntimeConfig.PROJECT_ROOT, 'public', 'images', filename),
  )
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filePath))
      .on('error', reject)
      .once('close', () => resolve(filePath))
  })
}
