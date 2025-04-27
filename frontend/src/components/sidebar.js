import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Mail, 
  Folder, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  UserCircle,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [userName, setUserName] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState('./images/my-pfp.jpg');

  useEffect(() => {
    setUpUserName();
    setupSidebarProfilePicture();
    highlightActiveButton();
  }, [location.pathname]);

  const highlightActiveButton = () => {
    const currentPage = location.pathname.split("/").pop().replace(".html", "");

    const sidebarButtons = {
      "dashboard": "dashboard-btn",
      "mytasks": "tasks-btn",
      "calendar": "calendar-btn",
      "inbox": "inbox-btn",
      "profile": "profile-btn"
    };

    return sidebarButtons[currentPage] || "";
  };

  const capitalize = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const setUpUserName = () => {
    let firstName = localStorage.getItem("UserFName") || "";
    let lastName = localStorage.getItem("UserLName") || "";

    firstName = capitalize(firstName);
    lastName = capitalize(lastName);

    let fullName = firstName + " " + lastName;
    setUserName(fullName || 'User');
  };

  const setupSidebarProfilePicture = async () => {
    const userId = localStorage.getItem("loggedInUserID") || "";
    const API_URL = "http://localhost:8080/api/users";

    if (!userId) {
      console.error("User ID not found. Sidebar PFP update skipped.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const userData = await response.json();
      const profilePicPath = userData.profilePicture; // Assuming this field stores the image path

      setProfilePicture(profilePicPath ? profilePicPath : "./images/my-pfp.jpg");
    } catch (error) {
      console.error("Error fetching sidebar profile picture:", error);
      setProfilePicture("./images/my-pfp.jpg"); // Fallback to default on error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate('/login');
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project?id=${projectId}`);
  };

  const addNewProject = () => {
    // Implementation for adding a new project
    console.log("Add new project functionality");
  };

  const activeButton = highlightActiveButton();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      {/* Toggle button positioned absolutely */}
      <button id="sidebar-toggle" className="sidebar-toggle" aria-label="Toggle sidebar" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <div className="user-info">
        <img 
          id="sidebar-pfp" 
          src={profilePicture} 
          alt="Profile Picture" 
          className="profile-pic" 
          onClick={() => navigate('/profile')}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = './images/default-avatar.jpg';
          }}
        />
        <p className="user-name">{userName}</p>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          id="dashboard-btn" 
          className={activeButton === "dashboard-btn" ? "current-btn" : ""}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard size={20} className="sidebar-icon" /> 
          <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>Dashboard</span>
        </button>
        
        <button 
          id="tasks-btn" 
          className={activeButton === "tasks-btn" ? "current-btn" : ""}
          onClick={() => navigate('/mytasks')}
        >
          <CheckSquare size={20} className="sidebar-icon" /> 
          <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>My Tasks</span>
        </button>
        
        <button 
          id="calendar-btn" 
          className={activeButton === "calendar-btn" ? "current-btn" : ""}
          onClick={() => navigate('/calendar')}
        >
          <Calendar size={20} className="sidebar-icon" /> 
          <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>Calendar</span>
        </button>
        
        <button 
          id="inbox-btn" 
          className={activeButton === "inbox-btn" ? "current-btn" : ""}
          onClick={() => navigate('/inbox')}
        >
          <Mail size={20} className="sidebar-icon" /> 
          <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>Inbox</span>
        </button>
        
        <hr />
        
        <div className="projects-section">
          <span>
            <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>My Projects</span> 
            <button id="add-project" onClick={addNewProject}>
              <Plus size={16} style={{ color: 'white' }} />
            </button>
          </span>
          
          <div className="projects-list" id="projects-list">
            {[1, 2, 3, 4].map(projectId => (
              <button 
                key={projectId}
                className="project-btn" 
                onClick={() => handleProjectClick(projectId)}
              >
                <Folder size={20} className="sidebar-icon" /> 
                <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>
                  Project {projectId}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <hr className="hrrr" />
        
        <div className="bottom-buttons">
          <button 
            id="profile-btn" 
            className={`profile-btn ${activeButton === "profile-btn" ? "current-btn" : ""}`}
            onClick={() => navigate('/profile')}
          >
            <UserCircle size={20} className="sidebar-icon" /> 
            <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>Profile</span>
          </button>
          
          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="sidebar-icon" /> 
            <span className="btn-text" style={{ display: isCollapsed ? 'none' : 'inline' }}>Logout</span>
          </button>
        </div>        
      </nav>
    </div>
  );
};

export default Sidebar;