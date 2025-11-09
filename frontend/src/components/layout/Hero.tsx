import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface HeroProps {
  title: string
  subtitle?: string
  children?: ReactNode
  backgroundImage?: string
  compact?: boolean
}

export default function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  compact = false,
}: HeroProps) {
  return (
    <section
      className={clsx(
        'relative bg-gradient-to-br from-toyota-black to-toyota-gray-dark text-white overflow-hidden',
        compact ? 'py-12' : 'py-20 md:py-28'
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1
            className={clsx(
              'font-bold mb-4',
              compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={clsx(
                'text-gray-300 mb-8',
                compact ? 'text-lg' : 'text-xl md:text-2xl'
              )}
            >
              {subtitle}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
