document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("loggedInUser");

    // Toast Notification Function
    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        // Add icon to the toast (success or error)
        const icon = document.createElement('span');
        icon.classList.add('toast-icon');
        icon.innerHTML = type === 'success' ? '&#10003;' : '&#10060;'; // Checkmark for success, Cross for error

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('toast-message');
        messageContainer.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.classList.add('toast-close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        });

        toast.appendChild(icon);
        toast.appendChild(messageContainer);
        toast.appendChild(closeButton);
        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        // Remove the toast after 4 seconds if not manually closed
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    document.getElementById("signup-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        const form = event.target;

        // Collect user data from form inputs
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value.toUpperCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Confirm Password Validation
        if (password !== confirmPassword) {
            showToast("Passwords do not match! Please try again.", 'error');
            return;
        }

        // Prepare user data object
        const userData = { firstName, lastName, email, dob, gender, password };

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
                showToast("Signup successful! Redirecting to login page...", 'success');
                form.reset();
                setTimeout(() => window.location.href = "../login.html", 2000);
            } else {
                const errorData = await response.text();
                showToast("Signup failed: " + errorData, 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Server error. Please try again later.", 'error');
        }
    });
});
