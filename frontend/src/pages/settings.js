import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Lock, Palette, Moon, Sun, Monitor, ChevronRight, Save, Upload } from 'lucide-react';

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState('security');
  const [theme, setTheme] = useState('system');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    mentions: true
  });
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    jobTitle: 'Product Manager',
    bio: 'Passionate about productivity and collaboration tools.'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleProfileChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="w-full">
            <div className="flex items-center mb-6">
              <User size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
            </div>
            
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Upload size={48} className="text-indigo-600" />
                  </div>
                  <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                    <Upload size={14} className="mr-1" /> Change photo
                  </button>
                </div>
                <div className="flex-1 space-y-5">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h3 className="text-xl font-medium text-gray-800">{profileData.name}</h3>
                    <p className="text-indigo-600 font-medium">{profileData.email}</p>
                    <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mt-2">
                      {profileData.jobTitle}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">About</h4>
                    <p className="text-gray-700">{profileData.bio}</p>
                  </div>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center group"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="w-full">
            <div className="flex items-center mb-6">
              <Bell size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Notification Preferences</h2>
            </div>
            
            <div className="w-full">
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([setting, value]) => {
                  const settingName = setting === 'emailNotifications' ? 'Email Notifications' :
                                    setting === 'pushNotifications' ? 'Push Notifications' :
                                    setting === 'taskReminders' ? 'Task Reminders' :
                                    setting === 'weeklyDigest' ? 'Weekly Digest' : 'Mentions';
                  
                  return (
                    <div key={setting} className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-800">{settingName}</span>
                      <div className="relative inline-block w-12">
                        <input
                          type="checkbox"
                          id={setting}
                          checked={value}
                          onChange={() => handleNotificationChange(setting)}
                          className="opacity-0 absolute h-0 w-0"
                        />
                        <label
                          htmlFor={setting}
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                            value ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
                              value ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="w-full">
            <div className="flex items-center mb-6">
              <Palette size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Appearance</h2>
            </div>
            
            <div className="w-full">
              <h3 className="font-medium text-lg mb-4 text-gray-800">Theme Selection</h3>
              <div className="flex gap-4">
                {[{ name: 'light', icon: Sun }, { name: 'dark', icon: Moon }, { name: 'system', icon: Monitor }].map((option) => (
                  <div
                    key={option.name}
                    onClick={() => setTheme(option.name)}
                    className={`cursor-pointer p-6 border rounded-xl flex flex-col items-center space-y-3 hover:shadow-md transition-all ${
                      theme === option.name ? 'border-indigo-600 bg-indigo-50 shadow' : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <option.icon size={32} className={theme === option.name ? 'text-indigo-600' : 'text-gray-600'} />
                    <span className={`font-medium capitalize ${theme === option.name ? 'text-indigo-600' : 'text-gray-700'}`}>{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="w-full">
            <div className="flex items-center mb-6">
              <Lock size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Security</h2>
            </div>
            
            <div className="w-full">
              <h3 className="font-medium text-lg mb-6">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <input 
                  type="password" 
                  placeholder="Current password" 
                  className="block w-full rounded-md border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
                <input 
                  type="password" 
                  placeholder="New password" 
                  className="block w-full rounded-md border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="block w-full rounded-md border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
                <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all w-full">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      {/* Header - Full width */}
      <header className="bg-white shadow-sm w-full py-4">
        <div className="w-full text-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">WorkSphere</Link>
        </div>
      </header>

      {/* Main Content - Full width */}
      <div className="flex-grow flex flex-col items-center w-full">
        {/* Settings Header */}
        <div className="w-full text-center py-6">
          <div className="inline-flex justify-center items-center mb-2">
            <div className="bg-indigo-600 text-white p-2 rounded-full">
              <Palette size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 ml-3">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        {/* Settings Container - Full width with centered content */}
        <div className="w-full flex justify-center px-4 pb-12">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white p-0 border-r border-gray-100">
                <div className="flex flex-col">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`flex items-center py-4 px-6 transition-colors text-left ${
                      activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="mr-3" size={18} /> Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab('notifications')} 
                    className={`flex items-center py-4 px-6 transition-colors text-left ${
                      activeTab === 'notifications' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Bell className="mr-3" size={18} /> Notifications
                  </button>
                  <button 
                    onClick={() => setActiveTab('appearance')} 
                    className={`flex items-center py-4 px-6 transition-colors text-left ${
                      activeTab === 'appearance' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Palette className="mr-3" size={18} /> Appearance
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')} 
                    className={`flex items-center py-4 px-6 transition-colors text-left ${
                      activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Lock className="mr-3" size={18} /> Security
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-grow p-8 bg-white">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Full width */}
      <footer className="bg-white w-full py-4 mt-auto border-t border-gray-100">
        <div className="text-center text-gray-600">
          &copy; 2025 WorkSphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}