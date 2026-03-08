import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { AlertCircle } from 'lucide-react';

interface GoogleMapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, locationName: string) => void;
  height?: string;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const GoogleMapPicker = ({
  lat,
  lng,
  onLocationChange,
  height = '300px',
}: GoogleMapPickerProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPos, setMarkerPos] = useState({ lat, lng });

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Map Feature Not Available</p>
            <p className="text-xs mt-1 text-yellow-700">Google Maps API key is not configured. You can still enter coordinates manually below.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="w-full rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 animate-pulse"
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => {
          if (e.latLng) {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setMarkerPos({ lat: newLat, lng: newLng });
            onLocationChange(newLat, newLng, `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
          }
        }}
        options={{
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: false,
        }}
      >
        <Marker
          position={markerPos}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              setMarkerPos({ lat: newLat, lng: newLng });
              onLocationChange(newLat, newLng, `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
            }
          }}
          title="Click to place your issue location"
        />
      </GoogleMap>
      <p className="text-xs text-muted-foreground">Click on map or drag marker to select location</p>
    </div>
  );
};

export default GoogleMapPicker;
