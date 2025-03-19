"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { Calendar, Check, X } from "lucide-react"
import { formatViewingDate } from "@/lib/utils"
import axios from "axios"
import type { IncomingViewing } from "@/types/index"
import { useDataContext } from "@/contexts/Data"
import { ViewingStatusBadge } from "./viewing-status-badge"

interface IncomingViewingsListProps {
  requests: IncomingViewing[]
}

export function IncomingViewingsList({ requests }: IncomingViewingsListProps) {
  const { setIncomingViewingRequests } = useDataContext()

  const handleClick = async (id: string, newStatus: string) => {
    try {
      const response = await axios.patch("api/viewings/update", {
        status: newStatus,
        token: window.Telegram.WebApp.initData,
        viewingId: id,
      })

      if (response.status === 200) {
        setIncomingViewingRequests(
          requests.map((request) =>
            request.viewing.id === id
              ? {
                  ...request,
                  viewing: {
                    ...request.viewing,
                    status: newStatus as "pending" | "approved" | "rejected",
                  },
                }
              : request,
          ),
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

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
                    {`${request.sourceUser.name
                      .split(" ")
                      .map((item) => item[0])
                      .join("")}`}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{request.sourceUser.name}</h3>
                  <ViewingStatusBadge status={request.viewing.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{request.viewing.property.title}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm">{formatViewingDate(request.viewing.date)}</p>
                </div>

                {request.viewing.status === "pending" && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      className="bg-[#F8F32B] hover:bg-[#e9e426] text-black"
                      onClick={() => handleClick(request.viewing.id, "approved")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white bg-[#2B2D42] border-[#2B2D42] hover:bg-[#3e4061] hover:text-white"
                      onClick={() => handleClick(request.viewing.id, "rejected")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

