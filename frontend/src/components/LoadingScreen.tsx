import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onComplete?: () => void
  duration?: number
}

export default function LoadingScreen({ onComplete, duration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          if (onComplete) {
            setTimeout(onComplete, 300)
          }
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto">
            <img
              src="/toyota_logo_signup.png"
              alt="Toyota Nexus"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-toyota-black mb-2">
          Toyota <span className="text-toyota-red">Nexus</span>
        </h1>

        <p className="text-gray-600 mb-8">
          Your Intelligent Vehicle Assistant
        </p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-toyota-red to-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-600 text-sm mt-2">{progress}%</p>
        </div>
      </div>
    </motion.div>
  )
}
