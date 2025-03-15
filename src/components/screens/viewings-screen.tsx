"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Calendar, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function ViewingsScreen() {
  const [hasListings, setHasListings] = useState(true)

  // Mock data for viewing requests made to your properties
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: "401",
      requester: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "101",
        title: "Modern Studio in City Center",
      },
      date: "Tomorrow, 2:00 PM",
      status: "pending",
    },
    {
      id: "403",
      requester: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "101",
        title: "Modern Studio in City Center",
      },
      date: "Mon, May 17, 4:30 PM",
      status: "pending",
    },
    {
      id: "402",
      requester: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "102",
        title: "Family House with Garden",
      },
      date: "Sat, May 15, 11:00 AM",
      status: "approved",
    },
  ])

  // Mock data for your viewing requests to other properties
  const [outgoingRequests, setOutgoingRequests] = useState([
    {
      id: "501",
      owner: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "201",
        title: "Luxury Apartment with Sea View",
      },
      date: "Fri, May 14, 10:00 AM",
      status: "approved",
    },
    {
      id: "502",
      owner: {
        name: "Robert Miller",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "202",
        title: "Cozy 2BR House near Park",
      },
      date: "Wed, May 19, 3:00 PM",
      status: "pending",
    },
    {
      id: "503",
      owner: {
        name: "Jennifer Taylor",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      property: {
        id: "203",
        title: "Modern Office Space",
      },
      date: "Thu, May 20, 11:30 AM",
      status: "rejected",
    },
  ])

  const handleApprove = (id: string) => {
    setIncomingRequests(
      incomingRequests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)),
    )
  }

  const handleReject = (id: string) => {
    setIncomingRequests(
      incomingRequests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)),
    )
  }

  // For demo purposes, you can toggle this to test the conditional rendering
  // Uncomment the following line to simulate a user with no listings
  // useEffect(() => { setHasListings(false); }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Viewing Requests</h1>
        </div>

        <div className="p-4">
          <Tabs defaultValue={hasListings ? "incoming" : "outgoing"}>
            <TabsList className="grid grid-cols-2 mb-4">
              {hasListings && <TabsTrigger value="incoming">Requests to You</TabsTrigger>}
              <TabsTrigger value="outgoing" className={!hasListings ? "col-span-2" : ""}>
                Your Requests
              </TabsTrigger>
            </TabsList>

            {hasListings && (
              <TabsContent value="incoming" className="space-y-4">
                {incomingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {incomingRequests.map((request) => (
                      <Card
                        key={request.id}
                        className={request.status === "pending" ? "border-l-4 border-l-[#F8F32B]" : ""}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={request.requester.avatar || "/placeholder.svg"}
                                alt={request.requester.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{request.requester.name}</h3>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    request.status === "pending"
                                      ? "bg-gray-200 text-[#2B2D42]"
                                      : request.status === "approved"
                                        ? "bg-[#2B2D42] text-[#F8F32B]"
                                        : "bg-gray-200 text-red-600"
                                  }`}
                                >
                                  {request.status === "pending"
                                    ? "Pending"
                                    : request.status === "approved"
                                      ? "Approved"
                                      : "Rejected"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{request.property.title}</p>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <p className="text-sm">{request.date}</p>
                              </div>

                              {request.status === "pending" && (
                                <div className="flex space-x-2 mt-3">
                                  <Button
                                    size="sm"
                                    className="bg-[#F8F32B] hover:bg-[#e9e426] text-black"
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white bg-[#2B2D42] border-[#2B2D42] hover:bg-[#3e4061]"
                                    onClick={() => handleReject(request.id)}
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
                ) : (
                  <div className="text-center py-10">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No viewing requests for your properties yet</p>
                  </div>
                )}
              </TabsContent>
            )}

            <TabsContent value="outgoing" className="space-y-4">
              {outgoingRequests.length > 0 ? (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => (
                    <Card
                      key={request.id}
                      className={request.status === "pending" ? "border-l-4 border-l-[#F8F32B]" : ""}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={request.owner.avatar || "/placeholder.svg"}
                              alt={request.owner.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{request.owner.name}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  request.status === "pending"
                                    ? "bg-gray-200 text-[#2B2D42]"
                                    : request.status === "approved"
                                      ? "bg-[#2B2D42] text-[#F8F32B]"
                                      : "bg-gray-200 text-red-600"
                                }`}
                              >
                                {request.status === "pending"
                                  ? "Pending"
                                  : request.status === "approved"
                                    ? "Approved"
                                    : "Rejected"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{request.property.title}</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm">{request.date}</p>
                            </div>

                            {request.status === "approved" && (
                              <Button size="sm" className="mt-3 bg-[#F8F32B] hover:bg-[#e9e426] text-black" asChild>
                                <Link href={`/property/${request.property.id}`}>View Property</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't requested any property viewings yet</p>
                  <Button className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]" asChild>
                    <Link href="/">Browse Properties</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

