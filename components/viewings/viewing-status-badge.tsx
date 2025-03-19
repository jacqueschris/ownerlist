import type React from "react"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
        approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        rejected: "bg-red-50 text-red-700 ring-red-600/20",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  },
)

export interface ViewingStatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  status: "pending" | "approved" | "rejected"
}

export function ViewingStatusBadge({ status, className, ...props }: ViewingStatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant: status }), className)} {...props}>
      {status === "pending" ? (
        <>
          <Clock className="h-3 w-3" />
          Pending
        </>
      ) : status === "approved" ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Rejected
        </>
      )}
    </span>
  )
}

