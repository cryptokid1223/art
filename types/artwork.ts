export interface ArtworkData {
  imageUrl: string
  artistInfo: {
    name: string
    description: string
    confidence: number
  }
  colorPalette: {
    colors: string[]
    dominantColor: string
  }
  replicationGuide: {
    materials: string[]
    techniques: string[]
    steps: string[]
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  }
  analysis: {
    style: string
    period: string
    medium: string
  }
} 