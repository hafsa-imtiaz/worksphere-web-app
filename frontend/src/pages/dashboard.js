import React, { useState, useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';
import styles from '../css/dashboard.module.css';

const Dashboard = () => {
  // State variables
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
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
    }

    setUser({
      firstName: capitalize(firstName),
      lastName: capitalize(lastName)
    });

    // Initial sidebar state
    const initialSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    setSidebarCollapsed(initialSidebarState);

    // Listen for sidebar toggle events
    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggled', handleSidebarToggle);

    // Cleanup event listener
    return () => {
      window.removeEventListener('sidebarToggled', handleSidebarToggle);
    };
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
    if (!name) return '';
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
    <div className={styles.appContainer}>
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Toast container */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`${styles.toast} ${
              toast.type === 'success' ? styles.successToast : 
              toast.type === 'error' ? styles.errorToast : 
              toast.type === 'warning' ? styles.warningToast : 
              styles.infoToast
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
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        {/* Top header with search and user info */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.analyticsButton}>
              <Columns size={18} />
              <span>Analytics</span>
            </button>
            
            <div className={styles.notificationIcon}>
              <div className={styles.notificationDot}></div>
              <Bell size={20} />
            </div>
            
            <div className={styles.userIcon}>
              <User size={20} />
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className={styles.mainArea}>
          <div className={styles.dashboardGrid}>
            {/* Left column - 2/3 width */}
            <div className={styles.leftColumn}>
              {/* Welcome banner */}
              <div className={styles.welcomeBanner}>
                <h1 className={styles.welcomeTitle}>Welcome Back, {user.firstName} {user.lastName}</h1>
                <p className={styles.welcomeSubtitle}>You have {tasks.filter(task => !task.completed).length} active tasks for today</p>
              </div>
              
              {/* Upcoming tasks section */}
              <div className={styles.widget}>
                <h2 className={styles.widgetTitle}>
                  <Clock size={20} className={styles.widgetIcon} />
                  <span>Up next</span>
                </h2>
                
                <div className={styles.upcomingTasks}>
                  <div className={`${styles.upcomingTask} ${styles.activeTask}`}>
                    <h3 className={styles.taskTitle}>Design Team Meeting - Discuss new project wireframes</h3>
                    <div className={styles.taskTime}>
                      <Clock size={16} />
                      <span>11:30 AM - 12:00 PM</span>
                    </div>
                  </div>
                  
                  <div className={styles.upcomingTask}>
                    <h3 className={styles.taskTitle}>Client Meeting - Review project updates and seek approval</h3>
                    <div className={styles.taskTime}>
                      <Clock size={16} />
                      <span>01:00 PM - 02:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Task input section */}
              <div className={styles.widget}>
                <div className={styles.taskInputContainer}>
                  <div className={styles.taskCheckbox}></div>
                  
                  <input 
                    type="text" 
                    placeholder="Add task for today" 
                    className={styles.taskInput}
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyPress={handleTaskInputKeyPress}
                  />
                  
                  <Search size={18} className={styles.taskInputIcon} />
                </div>
                
                <div className={styles.taskInputActions}>
                  <button className={styles.tagButton}>
                    <div className={styles.tagDot}></div>
                    <span>Inbox</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  <div className={styles.timeOptions}>
                    <div className={`${styles.timeOption} ${styles.activeTimeOption}`}>
                      <Clock size={16} />
                      <span>Now</span>
                    </div>
                    
                    <div className={styles.timeOption}>
                      <Calendar size={16} />
                      <span>Tomorrow</span>
                    </div>
                    
                    <div className={styles.timeOption}>
                      <Calendar size={16} />
                      <span>Next week</span>
                    </div>
                  </div>
                  
                  <button className={styles.customButton}>
                    Custom
                  </button>
                </div>
              </div>
              
              {/* Today's task list */}
              <div className={styles.widget}>
                <h2 className={styles.widgetTitle}>
                  <Check size={20} className={styles.completedIcon} />
                  <span>Today's tasks</span>
                </h2>
                
                <div className={styles.taskList}>
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={styles.taskItem}
                    >
                      <div className={styles.taskDetails}>
                        <div 
                          className={`${styles.taskCheckbox} ${task.completed ? styles.taskCompleted : ''}`}
                          onClick={() => toggleTaskCompleted(task.id)}
                        >
                          {task.completed && <Check size={12} className={styles.checkIcon} />}
                        </div>
                        
                        <div>
                          <div className={`${styles.taskTitle} ${task.completed ? styles.taskTitleCompleted : ''}`}>
                            {task.title}
                          </div>
                          <div className={styles.taskTag}>
                            <div 
                              className={styles.tagDot} 
                              style={{ backgroundColor: task.tagColor === 'blue' ? '#3B82F6' : task.tagColor }}
                            ></div>
                            <span className={styles.tagName}>{task.tag}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.taskMeta}>
                        <Clock size={14} />
                        {task.time}
                        <ChevronRight size={16} className={styles.taskArrow} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - 1/3 width */}
            <div className={styles.rightColumn}>
              {/* Calendar widget */}
              <div className={styles.widget}>
                <h2 className={styles.widgetTitle}>
                  <Calendar size={20} className={styles.calendarIcon} />
                  <span>Calendar</span>
                </h2>
                
                {/* Calendar component would go here */}
                <div className={styles.calendarPlaceholder}>
                  <div className={styles.calendarInfo}>Calendar placeholder</div>
                  <div className={styles.selectedDate}>
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
              <div className={styles.widget}>
                <div className={styles.timerHeader}>
                  <h2 className={styles.widgetTitle}>
                    <Clock size={20} className={styles.timerIcon} />
                    <span>Focus timer</span>
                  </h2>
                  <div className={styles.timerList}>
                    <span>Task List</span>
                    <ChevronDown size={16} />
                  </div>
                </div>
                
                <div className={styles.timerControls}>
                  <button 
                    className={`${styles.timerButton} ${(timerRunning || timerMinutes <= 5) ? styles.timerButtonDisabled : ''}`}
                    onClick={decreaseTimer}
                    disabled={timerRunning || timerMinutes <= 5}
                  >
                    <Minus size={20} />
                  </button>
                  
                  <div className={styles.timerDisplay}>{formatTimerDisplay()}</div>
                  
                  <button 
                    className={`${styles.timerButton} ${(timerRunning || timerMinutes >= 60) ? styles.timerButtonDisabled : ''}`}
                    onClick={increaseTimer}
                    disabled={timerRunning || timerMinutes >= 60}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button 
                  className={`${styles.startButton} ${timerRunning ? styles.pauseButton : ''}`}
                  onClick={toggleTimer}
                >
                  {timerRunning ? <Pause size={18} /> : <Play size={18} />}
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