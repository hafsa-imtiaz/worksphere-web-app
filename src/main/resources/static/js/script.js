document.addEventListener("DOMContentLoaded", function() {
    setUpUserName();
    setupSidebarProfilePicture();

    setupDashboardButton();
    setupTasksButton();
    setupCalendarButton();
    setupInboxButton();
    setupProfileButton();
    setupLogoutButton();
    
    // Setup projects functionality
    setupExistingProjectButtons();
    setupAddProjectButton();

    // Menu toggle functionality
    sidebartoggling();
});

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function setUpUserName(){
    let firstName = localStorage.getItem("UserFName") || "";
    let lastName = localStorage.getItem("UserLName") || "";

    firstName = capitalize(firstName);
    lastName = capitalize(lastName);

    let fullName = firstName + " " + lastName;
    let naam = document.querySelector(".user-name"); 
    if (naam) {
        naam.textContent = fullName; 
    }
}

async function setupSidebarProfilePicture() {
    const userId = localStorage.getItem("loggedInUserID") || "";
    const API_URL = "http://localhost:8080/api/users";
    const sidebarPfp = document.getElementById("sidebar-pfp");

    if (!userId) {
        console.error("User ID not found. Sidebar PFP update skipped.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        const profilePicPath = userData.profilePicture; // Assuming this field stores the image path

        sidebarPfp.src = profilePicPath ? profilePicPath : "./images/default-pfp.jpg"; // Update profile picture
    } catch (error) {
        console.error("Error fetching sidebar profile picture:", error);
        sidebarPfp.src = "./images/default-pfp.jpg"; // Fallback to default on error
    }
}


function setupDashboardButton() {
    const dashboardBtn = document.getElementById("dashboard-btn");
    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", function() {
            window.location.href = "dashboard.html";
        });
    }
}

/**
 * Sets up the My Tasks button
 */
function setupTasksButton() {
    const tasksBtn = document.getElementById("tasks-btn");
    if (tasksBtn) {
        tasksBtn.addEventListener("click", function() {
            window.location.href = "mytasks.html";
        });
    }
}

/**
 * Sets up the Calendar button
 */
function setupCalendarButton() {
    const calendarBtn = document.getElementById("calendar-btn");
    if (calendarBtn) {
        calendarBtn.addEventListener("click", function() {
            window.location.href = "calendar.html";
        });
    }
}

/**
 * Sets up the Inbox button
 */
function setupInboxButton() {
    const inboxBtn = document.getElementById("inbox-btn");
    if (inboxBtn) {
        inboxBtn.addEventListener("click", function() {
            window.location.href = "inbox.html";
        });
    }
}

/**
 * Sets up the Profile button
 */
function setupProfileButton() {
    const profileBtn = document.getElementById("profile-btn");
    const pfpBtn = document.getElementById("sidebar-pfp");
    if (profileBtn) {
        profileBtn.addEventListener("click", function() {
            window.location.href = "profile.html";
        });
    }
    if (pfpBtn) {
        pfpBtn.addEventListener("click", function() {
            window.location.href = "profile.html";
        });
    }
}

/**
 * Sets up the Logout button
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }
}

/**
 * Sets up click handlers for all existing project buttons
 */
function setupExistingProjectButtons() {
    const projectButtons = document.querySelectorAll(".project-btn");
    
    projectButtons.forEach((button) => {
        button.addEventListener("click", function() {
            const projectId = button.getAttribute("data-project-id");
            window.location.href = `project.html?id=${projectId}`;
        });
    });
}

/**
 * Sets up the add project button functionality
 */
function setupAddProjectButton() {
    const addButton = document.getElementById("add-project");
    if (addButton) {
        addButton.addEventListener("click", function() {
            addNewProject();
        });
    }
}

/**
 * Adds a new project button to the projects list
 */
function addNewProject() {
    const projectList = document.getElementById("projects-list");
    if (projectList) {
        const projectButtons = projectList.querySelectorAll(".project-btn");
        const newProjectId = projectButtons.length + 1;
        
        const newProject = document.createElement("button");
        newProject.textContent = "New Project";
        newProject.className = "project-btn";
        newProject.setAttribute("data-project-id", newProjectId);
        
        newProject.addEventListener("click", function() {
            window.location.href = `project.html?id=${newProjectId}`;
        });
        
        projectList.appendChild(newProject);
    }
}


function sidebartoggling() {
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar"); 
    const container = document.querySelector(".container");

    menuToggle.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        container.classList.toggle("expanded");
        if (sidebar.classList.contains("active")) {
            menuToggle.classList.add("open");
        } else {
            menuToggle.classList.remove("open");
        }
    });
}