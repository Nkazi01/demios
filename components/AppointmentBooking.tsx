import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface AppointmentBookingProps {
  clinic: any;
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export default function AppointmentBooking({ clinic, onNavigate, onBack }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentDate = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your appointment has been successfully booked.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium">{clinic?.name}</p>
              <p className="text-sm text-gray-600">{selectedDate} at {selectedTime}</p>
            </div>
            <Button onClick={() => onNavigate('dashboard')} className="w-full">
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Book Appointment</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">{clinic?.name}</h3>
            <p className="text-sm text-gray-600">{clinic?.address}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {dates.slice(0, 10).map((date) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                
                return (
                  <Button
                    key={dateStr}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`p-3 h-auto flex-col ${isSelected ? 'bg-blue-600' : ''}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <span className="text-xs">{dayName}</span>
                    <span className="font-medium">{dayNum}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Available Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    size="sm"
                    className={selectedTime === time ? 'bg-blue-600' : ''}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {selectedDate && selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Clinic:</span>
                <span className="font-medium">{clinic?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">General Consultation</span>
              </div>
              
              <Button onClick={handleConfirm} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Confirm Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}