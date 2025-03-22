document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signup-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect user data from form inputs
        const userData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            dob: document.getElementById("dob").value, // Ensure it's in YYYY-MM-DD format
            gender: document.getElementById("gender").value.toUpperCase(), // Convert to uppercase for ENUM
        };

        try {
            // Send POST request to the backend
            const response = await fetch("http://localhost:8080/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            // Handle response
            if (response.ok) {
                alert("Signup successful! Please log in.");
                window.location.href = "login.html"; // Redirect to login page
            } else {
                const errorData = await response.text(); // Read error message from backend
                alert("Signup failed: " + errorData);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Please try again later.");
        }
    });
});
