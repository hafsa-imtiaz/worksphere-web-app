document.addEventListener("DOMContentLoaded", () => {  
    const loginForm = document.getElementById("login-form"); 
    const emailInput = document.getElementById("loginEmail"); 
    const passwordInput = document.getElementById("loginPassword"); 

    if (!loginForm || !emailInput || !passwordInput) {
        console.error("Form or input fields not found! Check HTML ids.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.text(); 

            if (response.ok) {
                alert("Login successful! " + data); 
                window.location.href = "dashboard.html"; 
            } else {
                alert("Login failed: " + data);
            }
        } catch (error) {
            console.error(error);
            alert("Server error. Please try again later.");
        }
    });
});
