import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Calendar, User, Pill, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HealthRecordsProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export default function HealthRecords({ onNavigate, onBack }: HealthRecordsProps) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const records = [
    {
      id: 1,
      date: '2023-08-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Smith',
      diagnosis: 'Hypertension follow-up',
      clinic: 'Village Health Center',
      medications: ['Lisinopril 10mg', 'Hydrochlorothiazide 25mg'],
      notes: 'Patient shows improvement in blood pressure control. Continue current medication regimen.',
      attachments: ['Blood_pressure_chart.pdf', 'Lab_results.pdf']
    },
    {
      id: 2,
      date: '2023-07-22',
      type: 'Lab Results',
      doctor: 'Dr. Michael Johnson',
      diagnosis: 'Annual Health Checkup',
      clinic: 'Community Medical Clinic',
      medications: [],
      notes: 'All lab values within normal limits. Patient advised to maintain healthy lifestyle.',
      attachments: ['Complete_blood_count.pdf', 'Lipid_panel.pdf']
    },
    {
      id: 3,
      date: '2023-06-10',
      type: 'Prescription',
      doctor: 'Dr. Emily Chen',
      diagnosis: 'Upper Respiratory Infection',
      clinic: 'Rural Care Center',
      medications: ['Amoxicillin 500mg', 'Ibuprofen 400mg'],
      notes: 'Patient reported improvement in symptoms. Complete antibiotic course as prescribed.',
      attachments: ['Prescription_scan.pdf']
    }
  ];

  const vitals = [
    { date: '2023-08-15', bp: '128/82', weight: '75kg', temperature: '98.6°F', pulse: '72' },
    { date: '2023-07-22', bp: '135/88', weight: '76kg', temperature: '98.4°F', pulse: '68' },
    { date: '2023-06-10', bp: '140/90', weight: '77kg', temperature: '99.2°F', pulse: '78' }
  ];

  if (selectedRecord) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-medium">Record Details</h1>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedRecord.type}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(selectedRecord.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Badge variant="outline">{selectedRecord.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Doctor</label>
                  <p className="font-medium">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Clinic</label>
                  <p className="font-medium">{selectedRecord.clinic}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Diagnosis</label>
                <p className="font-medium">{selectedRecord.diagnosis}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Doctor's Notes</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedRecord.notes}</p>
              </div>
              
              {selectedRecord.medications.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600">Medications</label>
                  <div className="space-y-2 mt-2">
                    {selectedRecord.medications.map((med: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRecord.attachments.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600">Attachments</label>
                  <div className="space-y-2 mt-2">
                    {selectedRecord.attachments.map((attachment: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
          <h1 className="text-xl font-medium">Health Records</h1>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="space-y-4 mt-6">
            {records.map((record) => (
              <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecord(record)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{record.type}</h3>
                      <p className="text-sm text-gray-600">{record.diagnosis}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(record.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{record.doctor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{record.clinic}</span>
                    </div>
                  </div>
                  
                  {record.medications.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">{record.medications.length} medication(s) prescribed</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-4 mt-6">
            {vitals.map((vital, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Vital Signs</h3>
                    <Badge variant="outline" className="text-xs">
                      {new Date(vital.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">Blood Pressure</span>
                      </div>
                      <p className="font-semibold text-lg">{vital.bp}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Weight</span>
                      </div>
                      <p className="font-semibold text-lg">{vital.weight}</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Temperature</span>
                      </div>
                      <p className="font-semibold text-lg">{vital.temperature}</p>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600">Pulse</span>
                      </div>
                      <p className="font-semibold text-lg">{vital.pulse} bpm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}