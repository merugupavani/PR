import React, { useState } from 'react';
import { Menu, Heart, User, LogOut, Calculator, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserInfo {
  email: string;
  fullName: string;
  age: string;
  phone: string;
  height: string; // in cm
  weight: string; // in kg
}

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: user?.email || '',
    fullName: '',
    age: '',
    phone: '',
    height: '',
    weight: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  const calculateBMI = () => {
    if (!userInfo.height || !userInfo.weight) return '0.0';
    const heightInMeters = parseFloat(userInfo.height) / 100;
    const weightInKg = parseFloat(userInfo.weight);
    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) return '0.0';
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate saving to backend
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const bmi = parseFloat(calculateBMI());
  const bmiStatus = getBMICategory(bmi);

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-2xl font-bold">HealthMentor</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowUserInfo(!showUserInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">{userInfo.fullName || 'Profile'}</span>
            </button>
            {user && (
              <button 
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showUserInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) setShowUserInfo(false);
        }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              <button 
                onClick={() => setShowUserInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Enter your email"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Age</label>
                  <input
                    type="number"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Age"
                    min="0"
                    max="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Height (cm)</label>
                  <input
                    type="number"
                    value={userInfo.height}
                    onChange={(e) => setUserInfo({ ...userInfo, height: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Height in cm"
                    min="0"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Weight (kg)</label>
                  <input
                    type="number"
                    value={userInfo.weight}
                    onChange={(e) => setUserInfo({ ...userInfo, weight: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Weight in kg"
                    min="0"
                    max="500"
                  />
                </div>
              </div>

              {/* BMI Calculator */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-gray-800">BMI Calculator</h4>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{calculateBMI()}</p>
                    <p className={`text-sm font-medium ${bmiStatus.color}`}>
                      {bmiStatus.category}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Normal BMI range:</p>
                    <p className="font-medium">18.5 - 24.9</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowUserInfo(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Save className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}