interface ViewingStatusBadgeProps {
  status: "pending" | "approved" | "rejected"
}

export function ViewingStatusBadge({ status }: ViewingStatusBadgeProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        status === "pending"
          ? "bg-gray-200 text-[#2B2D42]"
          : status === "approved"
            ? "bg-[#2B2D42] text-[#F8F32B]"
            : "bg-gray-200 text-red-600"
      }`}
    >
      {status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Rejected"}
    </span>
  )
}

