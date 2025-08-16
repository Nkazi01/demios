import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ClinicLocatorProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export default function ClinicLocator({ onNavigate, onBack }: ClinicLocatorProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const clinics = [
    {
      id: 1,
      name: 'Village Health Center',
      address: '123 Main St, Ruraltown',
      distance: '2.1 km',
      services: ['General Medicine', 'Pediatrics', 'Emergency'],
      hours: '8:00 AM - 6:00 PM',
      phone: '+1 (555) 123-4567',
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Community Medical Clinic',
      address: '456 Oak Ave, Countryside',
      distance: '5.3 km',
      services: ['Family Medicine', 'Women\'s Health', 'Vaccination'],
      hours: '9:00 AM - 5:00 PM',
      phone: '+1 (555) 987-6543',
      availability: 'Busy'
    },
    {
      id: 3,
      name: 'Rural Care Center',
      address: '789 Pine Rd, Farmville',
      distance: '8.7 km',
      services: ['Internal Medicine', 'Cardiology', 'Dermatology'],
      hours: '7:00 AM - 8:00 PM',
      phone: '+1 (555) 456-7890',
      availability: 'Available'
    }
  ];

  const handleSelectClinic = (clinic: any) => {
    onNavigate('clinic-details', { selectedClinic: clinic });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Find Clinics</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            Map
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {viewMode === 'map' && (
          <div className="bg-green-100 h-64 rounded-lg flex items-center justify-center mb-4 relative">
            <div className="text-green-700">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Interactive Map View</p>
              <p className="text-sm">Showing nearby clinics</p>
            </div>
            <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectClinic(clinic)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{clinic.name}</h3>
                  <Badge 
                    variant={clinic.availability === 'Available' ? 'default' : 'secondary'}
                    className={clinic.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                  >
                    {clinic.availability}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{clinic.address}</span>
                    <span className="ml-auto text-blue-600">{clinic.distance}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{clinic.hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{clinic.phone}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}