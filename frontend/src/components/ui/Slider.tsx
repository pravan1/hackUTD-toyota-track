import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  fullWidth?: boolean
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue = true, formatValue, fullWidth = true, id, value, ...props }, ref) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const displayValue = formatValue && value ? formatValue(Number(value)) : value

    return (
      <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm font-medium text-toyota-black"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-toyota-red">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          id={sliderId}
          value={value}
          className={clsx(
            'w-full h-2 bg-toyota-gray-light rounded-lg appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-toyota-red focus:ring-offset-2',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-toyota-red',
            '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-toyota-red [&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform',
            '[&::-moz-range-thumb]:hover:scale-110',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider
