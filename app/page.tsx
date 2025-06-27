'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ArtworkAnalysis from '@/components/ArtworkAnalysis'
import { ArtworkData } from '@/types/artwork'

export default function Home() {
  const [artworkData, setArtworkData] = useState<ArtworkData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalysisComplete = (data: ArtworkData) => {
    setArtworkData(data)
    setIsLoading(false)
  }

  const handleUploadStart = () => {
    setIsLoading(true)
    setArtworkData(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Artwork Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload an artwork image or take a photo with your camera to get AI-powered insights about the artist, 
            color palette, and step-by-step replication instructions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ImageUpload 
            onUploadStart={handleUploadStart}
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
          />
          
          {artworkData && (
            <ArtworkAnalysis artworkData={artworkData} />
          )}
        </div>
      </div>
    </main>
  )
} 