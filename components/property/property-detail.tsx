'use client';
import { useState, useEffect } from 'react';
import { useTelegram } from '../telegram-provider';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import type { Property, OutgoingViewing, Viewing } from '@/types/index';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { PropertyHeader } from './property-header';
import { PropertyGallery } from './property-gallery';
import { PropertyInfo } from './property-info';
import { PropertyTabs } from './property-tabs';
import { PropertyBooking } from './property-booking';
import { HomeScreen } from '../screens/home-screen';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';

interface PropertyDetailProps {
  property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { webApp } = useTelegram();
  const { setDisplay } = useDisplayContext();
  const { outgoingViewingRequests, setOutgoingViewingRequests } = useDataContext();

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(-1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(
    null
  );

  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => setDisplay(<HomeScreen />));
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(() => setDisplay(<HomeScreen />));
      }
    };
  }, [webApp, setDisplay]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate || !property.availabilitySchedule) return [];

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayOfWeek = daysOfWeek[selectedDate.getDay()];

    const availabilityForDay = property.availabilitySchedule.find(
      (availability) => availability.day === dayOfWeek
    );

    return availabilityForDay?.timeSlots || [];
  };

  const handleBookViewing = async () => {
    if (!date || !selectedTimeSlot) return;

    try {
      const viewingData = {
        property: property.id,
        date: date.getTime(),
        targetUser: property.owner.id,
        status: 'pending',
      };

      const formData = new FormData();
      formData.append('viewing', JSON.stringify(viewingData));
      formData.append('token', window.Telegram.WebApp.initData);

      const response = await axios.post('api/viewings/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        return;
      }

      const newViewing: Viewing = {
        property: property,
        status: 'pending',
        id: response.data.viewing.id,
        date: date.getTime(),
      };

      const newOutgoingViewingRequest: OutgoingViewing = {
        viewing: newViewing,
        targetUser: property.owner,
      };

      setOutgoingViewingRequests((prev) => [...prev!, newOutgoingViewingRequest]);

      toast({
        title: 'Viewing Request Sent Successfully',
        description:
          'Your viewing request has been sent. Please wait for confirmation from the property owner.',
        variant: 'default',
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  const goBack = () => setDisplay(<HomeScreen />);

  return (
    <div className="pb-16">
      <PropertyGallery
        property={property}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        goBack={goBack}
      />

      <div className="p-4">
        <PropertyHeader property={property} />
        <PropertyInfo property={property} />
        <PropertyTabs property={property} />

        {!outgoingViewingRequests ? null : outgoingViewingRequests.find(
            (request) => request.viewing.property.id === property.id
          ) ? (
          <Alert className="max-w-md mx-auto my-6 border-primary/50 bg-gray/40">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-blue font-bold">Already Submitted</AlertTitle>
            <AlertDescription className="text-blue/60 font-light">
              You have already sent a viewing request for this property.
            </AlertDescription>
          </Alert>
        ) : (
          <PropertyBooking
            property={property}
            date={date}
            setDate={setDate}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            getAvailableTimeSlots={getAvailableTimeSlots}
            handleBookViewing={handleBookViewing}
          />
        )}
      </div>
    </div>
  );
}
