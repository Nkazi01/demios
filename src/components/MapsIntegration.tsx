import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Clock, Star, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Location {
  lat: number;
  lng: number;
}

interface MapMarker {
  id: string;
  position: Location;
  title: string;
  type: 'clinic' | 'user' | 'doctor';
  data?: any;
}

interface MapsIntegrationProps {
  clinics: any[];
  userLocation?: Location;
  onClinicSelect?: (clinic: any) => void;
  className?: string;
}

export default function MapsIntegration({ 
  clinics, 
  userLocation, 
  onClinicSelect,
  className = ''
}: MapsIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(userLocation || null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>(
    userLocation || { lat: 40.7128, lng: -74.0060 } // Default to NYC
  );

  useEffect(() => {
    if (!userLocation) {
      getCurrentLocation();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setMapCenter(location);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirectionsUrl = (destination: Location): string => {
    if (currentLocation) {
      return `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${destination.lat},${destination.lng}`;
    }
    return `https://www.google.com/maps/search/${destination.lat},${destination.lng}`;
  };

  const sortedClinics = currentLocation 
    ? clinics.map(clinic => ({
        ...clinic,
        distance: calculateDistance(currentLocation, clinic.coordinates || { lat: 0, lng: 0 })
      })).sort((a, b) => a.distance - b.distance)
    : clinics;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Container */}
      <Card className="card-enhanced overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Simulated roads */}
                <path d="M0,100 Q100,80 200,100 T400,100" stroke="#6b7280" strokeWidth="3" fill="none" />
                <path d="M200,0 Q220,50 200,100 T200,200" stroke="#6b7280" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="glass-button"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Map Markers */}
            <div className="absolute inset-0">
              {/* User location marker */}
              {currentLocation && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ 
                    left: '50%', 
                    top: '40%' 
                  }}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-glow"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              )}

              {/* Clinic markers */}
              {sortedClinics.slice(0, 3).map((clinic, index) => (
                <div 
                  key={clinic.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-20"
                  style={{ 
                    left: `${30 + index * 25}%`, 
                    top: `${50 + index * 10}%` 
                  }}
                  onClick={() => setSelectedMarker({
                    id: clinic.id,
                    position: clinic.coordinates,
                    title: clinic.name,
                    type: 'clinic',
                    data: clinic
                  })}
                >
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-red-500 drop-shadow-md" fill="currentColor" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap shadow-md">
                      {clinic.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 glass-card p-2 text-xs">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" fill="currentColor" />
                <span>Health Clinics</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Marker Info */}
      {selectedMarker && selectedMarker.data && (
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{selectedMarker.data.name}</h3>
                <p className="text-sm text-gray-600">{selectedMarker.data.address}</p>
              </div>
              <Badge 
                variant={selectedMarker.data.availability === 'Available' ? 'default' : 'secondary'}
                className={selectedMarker.data.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
              >
                {selectedMarker.data.availability}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{selectedMarker.data.hours}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{selectedMarker.data.phone}</span>
              </div>
              {selectedMarker.data.distance && (
                <div className="flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  <span>{selectedMarker.data.distance.toFixed(1)} km</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="btn-glass-primary flex-1"
                onClick={() => onClinicSelect?.(selectedMarker.data)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="btn-glass-secondary"
                onClick={() => window.open(getDirectionsUrl(selectedMarker.position), '_blank')}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Clinics List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Nearby Clinics</h3>
        {sortedClinics.slice(0, 5).map((clinic) => (
          <Card key={clinic.id} className="card-enhanced cursor-pointer" onClick={() => onClinicSelect?.(clinic)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{clinic.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{clinic.address}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>4.8</span>
                    </div>
                    {clinic.distance && (
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>{clinic.distance.toFixed(1)} km</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>
                </div>
                
                <Badge 
                  variant={clinic.availability === 'Available' ? 'default' : 'secondary'}
                  className={clinic.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                >
                  {clinic.availability}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}