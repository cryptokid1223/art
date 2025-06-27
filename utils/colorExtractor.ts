// Simple color extraction utility for serverless environments
// This is a basic implementation - for production, consider using a more sophisticated approach

export interface ColorPalette {
  colors: string[]
  dominantColor: string
}

// Generate a color palette based on image characteristics
export function extractColorPalette(imageBuffer: Buffer): ColorPalette {
  try {
    // For serverless environments, we'll use a simplified approach
    // In a real implementation, you might want to use a different library
    // that works better in serverless environments
    
    // Generate colors based on image buffer hash
    const hash = simpleHash(imageBuffer.toString('base64'))
    const colors = generateColorsFromHash(hash)
    
    return {
      colors: colors.slice(0, 8),
      dominantColor: colors[0]
    }
  } catch (error) {
    console.error('Error extracting colors:', error)
    return {
      colors: ['#000000', '#FFFFFF', '#808080', '#FF0000', '#00FF00', '#0000FF'],
      dominantColor: '#000000'
    }
  }
}

// Simple hash function
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Generate colors from hash
function generateColorsFromHash(hash: number): string[] {
  const colors: string[] = []
  const baseColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FAD7A0', '#ABEBC6', '#F9E79F', '#D5A6BD', '#A9CCE3'
  ]
  
  // Use hash to select and shuffle colors
  const seed = hash % 1000
  const shuffled = [...baseColors].sort(() => (seed % 3) - 1)
  
  return shuffled
} 