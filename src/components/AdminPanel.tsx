import React, { useState } from 'react';
import { ArrowLeft, Building, Users, BarChart3, Plus, Edit, Trash2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminPanelProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export default function AdminPanel({ onNavigate, onBack }: AdminPanelProps) {
  const [selectedTab, setSelectedTab] = useState('clinics');

  const clinics = [
    {
      id: 1,
      name: 'Village Health Center',
      address: '123 Main St, Ruraltown',
      phone: '+1 (555) 123-4567',
      services: 3,
      doctors: 2,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Community Medical Clinic',
      address: '456 Oak Ave, Countryside',
      phone: '+1 (555) 987-6543',
      services: 5,
      doctors: 3,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Rural Care Center',
      address: '789 Pine Rd, Farmville',
      phone: '+1 (555) 456-7890',
      services: 4,
      doctors: 4,
      status: 'Pending'
    }
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@email.com', role: 'Patient', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Dr. Sarah Smith', email: 'sarah@clinic.com', role: 'Doctor', status: 'Active', joinDate: '2022-11-20' },
    { id: 3, name: 'Mary Johnson', email: 'mary@email.com', role: 'Patient', status: 'Active', joinDate: '2023-03-10' },
    { id: 4, name: 'Dr. Michael Brown', email: 'michael@clinic.com', role: 'Doctor', status: 'Inactive', joinDate: '2023-02-05' }
  ];

  const analyticsData = [
    { metric: 'Total Appointments', value: '1,234', change: '+12%', period: 'This month' },
    { metric: 'Active Users', value: '3,456', change: '+8%', period: 'This week' },
    { metric: 'Consultations', value: '567', change: '+15%', period: 'This month' },
    { metric: 'Revenue', value: '$45,678', change: '+23%', period: 'This month' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium">Admin Panel</h1>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clinics">Manage Clinics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clinics" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Clinic Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Clinic
              </Button>
            </div>
            
            <div className="space-y-4">
              {clinics.map((clinic) => (
                <Card key={clinic.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{clinic.name}</h3>
                        <p className="text-sm text-gray-600">{clinic.address}</p>
                        <p className="text-sm text-gray-600">{clinic.phone}</p>
                      </div>
                      <Badge 
                        variant={clinic.status === 'Active' ? 'default' : 'secondary'}
                        className={clinic.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                      >
                        {clinic.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>{clinic.services} Services</span>
                      <span>{clinic.doctors} Doctors</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">User Management</h2>
              <div className="flex gap-2">
                <Input placeholder="Search users..." className="w-64" />
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge 
                            variant={user.status === 'Active' ? 'default' : 'secondary'}
                            className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Joined</p>
                        <p className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Analytics & Reports</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {analyticsData.map((data, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm text-gray-600">{data.metric}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        data.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {data.change}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold mb-1">{data.value}</p>
                    <p className="text-xs text-gray-500">{data.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Server Uptime</span>
                      <span>99.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Database Performance</span>
                      <span>95.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95.2%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Response Time</span>
                      <span>87.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '2 hours ago', event: 'New clinic registration approved', type: 'success' },
                    { time: '4 hours ago', event: 'System backup completed successfully', type: 'info' },
                    { time: '6 hours ago', event: 'High API usage detected', type: 'warning' },
                    { time: '1 day ago', event: 'Monthly analytics report generated', type: 'info' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}