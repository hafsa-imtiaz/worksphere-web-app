document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem("loggedInUserID") || "";
    const userEmail = localStorage.getItem("loggedInUser") || "";

    if (!userId) {
        console.error("User ID not found. Redirecting to login...");
        window.location.href = "login.html"; // Redirect if no user is logged in
        return;
    }

    const API_URL = "http://localhost:8080/api/users"; 

    // Select input fields
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const dobInput = document.getElementById("dob");
    const genderInput = document.getElementById("gender");
    const saveButton = document.getElementById("save-info");

    // Populate email field from localStorage
    emailInput.value = userEmail;
    emailInput.readOnly = true; // Ensure email is not editable

    // Function to fetch user data and populate fields
    async function fetchUserData() {
        try {
            const response = await fetch(`${API_URL}/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user data");

            const userData = await response.json();
            firstNameInput.value = userData.firstName || "";
            lastNameInput.value = userData.lastName || "";
            dobInput.value = userData.dob || "";
            genderInput.value = userData.gender || "OTHER";
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    // Function to update user data
    async function updateUserData() {
        const updatedData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            dob: dobInput.value,
            gender: genderInput.value,
        };

        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    }

    // Load user data when the page loads
    fetchUserData();

    // Add event listener to save button
    saveButton.addEventListener("click", updateUserData);

    // Add project button functionality
    document.getElementById("add-project").addEventListener("click", function() {
        let projectList = document.getElementById("projects-list");
        let newProject = document.createElement("button");
        newProject.textContent = "New Project";
        projectList.appendChild(newProject);
    });
});
