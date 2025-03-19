"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { Calendar } from "lucide-react"
import { formatViewingDate } from "@/lib/utils"
import { useDisplayContext } from "@/contexts/Display"
import { PropertyDetail } from "../property/property-detail"
import { ViewingStatusBadge } from "./viewing-status-badge"

interface OutgoingViewingsListProps {
  requests: any[] // Replace with the correct type
}

export function OutgoingViewingsList({ requests }: OutgoingViewingsListProps) {
  const { setDisplay } = useDisplayContext()

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card
          key={request.viewing.id}
          className={request.viewing.status === "pending" ? "border-l-4 border-l-[#F8F32B]" : ""}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-blue text-yellow rounded-full h-[40px] w-[40px] flex">
                <Avatar className="bg-blue text-yellow m-auto">
                  <AvatarFallback>
                    {`${request.targetUser.name
                      .split(" ")
                      .map((item: any) => item[0])
                      .join("")}`}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{request.targetUser.name}</h3>
                  <ViewingStatusBadge status={request.viewing.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{request.viewing.property.title}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm">{formatViewingDate(request.viewing.date)}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#F8F32B] hover:bg-[#e9e426] text-black mt-3"
                  onClick={() => setDisplay(<PropertyDetail property={request.viewing.property} />)}
                >
                  View Property
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

