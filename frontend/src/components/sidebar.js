import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [userName, setUserName] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState('./images/my-pfp.jpg');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUpUserName();
    setupSidebarProfilePicture();
    fetchUserProjects();
  }, []);

  const getCurrentActivePage = () => {
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
    const firstName = capitalize(localStorage.getItem("UserFName") || "");
    const lastName = capitalize(localStorage.getItem("UserLName") || "");
    const fullName = `${firstName} ${lastName}`.trim();
    
    setUserName(fullName || 'John Doe');
  };

  const setupSidebarProfilePicture = async () => {
    const userId = localStorage.getItem("loggedInUserID");
    const API_URL = "http://localhost:8080/api/users";

    if (!userId) {
      console.error("User ID not found. Sidebar PFP update skipped.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const userData = await response.json();
      if (userData.profilePicture) {
        setProfilePicture(userData.profilePicture);
      }
    } catch (error) {
      console.error("Error fetching sidebar profile picture:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    const userId = localStorage.getItem("loggedInUserID");
    const API_URL = "http://localhost:8080/api/projects";

    if (!userId) {
      console.error("User ID not found. Projects fetch skipped.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const projectsData = await response.json();
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserID");
    localStorage.removeItem("UserFName");
    localStorage.removeItem("UserLName");
    localStorage.removeItem("userToken");
    
    // Redirect to login page
    navigate('/login');
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', String(newCollapsedState));
    
    // Dispatch an event so other components can respond to sidebar change
    window.dispatchEvent(new CustomEvent('sidebarToggled', { 
      detail: { collapsed: newCollapsedState } 
    }));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const addNewProject = () => {
    navigate('/new-project');
  };

  const activeButton = getCurrentActivePage();

  const NavButton = ({ id, icon, text, path }) => (
    <button 
      id={id} 
      className={activeButton === id ? "current-btn" : ""}
      onClick={() => navigate(path)}
      aria-label={text}
    >
      <span className="material-icons-outlined">{icon}</span> 
      {!isCollapsed && <span className="btn-text">{text}</span>}
    </button>
  );

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <button 
        id="sidebar-toggle" 
        className="sidebar-toggle" 
        aria-label="Toggle sidebar" 
        onClick={toggleSidebar}
      >
        <span className="material-icons-outlined toggle-icon">
          {isCollapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>
      
      <div className="user-info">
        <img 
          id="sidebar-pfp" 
          src={profilePicture} 
          alt={`${userName}'s profile`}
          className="profile-pic" 
          onClick={() => navigate('/profile')}
        />
        {!isCollapsed && <p className="user-name">{userName}</p>}
      </div>
      
      <nav className="sidebar-nav">
        <NavButton id="dashboard-btn" icon="dashboard" text="Dashboard" path="/dashboard" />
        <NavButton id="tasks-btn" icon="checklist" text="My Tasks" path="/mytasks" />
        <NavButton id="calendar-btn" icon="event" text="Calendar" path="/calendar" />
        <NavButton id="inbox-btn" icon="mail" text="Inbox" path="/inbox" />
        
        <hr />
        
        <div className="projects-section">
          <div className="projects-header">
            {!isCollapsed && <span className="btn-text">My Projects</span>}
            <button 
              id="add-project" 
              onClick={addNewProject}
              aria-label="Add new project"
            >
              <span className="material-icons-outlined">add</span>
            </button>
          </div>
          
          <div className="projects-list" id="projects-list">
            {isLoading ? (
              <div className="loading-indicator">
                <span className="material-icons-outlined">hourglass_empty</span>
                {!isCollapsed && <span>Loading...</span>}
              </div>
            ) : projects.length > 0 ? (
              projects.map(project => (
                <button 
                  key={project.id}
                  className="project-btn" 
                  onClick={() => handleProjectClick(project.id)}
                  aria-label={`Open ${project.name}`}
                >
                  <span className="material-icons-outlined">folder</span>
                  {!isCollapsed && <span className="btn-text">{project.name}</span>}
                </button>
              ))
            ) : (
              <div className="no-projects">
                <span className="material-icons-outlined">folder_off</span>
                {!isCollapsed && <span>No projects</span>}
              </div>
            )}
          </div>
        </div>
        
        <hr />
        
        <div className="bottom-buttons">
          <NavButton id="profile-btn" icon="person" text="Profile" path="/profile" />
          
          <button id="logout-btn" className="logout-btn" onClick={handleLogout} aria-label="Logout">
            <span className="material-icons-outlined">logout</span>
            {!isCollapsed && <span className="btn-text">Logout</span>}
          </button>
        </div>        
      </nav>
    </div>
  );
};

export default Sidebar;