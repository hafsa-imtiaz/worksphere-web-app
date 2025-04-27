import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  const [userName, setUserName] = useState('John Doe');
  const [profilePicture, setProfilePicture] = useState('./images/my-pfp.jpg');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setUpUserName();
    setupSidebarProfilePicture();
    fetchUserProjects();
  }, []);

  const getCurrentActivePage = () => {
    const path = location.pathname;
    
    if (path.includes('/project/')) return 'project';
    
    const sidebarRoutes = {
      "/dashboard": "dashboard-btn",
      "/mytasks": "tasks-btn",
      "/calendar": "calendar-btn",
      "/inbox": "inbox-btn",
      "/profile": "profile-btn",
      "/new-project": "add-project"
    };

    return sidebarRoutes[path] || "";
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
      setError("Failed to load profile picture");
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
      setError("Failed to load projects");
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
      className={`${styles.navButton} ${activeButton === id ? styles.active : ''}`}
      onClick={() => navigate(path)}
      aria-label={text}
    >
      <span className={styles.icon}>{icon}</span> 
      {!isCollapsed && <span className={styles.btnText}>{text}</span>}
    </button>
  );

  return (
    <aside 
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      data-state={isCollapsed ? 'collapsed' : 'expanded'}
    >
      <div className={styles.toggleWrapper}>
        <button 
          className={styles.sidebarToggle} 
          aria-label="Toggle sidebar" 
          onClick={toggleSidebar}
        >
          <span className={styles.toggleIcon}>
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>
      
      <div className={styles.userInfo}>
        <div className={styles.profileImageWrapper}>
          <img 
            src={profilePicture} 
            alt={`${userName}'s profile`}
            className={styles.profilePic} 
            onClick={() => navigate('/profile')}
          />
        </div>
        {!isCollapsed && <p className={styles.userName}>{userName}</p>}
      </div>
      
      <nav className={styles.sidebarNav}>
        <div className={styles.navSection}>
          <NavButton id="dashboard-btn" icon="dashboard" text="Dashboard" path="/dashboard" />
          <NavButton id="tasks-btn" icon="checklist" text="My Tasks" path="/mytasks" />
          <NavButton id="calendar-btn" icon="event" text="Calendar" path="/calendar" />
          <NavButton id="inbox-btn" icon="mail" text="Inbox" path="/inbox" />
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.projectsSection}>
          <div className={styles.projectsHeader}>
            {!isCollapsed && <span className={styles.sectionTitle}>My Projects</span>}
            <button 
              id="add-project" 
              className={`${styles.addButton} ${activeButton === 'add-project' ? styles.active : ''}`}
              onClick={addNewProject}
              aria-label="Add new project"
            >
              <span className={styles.icon}>add</span>
            </button>
          </div>
          
          <div className={styles.projectsList}>
            {isLoading ? (
              <div className={styles.loadingIndicator}>
                <span className={styles.icon}>hourglass_empty</span>
                {!isCollapsed && <span>Loading...</span>}
              </div>
            ) : error ? (
              <div className={styles.errorMessage}>
                <span className={styles.icon}>error</span>
                {!isCollapsed && <span>{error}</span>}
              </div>
            ) : projects.length > 0 ? (
              projects.map(project => (
                <button 
                  key={project.id}
                  className={`${styles.projectButton} ${location.pathname === `/project/${project.id}` ? styles.active : ''}`}
                  onClick={() => handleProjectClick(project.id)}
                  aria-label={`Open ${project.name}`}
                >
                  <span className={styles.icon}>folder</span>
                  {!isCollapsed && (
                    <span className={styles.btnText} title={project.name}>
                      {project.name}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className={styles.noProjects}>
                <span className={styles.icon}>folder_off</span>
                {!isCollapsed && <span>No projects</span>}
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bottomSection}>
          <NavButton id="profile-btn" icon="person" text="Profile" path="/profile" />
          
          <button 
            className={styles.logoutButton} 
            onClick={handleLogout} 
            aria-label="Logout"
          >
            <span className={styles.icon}>logout</span>
            {!isCollapsed && <span className={styles.btnText}>Logout</span>}
          </button>
        </div>        
      </nav>
    </aside>
  );
};

export default Sidebar;