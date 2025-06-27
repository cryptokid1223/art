'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Loader2, Camera } from 'lucide-react'
import { ArtworkData } from '@/types/artwork'

interface ImageUploadProps {
  onUploadStart: () => void
  onAnalysisComplete: (data: ArtworkData) => void
  isLoading: boolean
}

export default function ImageUpload({ 
  onUploadStart, 
  onAnalysisComplete, 
  isLoading 
}: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const processImage = useCallback(async (file: File) => {
    // Create preview URL
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    onUploadStart()

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload to API
      const response = await fetch('/api/analyze-artwork', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze artwork')
      }

      const data: ArtworkData = await response.json()
      onAnalysisComplete(data)
    } catch (error) {
      console.error('Error analyzing artwork:', error)
      alert('Failed to analyze artwork. Please try again.')
    }
  }, [onUploadStart, onAnalysisComplete])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    await processImage(file)
  }, [processImage])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraError('Unable to access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setCameraError(null)
  }, [])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to a reasonable value
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, width, height);

    // Convert canvas to blob (JPEG, quality 0.8)
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        stopCamera();
        await processImage(file);
      }
    }, 'image/jpeg', 0.8);
  }, [processImage, stopCamera]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isLoading || showCamera
  })

  if (showCamera) {
    return (
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Take a Photo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Position your artwork in the frame and tap capture
            </p>
          </div>
          
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-96 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-center p-4">
                  {cameraError}
                </p>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={capturePhoto}
              disabled={isLoading || !!cameraError}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture Photo
            </button>
            
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Analyzing artwork...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        ) : uploadedImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={uploadedImage} 
              alt="Uploaded artwork" 
              className="max-h-64 rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click or drag to upload a different image
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              {isDragActive ? (
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              ) : (
                <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isDragActive ? 'Drop the image here' : 'Upload artwork image'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop an image here, or click to select
            </p>
            
            {/* Camera Button */}
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-2"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take Photo
            </button>
            
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports JPEG, PNG, and WebP formats
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 