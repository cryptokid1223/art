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

    // Analyze with GPT-4 Vision
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this artwork and provide the following information in JSON format:

1. Artist Information:
   - name: The most likely artist name or "Unknown" if uncertain
   - description: A brief description of the artwork and artist style
   - confidence: A number between 0 and 1 indicating confidence in the artist attribution

2. Artwork Analysis:
   - style: The artistic style (e.g., Impressionism, Abstract, Renaissance, etc.)
   - period: The likely time period or era
   - medium: The likely medium used (oil paint, watercolor, digital, etc.)

3. Replication Guide:
   - materials: Array of materials needed to replicate this artwork
   - techniques: Array of painting/artistic techniques used
   - steps: Array of step-by-step instructions for replication
   - difficulty: "Beginner", "Intermediate", or "Advanced"

Please provide detailed, practical information that would help someone recreate this artwork. Focus on the visual characteristics, techniques, and materials that would be most effective.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageFile.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    })

    const gptContent = gptResponse.choices[0]?.message?.content
    if (!gptContent) {
      throw new Error('No response from GPT-4 Vision')
    }

    // Parse GPT response (it should return JSON)
    let analysisData
    try {
      // Extract JSON from the response (GPT might wrap it in markdown)
      const jsonMatch = gptContent.match(/```json\n([\s\S]*?)\n```/) || 
                       gptContent.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : gptContent
      analysisData = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Error parsing GPT response:', parseError)
      // Fallback to a structured response
      analysisData = {
        artistInfo: {
          name: "Unknown Artist",
          description: gptContent,
          confidence: 0.5
        },
        analysis: {
          style: "Unknown",
          period: "Unknown",
          medium: "Unknown"
        },
        replicationGuide: {
          materials: ["Canvas", "Paint", "Brushes"],
          techniques: ["Basic painting techniques"],
          steps: ["1. Prepare your canvas", "2. Apply paint", "3. Add details"],
          difficulty: "Beginner"
        }
      }
    }

    // Extract color palette
    const colorPalette = extractColorPalette(imageBuffer)

    // Create the final response
    const artworkData = {
      imageUrl: `data:${imageFile.type};base64,${base64Image}`,
      artistInfo: analysisData.artistInfo,
      colorPalette,
      replicationGuide: analysisData.replicationGuide,
      analysis: analysisData.analysis
    }

    return NextResponse.json(artworkData)

  } catch (error) {
    console.error('Error analyzing artwork:', error)
    return NextResponse.json(
      { error: 'Failed to analyze artwork' },
      { status: 500 }
    )
  }
} 