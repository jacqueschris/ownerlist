'use client';

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BottomNavigation } from '../bottom-navigation';
import { Calendar, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import Header from '../header';
import Home from '@/pages';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import { PropertyDetail } from './property-detail';
import { formatViewingDate } from '@/lib/utils';
import axios from 'axios';
import { IncomingViewing } from "@/types/index";

export function ViewingsScreen() {
  const [hasListings, setHasListings] = useState(true);
  const { incomingViewingRequests, setIncomingViewingRequests, outgoingViewingRequests } = useDataContext();

  const { setDisplay } = useDisplayContext();

  const goToHome = () => {
    setDisplay(<Home />);
  };
  const handleClick = async (id: string, newStatus: string) => {
    try {
      let response = await axios.patch('api/viewings/update', {
        status: newStatus,
        token: window.Telegram.WebApp.initData,
        viewingId: id,
      });

      if (response.status === 200) {
        setIncomingViewingRequests(
          incomingViewingRequests
            ? incomingViewingRequests.map((request) =>
                request.viewing.id === id
                  ? {
                      ...request,
                      viewing: {
                        ...request.viewing,
                        status: newStatus as "pending" | "approved" | "rejected",
                      },
                    }
                  : request
              )
            : []
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <Header title="Viewing Requests"></Header>

        <div className="p-4">
          <Tabs defaultValue={hasListings ? 'incoming' : 'outgoing'}>
            <TabsList className="grid grid-cols-2 mb-4">
              {hasListings && <TabsTrigger value="incoming">Requests to You</TabsTrigger>}
              <TabsTrigger value="outgoing" className={!hasListings ? 'col-span-2' : ''}>
                Your Requests
              </TabsTrigger>
            </TabsList>

            {hasListings && (
              <TabsContent value="incoming" className="space-y-4">
                {incomingViewingRequests && incomingViewingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {incomingViewingRequests.map((request) => (
                      <Card
                        key={request.viewing.id}
                        className={
                          request.viewing.status === 'pending'
                            ? 'border-l-4 border-l-[#F8F32B]'
                            : ''
                        }>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="bg-blue text-yellow rounded-full h-[40px] w-[40px] flex">
                              <Avatar className="bg-blue text-yellow m-auto">
                                <AvatarFallback>
                                  {`${request.sourceUser.name
                                    .split(' ')
                                    .map((item) => item[0])
                                    .join('')}`}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{request.sourceUser.name}</h3>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    request.viewing.status === 'pending'
                                      ? 'bg-gray-200 text-[#2B2D42]'
                                      : request.viewing.status === 'approved'
                                      ? 'bg-[#2B2D42] text-[#F8F32B]'
                                      : 'bg-gray-200 text-red-600'
                                  }`}>
                                  {request.viewing.status === 'pending'
                                    ? 'Pending'
                                    : request.viewing.status === 'approved'
                                    ? 'Approved'
                                    : 'Rejected'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {request.viewing.property.title}
                              </p>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <p className="text-sm">{formatViewingDate(request.viewing.date)}</p>
                              </div>

                              {request.viewing.status === 'pending' && (
                                <div className="flex space-x-2 mt-3">
                                  <Button
                                    size="sm"
                                    className="bg-[#F8F32B] hover:bg-[#e9e426] text-black"
                                    onClick={() => handleClick(request.viewing.id, "approved")}>
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white bg-[#2B2D42] border-[#2B2D42] hover:bg-[#3e4061] hover:text-white"
                                    onClick={() => handleClick(request.viewing.id, "rejected")}>
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
              {outgoingViewingRequests && outgoingViewingRequests.length > 0 ? (
                <div className="space-y-4">
                  {outgoingViewingRequests.map((request) => (
                    <Card
                      key={request.viewing.id}
                      className={
                        request.viewing.status === 'pending' ? 'border-l-4 border-l-[#F8F32B]' : ''
                      }>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="bg-blue text-yellow rounded-full h-[40px] w-[40px] flex">
                            <Avatar className="bg-blue text-yellow m-auto">
                              <AvatarFallback>
                                {`${request.targetUser.name
                                  .split(' ')
                                  .map((item) => item[0])
                                  .join('')}`}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{request.targetUser.name}</h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  request.viewing.status === 'pending'
                                    ? 'bg-gray-200 text-[#2B2D42]'
                                    : request.viewing.status === 'approved'
                                    ? 'bg-[#2B2D42] text-[#F8F32B]'
                                    : 'bg-gray-200 text-red-600'
                                }`}>
                                {request.viewing.status === 'pending'
                                  ? 'Pending'
                                  : request.viewing.status === 'approved'
                                  ? 'Approved'
                                  : 'Rejected'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {request.viewing.property.title}
                            </p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm"> {formatViewingDate(request.viewing.date)}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-[#F8F32B] hover:bg-[#e9e426] text-black mt-3"
                              onClick={() =>
                                setDisplay(<PropertyDetail property={request.viewing.property} />)
                              }>
                              View Property
                            </Button>
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
                  <Button
                    className="mt-4 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                    onClick={goToHome}>
                    Browse Properties
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
