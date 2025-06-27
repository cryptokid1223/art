# Artwork Analyzer

A modern React-based website that analyzes artwork using AI. Upload an image of an artwork or take a photo with your camera and get insights about the artist, color palette, and step-by-step replication instructions.

## Features

- 🎨 **Drag & Drop Image Upload** - Easy image upload with visual feedback
- 📸 **Camera Capture** - Take photos directly with your device camera (mobile-friendly)
- 🤖 **AI-Powered Analysis** - Uses OpenAI's GPT-4 Vision for artwork analysis
- 🎨 **Color Palette Extraction** - Extracts dominant colors and creates a color palette
- 📝 **Replication Guide** - Step-by-step instructions on how to recreate the artwork
- 🎯 **Artist Identification** - Attempts to identify the artist and style
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🌙 **Dark Mode Support** - Automatic dark/light mode switching

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 Vision API
- **Deployment**: Vercel
- **Image Processing**: ColorThief for palette extraction
- **Camera API**: Web MediaDevices API for photo capture

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd artwork-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Uploading Images
1. **Drag & Drop**: Simply drag an image file onto the upload area
2. **File Selection**: Click the upload area to browse and select an image
3. **Camera Capture**: Click the "Take Photo" button to use your device camera

### Camera Features
- **Mobile Optimized**: Automatically uses the back camera on mobile devices
- **High Quality**: Captures photos at up to 1920x1080 resolution
- **Permission Handling**: Gracefully handles camera permission requests
- **Error Recovery**: Shows helpful error messages if camera access fails

### Analysis Results
After uploading or taking a photo, you'll receive:
- **Artist Information**: Likely artist name and confidence level
- **Color Palette**: Dominant colors and full color scheme
- **Artwork Details**: Style, period, and medium analysis
- **Replication Guide**: Materials, techniques, and step-by-step instructions

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to your project settings in Vercel
   - Add `OPENAI_API_KEY` with your OpenAI API key

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the project settings

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

## API Endpoints

### POST `/api/analyze-artwork`

Analyzes an uploaded artwork image.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
```json
{
  "imageUrl": "data:image/jpeg;base64,...",
  "artistInfo": {
    "name": "Vincent van Gogh",
    "description": "A vibrant landscape painting...",
    "confidence": 0.85
  },
  "colorPalette": {
    "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    "dominantColor": "#FF6B6B"
  },
  "replicationGuide": {
    "materials": ["Canvas", "Oil paints", "Brushes"],
    "techniques": ["Impasto", "Color blocking"],
    "steps": ["1. Prepare canvas", "2. Apply base colors"],
    "difficulty": "Intermediate"
  },
  "analysis": {
    "style": "Post-Impressionism",
    "period": "Late 19th century",
    "medium": "Oil on canvas"
  }
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Project Structure

```
artwork-analyzer/
├── app/
│   ├── api/
│   │   └── analyze-artwork/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── ImageUpload.tsx           # Image upload & camera component
│   └── ArtworkAnalysis.tsx       # Analysis display component
├── types/
│   └── artwork.ts                # TypeScript types
├── utils/
│   └── colorExtractor.ts         # Color extraction utility
├── package.json
├── tailwind.config.js
├── next.config.js
└── vercel.json                   # Vercel configuration
```

## Browser Compatibility

### Camera Features
- **Mobile Browsers**: Full support for camera capture
- **Desktop Browsers**: Camera access available (requires user permission)
- **HTTPS Required**: Camera access requires secure connection in production

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Customization

### Adding New Analysis Features

1. **Modify the GPT prompt** in `app/api/analyze-artwork/route.ts`
2. **Update the TypeScript types** in `types/artwork.ts`
3. **Update the UI components** to display new data

### Camera Configuration

The camera settings can be modified in `components/ImageUpload.tsx`:
- **Resolution**: Change `width` and `height` in `getUserMedia`
- **Camera Selection**: Modify `facingMode` for front/back camera preference
- **Quality**: Adjust JPEG quality in `canvas.toBlob`

### Styling

The app uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `app/globals.css`
- Component-specific styles in each component

## Troubleshooting

### Common Issues

1. **"Failed to analyze artwork" error**
   - Check your OpenAI API key is correct
   - Ensure you have sufficient API credits
   - Check the image format is supported

2. **Camera not working**
   - Ensure you're using HTTPS in production
   - Check browser permissions for camera access
   - Try refreshing the page and granting permissions again

3. **Color palette not extracting**
   - The current implementation uses mock colors for serverless compatibility
   - For production, consider using a different color extraction library

4. **Deployment issues on Vercel**
   - Ensure environment variables are set in Vercel dashboard
   - Check function timeout settings in `vercel.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 