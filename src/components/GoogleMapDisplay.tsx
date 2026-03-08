import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker, InfoWindow } from '@react-google-maps/api';
import { AlertTriangle } from 'lucide-react';
import { Complaint } from '@/types';

interface GoogleMapDisplayProps {
  complaints: Complaint[];
  onMarkerClick?: (complaint: Complaint) => void;
  height?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const GoogleMapDisplay = ({
  complaints,
  onMarkerClick,
  height = '400px',
}: GoogleMapDisplayProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    if (complaints.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      complaints.forEach(complaint => {
        bounds.extend(new google.maps.LatLng(complaint.lat, complaint.lng));
      });
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [complaints]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    if (onMarkerClick) {
      onMarkerClick(complaint);
    }
  };

  if (loadError) {
    return (
      <div className="w-full p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Google Maps Not Available</p>
            <p className="text-xs mt-1">Add VITE_GOOGLE_MAPS_API_KEY to .env file to enable map display</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full rounded-xl bg-secondary/50 flex items-center justify-center animate-pulse border border-border" style={{ height }}>
        <p className="text-muted-foreground">Loading map...</p>
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
        options={{
          zoomControl: true,
          fullscreenControl: true,
        }}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {complaints.map((complaint) => {
                const iconColor = complaint.isEmergency
                  ? '#DC2626'
                  : complaint.priority === 'high'
                  ? '#EA580C'
                  : complaint.priority === 'medium'
                  ? '#FBBF24'
                  : '#10B981';

                return (
                  <Marker
                    key={complaint._id}
                    position={{ lat: complaint.lat, lng: complaint.lng }}
                    clusterer={clusterer}
                    onClick={() => handleMarkerClick(complaint)}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: complaint.isEmergency ? 10 : 8,
                      fillColor: iconColor,
                      fillOpacity: 0.9,
                      strokeColor: '#fff',
                      strokeWeight: 2,
                    }}
                    title={complaint.issueType}
                  >
                    {selectedComplaint?._id === complaint._id && (
                      <InfoWindow onCloseClick={() => setSelectedComplaint(null)}>
                        <div className="bg-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
                          <h4 className="font-semibold text-foreground mb-1">{complaint.issueType}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{complaint.location}</p>
                          <div className="flex gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              complaint.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : complaint.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {complaint.priority.toUpperCase()}
                            </span>
                            {complaint.isEmergency && (
                              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {complaint.nearbyCount} complaints nearby
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </>
          )}
        </MarkerClusterer>
      </GoogleMap>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <span>Emergency</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span>Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
