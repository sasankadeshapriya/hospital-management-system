import React from 'react';
import { Heart, Droplets, Thermometer, Activity, ChevronLeft } from 'lucide-react';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  Icon: React.ElementType;
  latest?: string;
}

function VitalCard({ title, value, unit, Icon, latest }: VitalCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{latest || 'Latest'}</span>
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-gray-500">{unit}</span>
      </div>
    </div>
  );
}

function PatientDetailsPage() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-1 hover:text-indigo-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Patients
          </button>
          <span>/</span>
          <span>Patient Record - Rebecca Young</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Record <span className="text-gray-400">- Rebecca Young</span>
          </h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Update Record
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <VitalCard
            title="ECG Results"
            value="54"
            unit="bpm"
            Icon={Activity}
          />
          <VitalCard
            title="Blood Pressure"
            value="118/73"
            unit="mmHg"
            Icon={Heart}
          />
          <VitalCard
            title="Temperature"
            value="98"
            unit="°Fahrenheit"
            Icon={Thermometer}
          />
          <VitalCard
            title="Blood Glucose Level"
            value="219"
            unit="mg/dL"
            Icon={Droplets}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Rebecca Young"
                  className="h-20 w-20 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Rebecca Young</h2>
                  <p className="text-gray-500">Patient ID: #271</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Age', value: '36' },
                  { label: 'Blood Type', value: 'O-' },
                  { label: 'Telephone', value: '+96659756070' },
                  { label: 'Address', value: 'Colorado, United States' }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-500">{item.label}:</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-4">
                {[
                  { label: 'Doctor', value: 'Jane Doe' },
                  { label: 'Disease', value: 'Heart failure' },
                  { label: 'Condition', value: 'Serious' },
                  { label: 'Status', value: 'Admitted' },
                  { label: 'Room No.', value: '271' }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-500">{item.label}:</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-gray-900 font-medium mt-6 mb-3">Medication:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>beta blockers</li>
                <li>angiotensin receptor-neprilysin inhibitors (ARNIs)</li>
                <li>sodium-glucose co-transporter 2 inhibitors</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Records</h3>
              <div className="space-y-4">
                <div className="flex gap-6">
                  <span className="text-gray-500">25/09/2024:</span>
                  <div>
                    <p className="font-medium text-gray-900">Admitted for Diabetes.</p>
                    <p className="text-gray-600">Test results were 219 mg/dL.</p>
                    <p className="text-gray-600">Treatment done by Dr. Sam Philips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedule</h3>
            <div className="flex items-center gap-6 p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="text-sm text-indigo-600">2024</p>
                <p className="text-2xl font-bold text-indigo-600">September</p>
                <p className="text-4xl font-bold text-indigo-600">27</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">Bypass surgery</h4>
                <p className="text-gray-600">8:00 am</p>
                <p className="text-gray-500 mt-2">Conducted by: Dr. Jane Doe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PatientDetailsPage;