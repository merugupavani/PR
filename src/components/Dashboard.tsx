import React, { useState } from 'react';
import { Activity, Heart, Pill as Pills, Calendar, Plus, X, Bell } from 'lucide-react';
import { AddAppointment } from './forms/AddAppointment';
import { AddMedication } from './forms/AddMedication';
import { AddActivity } from './forms/AddActivity';
import { Profile } from './Profile';

export function Dashboard() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [medications, setMedications] = useState([]);

  const handleAddAppointment = (appointment) => {
    setAppointments([...appointments, { ...appointment, completed: false }]);
    setShowAppointmentForm(false);
  };

  const handleAddActivity = (activity) => {
    setActivities([...activities, { ...activity, completed: false }]);
    setShowActivityForm(false);
  };

  const handleAddMedication = (medication) => {
    setMedications([...medications, { ...medication, completed: false }]);
    setShowMedicationForm(false);
  };

  const toggleComplete = (type, index) => {
    if (type === 'appointment') {
      const newAppointments = [...appointments];
      newAppointments[index].completed = !newAppointments[index].completed;
      setAppointments(newAppointments);
    } else if (type === 'medication') {
      const newMedications = [...medications];
      newMedications[index].completed = !newMedications[index].completed;
      setMedications(newMedications);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'activity':
        return 'bg-green-100 text-green-600';
      case 'medication':
        return 'bg-purple-100 text-purple-600';
      case 'appointment':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Combine and sort all schedule items by time
  const getAllScheduleItems = () => {
    const allItems = [
      ...appointments.map(item => ({ ...item, itemType: 'appointment' })),
      ...medications.map(item => ({ ...item, itemType: 'medication' })),
      ...activities.map(item => ({ ...item, itemType: 'activity' }))
    ].sort((a, b) => {
      const timeA = a.time || '';
      const timeB = b.time || '';
      return timeA.localeCompare(timeB);
    });

    return allItems;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Health Profile</h3>
                <p className="text-sm text-white/80">View Details</p>
              </div>
            </div>
            <button 
              onClick={() => setShowProfile(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Pills className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Medications</h3>
                <p className="text-sm text-white/80">Add New</p>
              </div>
            </div>
            <button 
              onClick={() => setShowMedicationForm(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Activity</h3>
                <p className="text-sm text-white/80">Add Activity</p>
              </div>
            </div>
            <button 
              onClick={() => setShowActivityForm(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-xl p-6 text-white hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Appointments</h3>
                <p className="text-sm text-white/80">Schedule New</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAppointmentForm(true)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Today's Schedule
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowMedicationForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                <Pills className="w-5 h-5" />
                <span>Add Medication</span>
              </button>
              <button 
                onClick={() => setShowActivityForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors"
              >
                <Activity className="w-5 h-5" />
                <span>Add Activity</span>
              </button>
              <button 
                onClick={() => setShowAppointmentForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Add Appointment</span>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {getAllScheduleItems().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No scheduled items for today</p>
                <p className="text-sm">Click the buttons above to add items to your schedule</p>
              </div>
            ) : (
              <>
                {getAllScheduleItems().map((item, index) => (
                  <div 
                    key={`${item.itemType}-${index}`} 
                    className={`flex items-center gap-4 p-4 rounded-lg group transition-all ${
                      item.completed ? 'bg-gray-50 opacity-75' : 'bg-gradient-to-r from-gray-50 to-white'
                    }`}
                  >
                    <div className="w-20 text-sm text-gray-600">{item.time}</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${getTypeColor(item.itemType)}`}>
                      {item.itemType}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {item.itemType === 'medication' ? item.name : item.title || item.type}
                      </h4>
                      {item.itemType === 'medication' && (
                        <p className="text-sm text-gray-600">Dosage: {item.dosage}</p>
                      )}
                      {item.itemType === 'activity' && (
                        <p className="text-sm text-gray-600">Duration: {item.duration} minutes</p>
                      )}
                    </div>
                    {item.itemType !== 'activity' && (
                      <button 
                        onClick={() => toggleComplete(item.itemType, index)}
                        className={`p-2 rounded-full transition-all ${
                          item.completed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {item.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                    )}
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 text-red-500 rounded-full transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {showAppointmentForm && (
        <AddAppointment 
          onClose={() => setShowAppointmentForm(false)}
          onAdd={handleAddAppointment}
        />
      )}
      
      {showMedicationForm && (
        <AddMedication 
          onClose={() => setShowMedicationForm(false)}
          onAdd={handleAddMedication}
        />
      )}
      
      {showActivityForm && (
        <AddActivity 
          onClose={() => setShowActivityForm(false)}
          onAdd={handleAddActivity}
        />
      )}

      {showProfile && (
        <Profile 
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}