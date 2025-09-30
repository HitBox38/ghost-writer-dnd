import * as React from 'react'
import { X } from 'lucide-react'
import { useToaster } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export const Toaster = () => {
  const { toasts } = useToaster()
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  )
}

const ToastItem = ({ title, description, action, variant = 'default' }: any) => {
  return (
    <div
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-md border p-4 shadow-lg backdrop-blur-sm',
        variant === 'destructive' ? 'border-destructive/50 bg-destructive text-destructive-foreground' : 'bg-background'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action}
        <button className="ml-auto rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

