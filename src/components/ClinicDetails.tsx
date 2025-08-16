import React from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ClinicDetailsProps {
  clinic: any;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export default function ClinicDetails({ clinic, onNavigate, onBack }: ClinicDetailsProps) {
  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No clinic selected</p>
      </div>
    );
  }

  const handleBookAppointment = () => {
    onNavigate('appointment-booking', { selectedClinic: clinic });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Clinic Details</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">{clinic.name}</h2>
              <Badge 
                variant={clinic.availability === 'Available' ? 'default' : 'secondary'}
                className={clinic.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
              >
                {clinic.availability}
              </Badge>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>{clinic.address}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>{clinic.phone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span>{clinic.hours}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>4.8 (127 reviews)</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={handleBookAppointment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Book Now
              </Button>
              <Button variant="outline" className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Services Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {clinic.services.map((service: string, index: number) => (
                <Badge key={index} variant="outline" className="justify-center py-2">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Facility Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((photo) => (
                <div key={photo} className="bg-gray-200 h-24 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Photo {photo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Sarah Johnson', rating: 5, comment: 'Excellent care and friendly staff. Highly recommended!' },
              { name: 'Mike Chen', rating: 4, comment: 'Good facilities, reasonable wait times.' },
              { name: 'Emma Wilson', rating: 5, comment: 'Dr. Smith was very thorough and professional.' }
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}