"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "../bottom-navigation"
import Header from "../header"
import Home from "@/pages"
import { useDisplayContext } from "@/contexts/Display"
import { useDataContext } from "@/contexts/Data"
import { OutgoingViewingsList } from "../viewings/outgoing-viewings-list"
import { IncomingViewingsList } from "../viewings/incoming-viewings-list"
import { EmptyViewingsState } from "../viewings/empty-viewings-state"


export function ViewingsScreen() {
  const [hasListings, setHasListings] = useState(true)
  const { incomingViewingRequests, outgoingViewingRequests } = useDataContext()
  const { setDisplay } = useDisplayContext()

  const goToHome = () => {
    setDisplay(<Home />)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <Header title="Viewing Requests"></Header>

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
                {incomingViewingRequests && incomingViewingRequests.length > 0 ? (
                  <IncomingViewingsList requests={incomingViewingRequests} />
                ) : (
                  <EmptyViewingsState type="incoming" message="No viewing requests for your properties yet" />
                )}
              </TabsContent>
            )}

            <TabsContent value="outgoing" className="space-y-4">
              {outgoingViewingRequests && outgoingViewingRequests.length > 0 ? (
                <OutgoingViewingsList requests={outgoingViewingRequests} />
              ) : (
                <EmptyViewingsState
                  type="outgoing"
                  message="You haven't requested any property viewings yet"
                  actionButton={
                    <Button className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]" onClick={goToHome}>
                      Browse Properties
                    </Button>
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

