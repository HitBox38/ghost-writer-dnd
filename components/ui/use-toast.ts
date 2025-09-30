import * as React from 'react'

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  variant?: 'default' | 'destructive'
}

type ToasterState = {
  toasts: Toast[]
}

const listeners = new Set<React.Dispatch<React.SetStateAction<ToasterState>>>()
let state: ToasterState = { toasts: [] }

const notify = () => listeners.forEach((l) => l({ ...state }))

const add = (toast: Omit<Toast, 'id'>) => {
  const id = crypto.randomUUID()
  const next: Toast = { id, duration: 3500, ...toast }
  state = { toasts: [next, ...state.toasts] }
  notify()
  const duration = next.duration ?? 3500
  if (duration > 0) setTimeout(() => remove(id), duration)
  return id
}

const remove = (id: string) => {
  state = { toasts: state.toasts.filter((t) => t.id !== id) }
  notify()
}

export const toast = (t: Omit<Toast, 'id'>) => add(t)

export const useToaster = () => {
  const [s, set] = React.useState<ToasterState>(state)
  React.useEffect(() => {
    listeners.add(set)
    return () => void listeners.delete(set)
  }, [])
  return s
}

