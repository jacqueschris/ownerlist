'use client';

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BottomNavigation } from '../bottom-navigation';
import Header from '../header';
import Home from '@/pages';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import { OutgoingViewingsList } from '../viewings/outgoing-viewings-list';
import { IncomingViewingsList } from '../viewings/incoming-viewings-list';
import EmptyScreen from './empty-screen';
import { Calendar } from 'lucide-react';
import { HomeScreen } from './home-screen';

export function ViewingsScreen() {
  const { incomingViewingRequests, outgoingViewingRequests } = useDataContext();
  const { setDisplay } = useDisplayContext();

  const goToHome = () => {
    setDisplay(<HomeScreen />);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto pb-16">
        <Header title="Viewing Requests"></Header>

        <div className="p-4">
          <Tabs defaultValue="incoming">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="incoming">Requests to You</TabsTrigger>
              <TabsTrigger value="outgoing">Your Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="incoming" className="space-y-4">
              {incomingViewingRequests && incomingViewingRequests.length > 0 ? (
                <IncomingViewingsList requests={incomingViewingRequests} />
              ) : (
                <EmptyScreen
                  icon={<Calendar />}
                  title="No Incoming Requests"
                  description="You haven't received any property viewing requests yet."
                />
              )}
            </TabsContent>

            <TabsContent value="outgoing" className="space-y-4">
              {outgoingViewingRequests && outgoingViewingRequests.length > 0 ? (
                <OutgoingViewingsList />
              ) : (
                <div className='flex flex-col items-center'>
                  <EmptyScreen
                    icon={<Calendar />}
                    title="No Outgoing Requests"
                    description="You haven't requested any property viewings yet."
                  />
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
