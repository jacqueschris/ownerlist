'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useTelegram } from '../telegram-provider';
import {
  ArrowLeft,
  MapPin,
  X,
  Plus,
  Clock,
  Loader2,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { HomeScreen } from './home-screen';
import { useDisplayContext } from '@/contexts/Display';
import { useDataContext } from '@/contexts/Data';
import ButtonToggle from '../button-toggle';
import MapWrapper from '../ui/map-wrapper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Type for selected image files
interface SelectedImage {
  file: File;
  previewUrl: string;
}

export function AddPropertyScreen() {
  const { setDisplay, setShowAddPropertyButton } = useDisplayContext();
  const { isLoading } = useDataContext();
  const { webApp } = useTelegram();
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availabilitySchedule, setAvailabilitySchedule] = useState<
    {
      day: string;
      timeSlots: { start: string; end: string }[];
    }[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '09:00',
    end: '10:00',
  });
  const [timeSlotError, setTimeSlotError] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');

  // Map state
  const [position, setPosition] = useState<[number, number]>([35.8977, 14.5128]); // Default to Valletta, Malta
  const [mapReady, setMapReady] = useState(false);

  const handleBack = () => {
    setDisplay(<HomeScreen />);
    setShowAddPropertyButton(true);
  };

  useEffect(() => {
    // This is needed because Leaflet requires window to be defined
    setMapReady(true);

    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleBack);
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(handleBack);
      }
    };
  }, [webApp]);

  const getLocationFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
  
      if (data && data.display_name) {
        return data
      } 
      return null
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    getLocationFromCoordinates(position[0], position[1]).then((data) => {
      if (data) {
        setLocation(data.display_name);
      }
    })
  }, [position]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [selectedImages]);

  // Validate description when it changes
  useEffect(() => {
    if (description.length > 0 && description.length < 10) {
      setDescriptionError('Description must be at least 10 characters long');
    } else {
      setDescriptionError('');
    }
  }, [description]);

  // Validate time slot when it changes
  useEffect(() => {
    if (timeSlot.start && timeSlot.end) {
      if (timeSlot.start >= timeSlot.end) {
        setTimeSlotError('Start time must be before end time');
      } else {
        setTimeSlotError('');
      }
    }
  }, [timeSlot]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create preview URLs for selected files
    const newImages: SelectedImage[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // Add to selected images
    setSelectedImages([...selectedImages, ...newImages]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prevImages) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prevImages[index].previewUrl);

      // Remove the image from the array
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleAddressSearch = async () => {
    if (location.trim() === '') {
      setLocationError('Please enter a location to search');
      return;
    }

    setLocationError('');

    try {
      // Using Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([Number.parseFloat(lat), Number.parseFloat(lon)]);
        toast({
          title: 'Location found',
          description: 'You can adjust the pin position if needed',
        });
      } else {
        setLocationError(
          'Location not found. Please try a different address or manually position the pin on the map.'
        );
      }
    } catch (error) {
      console.error('Error searching for address:', error);
      setLocationError(
        'Error searching for address. Please try again or manually position the pin on the map.'
      );
    }
  };

  const addDay = () => {
    if (!selectedDay || availabilitySchedule.some((schedule) => schedule.day === selectedDay)) {
      return;
    }

    setAvailabilitySchedule([...availabilitySchedule, { day: selectedDay, timeSlots: [] }]);
    setSelectedDay('');
  };

  const removeDay = (day: string) => {
    setAvailabilitySchedule(availabilitySchedule.filter((schedule) => schedule.day !== day));
  };

  const addTimeSlot = (day: string) => {
    // Validate time slot before adding
    if (timeSlot.start >= timeSlot.end) {
      setTimeSlotError('Start time must be before end time');
      return;
    }

    const existingTimeSlot = availabilitySchedule.find(
      (schedule) =>
        schedule.day === day &&
        schedule.timeSlots.some(
          (slot) => slot.start === timeSlot.start && slot.end === timeSlot.end
        )
    );

    if (existingTimeSlot) {
      setTimeSlotError('Time slot already added');
      return;
    }

    setTimeSlotError('');

    setAvailabilitySchedule(
      availabilitySchedule.map((schedule) => {
        if (schedule.day === day) {
          return {
            ...schedule,
            timeSlots: [...schedule.timeSlots, { ...timeSlot }],
          };
        }
        return schedule;
      })
    );

    // Reset time slot to default for next addition
    setTimeSlot({ start: '09:00', end: '10:00' });
  };

  const removeTimeSlot = (day: string, index: number) => {
    setAvailabilitySchedule(
      availabilitySchedule.map((schedule) => {
        if (schedule.day === day) {
          const updatedSlots = [...schedule.timeSlots];
          updatedSlots.splice(index, 1);
          return {
            ...schedule,
            timeSlots: updatedSlots,
          };
        }
        return schedule;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all errors
    setError('');

    // Validate description length
    if (description.length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }

    // Validate that all days have at least one time slot
    const dayWithoutTimeSlots = availabilitySchedule.find(
      (schedule) => schedule.timeSlots.length === 0
    );
    if (dayWithoutTimeSlots) {
      setError(`Please add at least one time slot for ${dayWithoutTimeSlots.day}`);
      return;
    }

    // Start submission process
    setIsSubmitting(true);

    try {
      // Build the complete property object
      const propertyData = {
        listingType,
        propertyType,
        title,
        price: Number(price),
        bedrooms,
        bathrooms,
        size,
        location,
        position,
        description,
        amenities,
        availabilitySchedule,
      };

      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append('files', file.file); // Same key for all files
      });
      formData.append('property', JSON.stringify(propertyData)); // Append additional data
      formData.append('token', window.Telegram.WebApp.initData); // Append additional data

      // Log the complete object
      console.log('Property Data:', propertyData);

      const response = await axios.post('/api/property/create', formData);

      if (response.status != 200) {
        setError('Failed to submit property');
        return;
      }

      // Show success toast notification
      toast({
        title: 'Property Added Successfully',
        description: 'Your property listing has been created',
        variant: 'default',
        //icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });

      // Continue with form submission
      setDisplay(<HomeScreen />);
      setShowAddPropertyButton(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-10 bg-blue p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h1 className="text-lg text-white font-bold">Add New Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <ButtonToggle
              id="listing-type"
              label="Listing Type"
              value={listingType}
              onChange={(value) => setListingType(value as 'buy' | 'rent')}
              buttons={[
                { value: 'buy', label: 'Buy' },
                { value: 'rent', label: 'Rent' },
              ]}
            />

            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type" className="mt-1">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern 2BR Apartment in Downtown"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">
                {listingType === 'buy' ? 'Price ($)' : 'Monthly Rent ($)'}
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 250000"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger id="bedrooms" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, '6+'].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger id="bathrooms" className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="size">Size (m²)</Label>
            <Input
              id="size"
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 85"
              className="mt-1"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1 flex items-center">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown, New York"
                className="pl-10 pr-20"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                onClick={handleAddressSearch}>
                Search
              </Button>
            </div>
            {locationError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {mapReady && (
            <div className="mt-4">
              <Label className="flex items-center mb-2">
                <span>Map Location</span>
                <span className="text-xs text-gray-500 ml-2">
                  (Drag pin to adjust exact location)
                </span>
              </Label>
              <div className="h-60 rounded-md border overflow-hidden relative">
                <MapWrapper position={position} setPosition={setPosition} />
                <div className="absolute bottom-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-md text-xs">
                  <div>Lat: {position[0].toFixed(6)}</div>
                  <div>Lng: {position[1].toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property..."
              className={`mt-1 ${descriptionError ? 'border-red-500' : ''}`}
              rows={5}
            />
            {descriptionError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{descriptionError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Balcony',
              'Pool',
              'Parking',
              'Garden',
              'Elevator',
              'Air Conditioning',
              'Furnished',
              'Pet Friendly',
            ].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Property Images</h2>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <img
                  src={image.previewUrl || '/placeholder.svg'}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isLoading || isSubmitting}
                multiple
              />
              <Button
                type="button"
                variant="outline"
                className="w-24 h-24 flex flex-col items-center justify-center"
                disabled={isLoading || isSubmitting}>
                <ImageIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Photos</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Images will be uploaded when you submit the form
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Availability for Viewings</h2>
          <p className="text-sm text-gray-500 mb-2">
            Add days and time slots when you're available for property viewings
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addDay}
                disabled={
                  !selectedDay ||
                  availabilitySchedule.some((schedule) => schedule.day === selectedDay) ||
                  isLoading
                }
                className="bg-[#F8F32B] text-black hover:bg-[#e9e426]">
                <Plus className="h-4 w-4 mr-1" /> Add Day
              </Button>
            </div>

            {availabilitySchedule.length === 0 && (
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <p className="text-gray-500">No availability added yet</p>
              </div>
            )}

            <div className="space-y-3">
              {availabilitySchedule.map((schedule) => (
                <div key={schedule.day} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{schedule.day}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(schedule.day)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {schedule.day}</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {schedule.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(schedule.day, index)}
                          className="h-6 w-6 p-0"
                          disabled={isLoading}>
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove time slot</span>
                        </Button>
                      </div>
                    ))}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-1"
                          disabled={isLoading}>
                          <Plus className="h-3 w-3 mr-1" /> Add Time Slot
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Time Slot for {schedule.day}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`start-time-${schedule.day}`}>Start Time</Label>
                              <Input
                                id={`start-time-${schedule.day}`}
                                type="time"
                                value={timeSlot.start}
                                onChange={(e) =>
                                  setTimeSlot({ ...timeSlot, start: e.target.value })
                                }
                                className={timeSlotError ? 'border-red-500' : ''}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`end-time-${schedule.day}`}>End Time</Label>
                              <Input
                                id={`end-time-${schedule.day}`}
                                type="time"
                                value={timeSlot.end}
                                onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })}
                                className={timeSlotError ? 'border-red-500' : ''}
                              />
                            </div>
                          </div>
                          {timeSlotError && <p className="text-red-500 text-sm">{timeSlotError}</p>}
                          <Button
                            type="button"
                            onClick={() => addTimeSlot(schedule.day)}
                            className="bg-[#F8F32B] text-black hover:bg-[#e9e426]"
                            disabled={!!timeSlotError || isLoading}>
                            Add Time Slot
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-[#F8F32B] text-black hover:bg-[#e9e426]"
          disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading Images & Submitting...
            </>
          ) : (
            'Submit Listing'
          )}
        </Button>
      </form>
    </div>
  );
}
