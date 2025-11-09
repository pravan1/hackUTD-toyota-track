import { LucideIcon } from 'lucide-react'
import Card from '../ui/Card'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
    >
      <Card padding="lg" hover className="h-full">
        <div className="flex flex-col items-start gap-4">
          <div className="p-3 bg-toyota-red/10 rounded-lg">
            <Icon className="w-6 h-6 text-toyota-red" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-2">
              {title}
            </h3>
            <p className="text-toyota-gray-dark leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
