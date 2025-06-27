'use client'

import { Palette, User, BookOpen, Paintbrush } from 'lucide-react'
import { ArtworkData } from '@/types/artwork'

interface ArtworkAnalysisProps {
  artworkData: ArtworkData
}

export default function ArtworkAnalysis({ artworkData }: ArtworkAnalysisProps) {
  const { artistInfo, colorPalette, replicationGuide, analysis } = artworkData

  return (
    <div className="space-y-8">
      {/* Artist Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Artist Analysis
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {artistInfo.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {artistInfo.description}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Confidence: {Math.round(artistInfo.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Palette className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Color Palette
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: colorPalette.dominantColor }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Dominant: {colorPalette.dominantColor}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colorPalette.colors.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 mb-1"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artwork Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Artwork Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Style</h4>
            <p className="text-gray-600 dark:text-gray-300">{analysis.style}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Period</h4>
            <p className="text-gray-600 dark:text-gray-300">{analysis.period}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Medium</h4>
            <p className="text-gray-600 dark:text-gray-300">{analysis.medium}</p>
          </div>
        </div>
      </div>

      {/* Replication Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Paintbrush className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            How to Replicate
          </h2>
          <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            {replicationGuide.difficulty}
          </span>
        </div>
        
        <div className="space-y-6">
          {/* Materials */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Materials Needed
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {replicationGuide.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>

          {/* Techniques */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Techniques
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {replicationGuide.techniques.map((technique, index) => (
                <li key={index}>{technique}</li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Step-by-Step Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {replicationGuide.steps.map((step, index) => (
                <li key={index} className="pl-2">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 