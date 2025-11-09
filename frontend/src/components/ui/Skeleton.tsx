import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  }

  return (
    <div
      className={clsx('skeleton', variants[variant], className)}
      style={style}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  )
}

// Skeleton composition components
export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  )
}

export function SkeletonVehicleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
