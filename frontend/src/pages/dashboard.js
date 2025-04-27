import React, { useState, useEffect } from 'react';
import '../css/dashboard.css';
import '../css/toast.css';
import { 
  Calendar, 
  Clock, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Columns, 
  Bell, 
  User,
  Check,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import Sidebar from '../components/sidebar'; 

const Dashboard = () => {
  // State variables
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Cleaning up desk", 
      tag: "Inbox", 
      tagColor: "blue", 
      time: "08:20 AM", 
      completed: false 
    },
    { 
      id: 2, 
      title: "Client meeting prep", 
      tag: "Work", 
      tagColor: "#10B981", 
      time: "10:20 AM", 
      completed: false 
    },
    { 
      id: 3, 
      title: "Small yoga", 
      tag: "Health", 
      tagColor: "#EF4444", 
      time: "02:30 PM", 
      completed: false 
    }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([
    "2023-12-08", "2023-12-15", "2023-12-22", "2023-12-29"
  ]);

  // User information
  const [user, setUser] = useState({
    firstName: '',
    lastName: ''
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Get user info from localStorage
    const userId = localStorage.getItem("loggedInUserID") || "";
    const userEmail = localStorage.getItem("loggedInUser") || "";
    const firstName = localStorage.getItem("UserFName") || "";
    const lastName = localStorage.getItem("UserLName") || "";

    if (!userId) {
      showToast("User not found! Redirecting to login.", "error");
      setTimeout(() => {
        // Redirect to login page using react-router
        //window.location.href = "/login";
      }, 2000);
      //return;
    }

    setUser({
      firstName: capitalize(firstName),
      lastName: capitalize(lastName)
    });
  }, []);

  // Timer interval effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            showToast("Focus timer completed!", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Helper functions
  const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const toggleTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      if (remainingSeconds <= 0) {
        setRemainingSeconds(timerMinutes * 60);
      }
      setTimerRunning(true);
    }
  };

  const formatTimerDisplay = () => {
    if (timerRunning) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${timerMinutes} mins`;
    }
  };

  const decreaseTimer = () => {
    if (!timerRunning && timerMinutes > 5) {
      setTimerMinutes(prev => prev - 5);
      setRemainingSeconds((timerMinutes - 5) * 60);
    }
  };

  const increaseTimer = () => {
    if (!timerRunning && timerMinutes < 60) {
      setTimerMinutes(prev => prev + 5);
      setRemainingSeconds((timerMinutes + 5) * 60);
    }
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed) {
          showToast("Task completed!", "success");
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const addNewTask = () => {
    if (newTaskInput.trim() === '') return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    const newTask = {
      id: Date.now(),
      title: newTaskInput,
      tag: "Inbox",
      tagColor: "blue",
      time: timeString,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskInput('');
    showToast("Task added!", "info");
  };

  const handleTaskInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewTask();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-2 rounded shadow-lg flex items-center space-x-2 transition-all duration-300 transform translate-x-0 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 
              toast.type === 'error' ? 'bg-red-500 text-white' : 
              toast.type === 'warning' ? 'bg-yellow-500 text-white' : 
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <Check size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'warning' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
      
      {/* Main application container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header with search and user info */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
              <Columns size={18} />
              <span>Analytics</span>
            </button>
            
            <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              <Bell size={20} className="text-gray-600" />
            </div>
            
            <div className="cursor-pointer p-2 hover:bg-gray-100 rounded-full">
              <User size={20} className="text-gray-600" />
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-md">
                <h1 className="text-2xl font-semibold">Welcome Back, {user.firstName} {user.lastName}</h1>
                <p className="opacity-90 mt-1">You have {tasks.filter(task => !task.completed).length} active tasks for today</p>
              </div>
              
              {/* Upcoming tasks section */}
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock size={20} className="mr-2 text-blue-500" />
                  <span>Up next</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                    <h3 className="font-medium text-gray-800">Design Team Meeting - Discuss new project wireframes</h3>
                    <div className="flex items-center mt-2 text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span>11:30 AM - 12:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-800">Client Meeting - Review project updates and seek approval</h3>
                    <div className="flex items-center mt-2 text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span>01:00 PM - 02:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Task input section */}
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center">
                  <div 
                    className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 cursor-pointer hover:border-blue-500 transition-colors"
                  ></div>
                  
                  <input 
                    type="text" 
                    placeholder="Add task for today" 
                    className="flex-1 py-2 focus:outline-none"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyPress={handleTaskInputKeyPress}
                  />
                  
                  <Search size={18} className="text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Inbox</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                      <Clock size={16} />
                      <span>Now</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 px-3 py-1 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                      <Calendar size={16} />
                      <span>Tomorrow</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 px-3 py-1 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                      <Calendar size={16} />
                      <span>Next week</span>
                    </div>
                  </div>
                  
                  <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    Custom
                  </button>
                </div>
              </div>
              
              {/* Today's task list */}
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Check size={20} className="mr-2 text-green-500" />
                  <span>Today's tasks</span>
                </h2>
                
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-md"
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-5 h-5 border-2 ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} rounded-full mr-3 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center`}
                          onClick={() => toggleTaskCompleted(task.id)}
                        >
                          {task.completed && <Check size={12} className="text-white" />}
                        </div>
                        
                        <div>
                          <div className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center mt-1">
                            <div 
                              className="w-2 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: task.tagColor === 'blue' ? '#3B82F6' : task.tagColor }}
                            ></div>
                            <span className="text-xs text-gray-500">{task.tag}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock size={14} className="mr-1" />
                        {task.time}
                        <ChevronRight size={16} className="ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - 1/3 width */}
            <div className="space-y-6">
              {/* Calendar widget */}
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar size={20} className="mr-2 text-blue-500" />
                  <span>Calendar</span>
                </h2>
                
                {/* Calendar component would go here */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-500">Calendar placeholder</div>
                  <div className="mt-2 text-gray-800 font-medium">
                    {selectedCalendarDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Focus timer widget */}
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Clock size={20} className="mr-2 text-indigo-500" />
                    <span>Focus timer</span>
                  </h2>
                  <div className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                    <span className="mr-1">Task List</span>
                    <ChevronDown size={16} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={decreaseTimer}
                    disabled={timerRunning || timerMinutes <= 5}
                  >
                    <Minus size={20} className={timerRunning || timerMinutes <= 5 ? "text-gray-400" : "text-gray-700"} />
                  </button>
                  
                  <div className="text-2xl font-bold text-gray-800">{formatTimerDisplay()}</div>
                  
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={increaseTimer}
                    disabled={timerRunning || timerMinutes >= 60}
                  >
                    <Plus size={20} className={timerRunning || timerMinutes >= 60 ? "text-gray-400" : "text-gray-700"} />
                  </button>
                </div>
                
                <button 
                  className={`w-full py-3 ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg flex items-center justify-center font-medium transition-colors`}
                  onClick={toggleTimer}
                >
                  {timerRunning ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                  <span>{timerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;