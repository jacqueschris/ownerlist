'use client';

import { useEffect, useRef } from 'react';

interface MapComponentProps {
  position: [number, number];
  setPosition: (position: [number, number]) => void;
}

export default function MapComponent({ position, setPosition }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Import Leaflet only on client side
    const L = require('leaflet');

    // Import CSS
    require('leaflet/dist/leaflet.css');

    // Create a custom icon instead of modifying the default icon
    const customIcon = new L.Icon({
      iconUrl: 'marker.png',
      iconRetinaUrl: 'marker2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      const mapContainer = document.getElementById('map');
      if (mapContainer && !mapRef.current) {
        // Create map
        mapRef.current = L.map('map').setView(position, 17);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 500,
        }).addTo(mapRef.current);

        // Add draggable marker with custom icon
        markerRef.current = L.marker(position, {
          draggable: true,
          icon: customIcon,
        }).addTo(mapRef.current);

        // Update position when marker is dragged
        markerRef.current.on('dragend', () => {
          if (markerRef.current) {
            const newPos = markerRef.current.getLatLng();
            setPosition([newPos.lat, newPos.lng]);
          }
        });

        // Handle map click to move marker
        mapRef.current.on('click', (e:any) => {
          if (markerRef.current && mapRef.current) {
            const newPos = e.latlng;
            markerRef.current.setLatLng(newPos);
            setPosition([newPos.lat, newPos.lng]);
          }
        });
      }
    }

    // Update marker position if it changes externally
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng(position);
      mapRef.current.setView(position, mapRef.current.getZoom());
    }

    // Force map to recalculate its size
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [position, setPosition]);

  return <div id="map" className="h-full w-full z-0" />;
}
