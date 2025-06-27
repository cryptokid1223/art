import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { extractColorPalette } from '@/utils/colorExtractor'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
    const base64Image = imageBuffer.toString('base64')

    // Compose a clear, direct prompt for OpenAI
    const prompt = `
You are an expert art analyst. Given the following image of an artwork, do the following:
1. Guess the probable name or description of the artwork and the artist (or say "Unknown" if not sure).
2. List the dominant color palette as hex values.
3. Give step-by-step instructions on how someone could replicate this artwork, including materials, brushes, and techniques.

Respond in this JSON format:
{
  "artist": "Artist name or 'Unknown'",
  "artwork": "Artwork name or description",
  "description": "Short description of the artwork",
  "colors": ["#hex1", "#hex2", ...],
  "replication": {
    "materials": ["list", "of", "materials"],
    "techniques": ["list", "of", "techniques"],
    "steps": ["Step 1...", "Step 2...", ...]
  }
}
    `.trim();

    let gptResponse
    try {
      gptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 1500,
      })
    } catch (apiError) {
      console.error('OpenAI API error:', apiError)
      return NextResponse.json({ error: 'Failed to analyze artwork with OpenAI. Please check your API key and model access.' }, { status: 500 })
    }

    const gptContent = gptResponse.choices[0]?.message?.content
    if (!gptContent) {
      return NextResponse.json({ error: 'No response from OpenAI.' }, { status: 500 })
    }

    let analysisData
    try {
      // Try to extract JSON from the response
      const jsonMatch = gptContent.match(/```json\n([\s\S]*?)\n```/) || 
                       gptContent.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : gptContent
      analysisData = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError, gptContent)
      // Fallback: just return the raw text
      analysisData = {
        artist: "Unknown",
        artwork: "Unknown",
        description: gptContent,
        colors: [],
        replication: {
          materials: [],
          techniques: [],
          steps: []
        }
      }
    }

    // Use our own color extractor as a fallback or supplement
    const colorPalette = extractColorPalette(imageBuffer)
    if (!analysisData.colors || analysisData.colors.length === 0) {
      analysisData.colors = colorPalette.colors
    }

    // Compose the final response
    const result = {
      imageUrl: `data:${imageFile.type};base64,${base64Image}`,
      artist: analysisData.artist,
      artwork: analysisData.artwork,
      description: analysisData.description,
      colors: analysisData.colors,
      replication: analysisData.replication
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error analyzing artwork:', error)
    return NextResponse.json({ error: 'Failed to analyze artwork. Please try again later.' }, { status: 500 })
  }
} 