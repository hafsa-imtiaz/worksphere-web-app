import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, Calendar, FileText, Search, Plus, X, 
  ChevronRight, ChevronDown, MoreHorizontal, Upload, Clock,
  Edit2, Trash2, AlertCircle, CheckCircle, Paperclip, User
} from 'lucide-react';
import './ProjectManagement.css';

export default function ProjectManagement() {
  // State for projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding',
      status: 'In Progress',
      progress: 65,
      dueDate: '2025-06-15',
      teamMembers: [
        { id: 1, name: 'Alex Johnson', avatar: '/avatar1.jpg', role: 'Project Lead' },
        { id: 2, name: 'Sara Williams', avatar: '/avatar2.jpg', role: 'UI Designer' },
        { id: 3, name: 'Marco Chen', avatar: '/avatar3.jpg', role: 'Developer' }
      ],
      tasks: [
        { id: 1, name: 'Wireframing', status: 'Completed', assignee: 'Sara Williams' },
        { id: 2, name: 'UI Design', status: 'Completed', assignee: 'Sara Williams' },
        { id: 3, name: 'Frontend Development', status: 'In Progress', assignee: 'Marco Chen' },
        { id: 4, name: 'Backend Integration', status: 'Not Started', assignee: 'Alex Johnson' },
        { id: 5, name: 'User Testing', status: 'Not Started', assignee: 'Sara Williams' }
      ],
      documents: [
        { id: 1, name: 'Project Brief.pdf', size: '2.4 MB', uploadDate: '2025-03-10' },
        { id: 2, name: 'Wireframes.fig', size: '5.7 MB', uploadDate: '2025-03-22' },
        { id: 3, name: 'Design System.sketch', size: '8.1 MB', uploadDate: '2025-04-05' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Creating a companion app for our main product',
      status: 'Planning',
      progress: 25,
      dueDate: '2025-08-30',
      teamMembers: [
        { id: 1, name: 'Alex Johnson', avatar: '/avatar1.jpg', role: 'Project Manager' },
        { id: 4, name: 'Priya Patel', avatar: '/avatar4.jpg', role: 'Mobile Developer' },
        { id: 5, name: 'David Kim', avatar: '/avatar5.jpg', role: 'UX Researcher' }
      ],
      tasks: [
        { id: 6, name: 'Market Research', status: 'Completed', assignee: 'David Kim' },
        { id: 7, name: 'User Interviews', status: 'In Progress', assignee: 'David Kim' },
        { id: 8, name: 'App Architecture', status: 'In Progress', assignee: 'Priya Patel' },
        { id: 9, name: 'UI Design', status: 'Not Started', assignee: 'Sara Williams' }
      ],
      documents: [
        { id: 4, name: 'Market Research.pdf', size: '3.2 MB', uploadDate: '2025-04-12' },
        { id: 5, name: 'User Personas.pdf', size: '1.8 MB', uploadDate: '2025-04-18' }
      ]
    },
    {
      id: 3,
      name: 'Q3 Marketing Campaign',
      description: 'Digital marketing campaign for Q3 product launch',
      status: 'Not Started',
      progress: 0,
      dueDate: '2025-07-01',
      teamMembers: [
        { id: 6, name: 'Emma Rodriguez', avatar: '/avatar6.jpg', role: 'Marketing Lead' },
        { id: 7, name: 'Jamal Washington', avatar: '/avatar7.jpg', role: 'Content Strategist' }
      ],
      tasks: [
        { id: 10, name: 'Campaign Strategy', status: 'Not Started', assignee: 'Emma Rodriguez' },
        { id: 11, name: 'Content Creation', status: 'Not Started', assignee: 'Jamal Washington' },
        { id: 12, name: 'Asset Production', status: 'Not Started', assignee: 'Sara Williams' }
      ],
      documents: [
        { id: 6, name: 'Campaign Brief.docx', size: '1.5 MB', uploadDate: '2025-04-20' }
      ]
    }
  ]);
  
  // State for active project and modal
  const [activeProject, setActiveProject] = useState(1);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    dueDate: '',
    teamMembers: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get active project data
  const currentProject = projects.find(project => project.id === activeProject);
  
  // Handler for new project form
  const handleNewProjectChange = (field, value) => {
    setNewProjectData({
      ...newProjectData,
      [field]: value
    });
  };
  
  // Handler for creating new project
  const handleCreateProject = () => {
    const newProject = {
      id: projects.length + 1,
      ...newProjectData,
      status: 'Not Started',
      progress: 0,
      tasks: [],
      documents: []
    };
    
    setProjects([...projects, newProject]);
    setIsNewProjectModalOpen(false);
    setNewProjectData({
      name: '',
      description: '',
      dueDate: '',
      teamMembers: []
    });
  };
  
  // Handler for toggling project details
  const handleProjectSelect = (projectId) => {
    setActiveProject(projectId);
    setActiveTab('overview');
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    let className = 'status-badge';
    
    switch(status) {
      case 'Completed':
        className += ' status-completed';
        break;
      case 'In Progress':
        className += ' status-in-progress';
        break;
      case 'Planning':
        className += ' status-planning';
        break;
      default:
        className += ' status-not-started';
    }
    
    return (
      <span className={className}>
        {status}
      </span>
    );
  };

  return (
    <div className="project-management">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <Link to="/" className="logo">WorkSphere</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title">
              <Briefcase className="page-icon" size={28} />
              <h1>Project Management</h1>
            </div>
            <div className="page-actions">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="search-input"
                />
                <Search className="search-icon" size={18} />
              </div>
              <button 
                onClick={() => setIsNewProjectModalOpen(true)}
                className="btn btn-primary new-project-btn"
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Dashboard */}
        <div className="project-dashboard">
          {/* Project List */}
          <div className="project-list">
            <h2 className="section-title">Projects</h2>
            <div className="projects">
              {projects.map(project => (
                <div 
                  key={project.id}
                  onClick={() => handleProjectSelect(project.id)}
                  className={`project-card ${activeProject === project.id ? 'active' : ''}`}
                >
                  <div className="project-card-header">
                    <h3 className={`project-card-title ${activeProject === project.id ? 'active' : ''}`}>
                      {project.name}
                    </h3>
                    {renderStatusBadge(project.status)}
                  </div>
                  <p className="project-card-description">{project.description}</p>
                  <div className="project-card-meta">
                    <div className="project-members">
                      {project.teamMembers.slice(0, 3).map((member, idx) => (
                        <div key={idx} className="member-avatar">
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="member-avatar more-members">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="project-due-date">
                      <Clock size={12} />
                      <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          {currentProject && (
            <div className="project-details">
              {/* Project Header */}
              <div className="project-header">
                <div className="project-header-info">
                  <div className="project-header-title">
                    <h2>{currentProject.name}</h2>
                    <span className="project-header-status">{renderStatusBadge(currentProject.status)}</span>
                  </div>
                  <p className="project-header-description">{currentProject.description}</p>
                </div>
                <div className="project-header-actions">
                  <button className="btn btn-icon btn-edit">
                    <Edit2 size={18} />
                    <span>Edit</span>
                  </button>
                  <button className="btn btn-icon btn-delete">
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Project Stats */}
              <div className="project-stats">
                <div className="stat-card">
                  <div className="stat-label">Progress</div>
                  <div className="stat-value">{currentProject.progress}%</div>
                  <div className="stat-progress-bar">
                    <div
                      className="stat-progress-value"
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Due Date</div>
                  <div className="stat-value">{new Date(currentProject.dueDate).toLocaleDateString()}</div>
                  <div className="stat-info">
                    {new Date(currentProject.dueDate) > new Date() 
                      ? `${Math.ceil((new Date(currentProject.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining` 
                      : 'Overdue'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Team</div>
                  <div className="stat-value">{currentProject.teamMembers.length} Members</div>
                  <div className="stat-members">
                    {currentProject.teamMembers.map((member, idx) => (
                      <div key={idx} className="stat-member-avatar">
                        {member.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Tabs */}
              <div className="tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`tab ${activeTab === 'team' ? 'active' : ''}`}
                >
                  Team
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                >
                  Documents
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="tab-panel">
                    <div className="tab-panel-header">
                      <h3 className="tab-panel-title">Tasks</h3>
                      <button className="btn btn-text btn-add">
                        <Plus size={16} />
                        <span>Add Task</span>
                      </button>
                    </div>
                    <div className="tasks">
                      {currentProject.tasks.map(task => (
                        <div key={task.id} className="task-item">
                          <div className="task-info">
                            {task.status === 'Completed' ? (
                              <CheckCircle className="task-icon completed" size={20} />
                            ) : task.status === 'In Progress' ? (
                              <Clock className="task-icon in-progress" size={20} />
                            ) : (
                              <AlertCircle className="task-icon not-started" size={20} />
                            )}
                            <div className="task-details">
                              <div className="task-name">{task.name}</div>
                              <div className="task-assignee">Assigned to: {task.assignee}</div>
                            </div>
                          </div>
                          <div className="task-status">
                            <span className={`task-status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="tab-panel">
                    <div className="tab-panel-header">
                      <h3 className="tab-panel-title">Team Members</h3>
                      <button className="btn btn-text btn-add">
                        <Plus size={16} />
                        <span>Add Member</span>
                      </button>
                    </div>
                    <div className="team-members">
                      {currentProject.teamMembers.map(member => (
                        <div key={member.id} className="team-member-card">
                          <div className="team-member-info">
                            <div className="team-member-avatar">
                              {member.name.charAt(0)}
                            </div>
                            <div className="team-member-details">
                              <div className="team-member-name">{member.name}</div>
                              <div className="team-member-role">{member.role}</div>
                            </div>
                          </div>
                          <div className="team-member-actions">
                            <button className="btn btn-icon btn-edit-small">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn btn-icon btn-remove-small">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="tab-panel">
                    <div className="tab-panel-header">
                      <h3 className="tab-panel-title">Project Timeline</h3>
                      <button className="btn btn-text btn-add">
                        <Plus size={16} />
                        <span>Add Milestone</span>
                      </button>
                    </div>
                    
                    <div className="timeline">
                      {/* Timeline Items */}
                      <div className="timeline-items">
                        {/* Map ordered tasks as timeline items */}
                        {[...currentProject.tasks].sort((a, b) => {
                          // Sort order: Completed -> In Progress -> Not Started
                          const order = { 'Completed': 0, 'In Progress': 1, 'Not Started': 2 };
                          return order[a.status] - order[b.status];
                        }).map((task, index) => (
                          <div key={task.id} className="timeline-item">
                            <div className={`timeline-marker ${task.status.toLowerCase().replace(' ', '-')}`}>
                              {task.status === 'Completed' ? (
                                <CheckCircle className="timeline-icon" size={16} />
                              ) : task.status === 'In Progress' ? (
                                <Clock className="timeline-icon" size={16} />
                              ) : (
                                <AlertCircle className="timeline-icon" size={16} />
                              )}
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-task-name">{task.name}</div>
                              <div className="timeline-task-assignee">{task.assignee}</div>
                              <div className={`timeline-task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                                {task.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="tab-panel">
                    <div className="tab-panel-header">
                      <h3 className="tab-panel-title">Project Documents</h3>
                      <button className="btn btn-text btn-add">
                        <Upload size={16} />
                        <span>Upload Document</span>
                      </button>
                    </div>
                    
                    <div className="documents">
                      {currentProject.documents.map(doc => (
                        <div key={doc.id} className="document-card">
                          <div className="document-info">
                            <div className="document-icon">
                              <FileText size={20} />
                            </div>
                            <div className="document-details">
                              <div className="document-name">{doc.name}</div>
                              <div className="document-meta">
                                {doc.size} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="document-actions">
                            <button className="btn btn-icon btn-download-small">
                              <Paperclip size={16} />
                            </button>
                            <button className="btn btn-icon btn-delete-small">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {currentProject.documents.length === 0 && (
                        <div className="empty-documents">
                          <FileText className="empty-icon" size={48} />
                          <p className="empty-text">No documents have been uploaded yet</p>
                          <button className="btn btn-text">
                            Upload your first document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          &copy; 2025 WorkSphere. All rights reserved.
        </div>
      </footer>
      
      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Create New Project</h3>
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newProjectData.name}
                  onChange={(e) => handleNewProjectChange('name', e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={newProjectData.description}
                  onChange={(e) => handleNewProjectChange('description', e.target.value)}
                  placeholder="Enter project description"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={newProjectData.dueDate}
                  onChange={(e) => handleNewProjectChange('dueDate', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Team Members
                </label>
                <div className="member-search">
                  <User className="member-search-icon" size={18} />
                  <input
                    type="text"
                    className="member-search-input"
                    placeholder="Search members to add..."
                  />
                </div>
                
                {/* Selected team members would go here */}
                <div className="selected-members">
                  <div className="selected-member">
                    Alex Johnson
                    <button className="remove-member">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="selected-member">
                    Sara Williams
                    <button className="remove-member">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={handleCreateProject}
                  className="btn btn-primary"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}