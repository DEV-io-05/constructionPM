import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const VisuallyHidden = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap',
        'clip-rect-0',
        className
      )}
      {...props}
    />
  )
})

VisuallyHidden.displayName = 'VisuallyHidden'
