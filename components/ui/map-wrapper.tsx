'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the map component with no SSR
const MapWithNoSSR = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
  ),
});

interface MapWrapperProps {
  position: [number, number];
  setPosition?: (position: [number, number]) => void;
  draggable?: boolean;
}

export default function MapWrapper({ position, setPosition, draggable=true }: MapWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return <MapWithNoSSR position={position} setPosition={setPosition} draggable={draggable} />;
}
