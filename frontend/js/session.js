document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "/login.html";
            return;
        }

        const data = await response.json();
        if (!data.authenticated || !data.user) {
            window.location.href = "/login.html";
            return;
        }

        if (String(data.user.role || "").toLowerCase() === "admin") {
            window.location.href = "/admin.html";
            return;
        }

        document.querySelectorAll("[data-user-name]").forEach(function (element) {
            element.textContent = data.user.name || "Student";
        });
        document.querySelectorAll("[data-user-role]").forEach(function (element) {
            element.textContent = data.user.role || "Student";
        });
        document.querySelectorAll("[data-user-initial]").forEach(function (element) {
            element.textContent = (data.user.name || "S").trim().charAt(0).toUpperCase();
        });

        const studentName = document.getElementById("studentName");
        if (studentName) {
            studentName.value = data.user.name || "";
            studentName.readOnly = true;
        }

        const studentDepartment = document.getElementById("studentDepartment");
        if (studentDepartment) {
            studentDepartment.value = data.user.department || "";
            studentDepartment.disabled = true;
        }

        const greeting = document.getElementById("userGreeting");
        if (greeting) {
            greeting.textContent = "Welcome, " + (data.user.name || "Student") + " 👋";
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        window.location.href = "/login.html";
    }
});

document.addEventListener("click", async function (event) {
    const logoutLink = event.target.closest(".logout-link");
    if (!logoutLink) {
        return;
    }

    event.preventDefault();
    try {
        const response = await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("The server could not clear the login session.");
        }
    } catch (error) {
        console.error("Logout request failed:", error);
        window.location.href = "/logout";
        return;
    }
    window.location.href = "/login.html";
});
