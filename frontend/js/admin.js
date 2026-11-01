document.addEventListener("DOMContentLoaded", async function () {
    const user = await checkAdmin();
    if (!user) {
        return;
    }

    const adminName = document.getElementById("adminName");
    if (adminName) {
        adminName.textContent = user.name || "Admin";
    }

    const adminGreeting = document.getElementById("adminGreeting");
    if (adminGreeting) {
        adminGreeting.textContent = "Welcome, " + (user.name || "Admin") + " 👋";
    }

    const adminInitial = document.getElementById("adminInitial");
    if (adminInitial) {
        adminInitial.textContent = (user.name || "A").trim().charAt(0).toUpperCase();
    }

    await loadStatistics();
    await loadAdminComplaints();
});

async function checkAdmin() {
    try {
        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "login.html";
            return null;
        }

        const data = await response.json();
        const userRole = data.user && typeof data.user.role === "string" ? data.user.role.toLowerCase() : "";
        if (!data.authenticated || !data.user || userRole !== "admin") {
            window.location.href = "dashboard.html";
            return null;
        }

        return data.user;
    } catch (error) {
        console.error("Admin auth check failed:", error);
        window.location.href = "login.html";
        return null;
    }
}

async function loadStatistics() {
    try {
        const response = await fetch("/api/admin/dashboard", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(data.error || "Unable to load admin statistics.");
            return;
        }

        const stats = data.statistics || {};
        document.getElementById("totalComplaints").textContent = stats.total ?? 0;
        document.getElementById("pendingComplaints").textContent = stats.pending ?? 0;
        document.getElementById("progressComplaints").textContent = stats.in_progress ?? 0;
        document.getElementById("resolvedComplaints").textContent = stats.resolved ?? 0;
        document.getElementById("highPriority").textContent = stats.high_priority ?? 0;
        document.getElementById("criticalPriority").textContent = stats.critical_priority ?? 0;
        const resolutionValue = Number(stats.average_resolution_hours ?? 0);
        document.getElementById("averageResolution").textContent = resolutionValue ? resolutionValue + "h" : "0h";
    } catch (error) {
        console.error("Statistics loading error:", error);
    }
}

async function loadAdminComplaints() {
    try {
        const response = await fetch("/api/admin/complaints", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(data.error || "Unable to load complaints.");
            return;
        }

        displayAdminComplaints(data.complaints || []);
    } catch (error) {
        console.error("Complaint loading error:", error);
    }
}

function displayAdminComplaints(complaints) {
    const table = document.getElementById("complaintsTable");
    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!complaints.length) {
        table.innerHTML = "<tr><td colspan='7'>No complaints found.</td></tr>";
        return;
    }

    complaints.forEach(function (complaint) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeHtml(complaint.student_name || "Unknown")}</strong>
                <small>${escapeHtml(complaint.student_email || "")}</small>
            </td>
            <td>
                <strong>${escapeHtml(complaint.title || "Untitled")}</strong>
                <p>${escapeHtml(complaint.summary || complaint.description || "")}</p>
                ${complaint.evidence && complaint.evidence.url ? `<a href="${escapeHtml(complaint.evidence.url)}" target="_blank" rel="noopener noreferrer">View evidence</a>` : ""}
                <div class="ai-info">
                    <small>AI: ${escapeHtml(complaint.category || "General")} • ${escapeHtml(complaint.priority || "Low")} • ${escapeHtml(complaint.sentiment || "Normal")} • Input: ${escapeHtml(complaint.input_type || "text")}</small>
                </div>
            </td>
            <td>${escapeHtml(complaint.category || "Other")}</td>
            <td><span class="priority">${escapeHtml(complaint.priority || "Low")}</span></td>
            <td>
                <select onchange="updateComplaint('${complaint.id}', this.value, null)">
                    <option value="IT Department" ${complaint.department === "IT Department" ? "selected" : ""}>IT Department</option>
                    <option value="Hostel" ${complaint.department === "Hostel" ? "selected" : ""}>Hostel</option>
                    <option value="Library" ${complaint.department === "Library" ? "selected" : ""}>Library</option>
                    <option value="Examination" ${complaint.department === "Examination" ? "selected" : ""}>Examination</option>
                    <option value="Administration" ${complaint.department === "Administration" ? "selected" : ""}>Administration</option>
                </select>
            </td>
            <td>
                <select onchange="updateComplaint('${complaint.id}', null, this.value)">
                    <option value="Pending" ${complaint.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="In Progress" ${complaint.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Resolved" ${complaint.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </td>
            <td>
                <button type="button" onclick="viewComplaint('${complaint.id}')">View</button>
            </td>
        `;

        table.appendChild(row);
    });
}

async function updateComplaint(complaintId, department, status) {
    const update = {};
    if (department) update.department = department;
    if (status) update.status = status;

    try {
        const response = await fetch(`/api/admin/complaints/${complaintId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update)
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.error || "Update failed.");
            return;
        }

        await loadStatistics();
        await loadAdminComplaints();
    } catch (error) {
        console.error("Complaint update failed:", error);
        alert("Unable to update complaint.");
    }
}

function viewComplaint(complaintId) {
    alert("Complaint ID: " + complaintId);
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
