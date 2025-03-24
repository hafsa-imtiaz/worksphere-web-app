document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("loggedInUser");
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!loginForm || !emailInput || !passwordInput) {
        console.error("Form or input fields not found! Check HTML IDs.");
        return;
    }

    // Function to create a toast notification
    function showToast(message, type) {
        const toastContainer = document.getElementById("toast-container") || createToastContainer();
        const toast = document.createElement("div");
        toast.classList.add("toast", type);
        toast.setAttribute("role", "alert");

        // Toast icon
        const icon = document.createElement("span");
        icon.classList.add("toast-icon");
        icon.innerHTML = type === "success" ? "✔️" : "❌";

        // Message container
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("toast-message");
        messageContainer.textContent = message;

        // Close button
        const closeButton = document.createElement("button");
        closeButton.classList.add("toast-close");
        closeButton.innerHTML = "&times;";
        closeButton.setAttribute("aria-label", "Close notification");
        closeButton.addEventListener("click", () => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        });

        // Append elements
        toast.appendChild(icon);
        toast.appendChild(messageContainer);
        toast.appendChild(closeButton);
        toastContainer.appendChild(toast);

        // Show the toast
        setTimeout(() => toast.classList.add("show"), 50);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Function to create toast container if it doesn't exist
    function createToastContainer() {
        const container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
        return container;
    }

    // Handle form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showToast("Please fill in all fields.", "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json(); 
                console.log(user);
                localStorage.setItem("loggedInUser", user.email);
                localStorage.setItem("UserFName", user.firstName);
                localStorage.setItem("UserLName", user.lastName);
                localStorage.setItem("loggedInUserID", user.id);
                form.reset();
                showToast("Login successful! Redirecting...", "success");

                setTimeout(() => {
                    window.location.href = user.userType === "ADMIN" ? "AdminPanel.html" : "../dashboard.html";
                }, 2000);
            } else {
                const errorData = await response.json();
                console.log(errorData);
                showToast("Log-In failed. " + errorData.error + "Please try again.", 'error');
            }
        } catch (error) {
            console.error(error);
            showToast("Server error. Please try again later.", "error");
        }
    });
});
