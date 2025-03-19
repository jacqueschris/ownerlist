import { Calendar } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyViewingsStateProps {
  type: "incoming" | "outgoing"
  message: string
  actionButton?: ReactNode
}

export function EmptyViewingsState({ type, message, actionButton }: EmptyViewingsStateProps) {
  return (
    <div className="text-center py-10">
      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{message}</p>
      {actionButton}
    </div>
  )
}

