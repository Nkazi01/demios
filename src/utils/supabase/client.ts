// utils/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Create Supabase client
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export configuration for use in API calls
export const config = {
  supabaseUrl,
  supabaseKey,
  projectId,
  publicAnonKey
};

// Interfaces
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "patient" | "doctor" | "nurse" | "admin";
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  coordinates: { lat: number; lng: number };
  hours: string;
  availability: "Available" | "Busy" | "Closed";
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  clinic_id: string;
  doctor_id?: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
}

export interface HealthRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  date: string;
  type: string;
  diagnosis: string;
  medications: string[];
  notes: string;
  attachments: string[];
  vitals?: {
    blood_pressure?: string;
    weight?: string;
    temperature?: string;
    pulse?: string;
  };
  created_at: string;
}

// ✅ Add dataHelpers object for API calls to our server
export const dataHelpers = {
  async getClinics() {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/clinics`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch clinics from server, using fallback data');
        // Return fallback clinic data
        return {
          clinics: [
            {
              id: 'fallback-clinic-1',
              name: 'Village Health Center',
              address: '123 Main St, Ruraltown, State 12345',
              phone: '+1 (555) 123-4567',
              services: ['General Medicine', 'Pediatrics', 'Emergency Care', 'Pharmacy'],
              coordinates: { lat: 40.7128, lng: -74.0060 },
              hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Emergency Only',
              availability: 'Available',
              created_at: new Date().toISOString()
            }
          ]
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinics:', error);
      return { clinics: [] };
    }
  },

  async getAppointments(accessToken: string) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/appointments`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { appointments: [] };
    }
  },

  async getHealthRecords(accessToken: string) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/health-records`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch health records');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching health records:', error);
      return { records: [] };
    }
  },
};