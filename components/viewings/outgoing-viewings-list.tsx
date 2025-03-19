'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Calendar, Trash2 } from 'lucide-react';
import { formatViewingDate } from '@/lib/utils';
import { useDisplayContext } from '@/contexts/Display';
import { PropertyDetail } from '../property/property-detail';
import { ViewingStatusBadge } from './viewing-status-badge';
import axios from 'axios';
import { useDataContext } from '@/contexts/Data';
import { toast } from '@/components/ui/use-toast';

export function OutgoingViewingsList() {
  const { setDisplay } = useDisplayContext();
  const { outgoingViewingRequests, setOutgoingViewingRequests } = useDataContext();

  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/viewings/delete', {
        data: {
          token: window.Telegram.WebApp.initData,
          viewingId: id,
        },
      });

      if (response.status === 200) {
        setOutgoingViewingRequests(outgoingViewingRequests!.filter((req) => req.viewing.id !== id));
        toast({
          title: 'Viewing Request Deleted Successfully',
          description:
            'Your viewing request has been deleted.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting the viewing:', error);
    }
  };

  return (
    <div className="space-y-4">
      {outgoingViewingRequests &&
        outgoingViewingRequests.map((request) => (
          <Card
            key={request.viewing.id}
            className={request.viewing.status === 'pending' ? 'border-l-4 border-l-[#F8F32B]' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue text-yellow rounded-full h-[40px] w-[40px] flex">
                  <Avatar className="bg-blue text-yellow m-auto">
                    <AvatarFallback>
                      {`${request.targetUser.name
                        .split(' ')
                        .map((item: any) => item[0])
                        .join('')}`}
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
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="bg-[#F8F32B] hover:bg-[#e9e426] text-black"
                      onClick={() =>
                        setDisplay(<PropertyDetail property={request.viewing.property} />)
                      }>
                      View Property
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(request.viewing.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
