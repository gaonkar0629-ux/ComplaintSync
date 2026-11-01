document.addEventListener("DOMContentLoaded", function () {
    loadNotifications();
});

async function loadNotifications() {
    try {
        const response = await fetch("/api/notifications", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/login.html";
                return;
            }
            throw new Error(data.error || data.message || "Unable to load notifications.");
        }

        displayNotifications(data.notifications || []);
    } catch (error) {
        console.error("Notification loading error:", error);
        const container = document.getElementById("notificationsContainer");
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Notifications</h3>
                    <p>Unable to load notifications right now.</p>
                </div>
            `;
        }
    }
}

function displayNotifications(notifications) {
    const container = document.getElementById("notificationsContainer");
    if (!container) {
        return;
    }

    if (!notifications.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Notifications</h3>
                <p>You don't have any notifications yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(function (notification) {
        const unreadClass = notification.is_read ? "" : "unread";
        const badge = notification.type === "status" ? "Status" : notification.type === "department" ? "Department" : "Update";
        const createdAt = notification.created_at ? new Date(notification.created_at).toLocaleString() : "Just now";

        return `
            <div class="notification-item ${unreadClass}" onclick="markAsRead('${notification.id}')">
                <div class="notification-icon ${notification.type === "status" ? "blue" : notification.type === "department" ? "orange" : "green"}">🔔</div>
                <div class="notification-content">
                    <div class="notification-topline">
                        <strong>${escapeHtml(notification.title)}</strong>
                        <span>${escapeHtml(createdAt)}</span>
                    </div>
                    <p>${escapeHtml(notification.message)}</p>
                </div>
                <span class="notification-badge ${notification.type === "department" ? "warning" : "success"}">${badge}</span>
            </div>
        `;
    }).join("");
}

async function markAsRead(notificationId) {
    try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: "PATCH",
            credentials: "include"
        });
        if (response.ok) {
            loadNotifications();
        }
    } catch (error) {
        console.error("Unable to mark notification as read:", error);
    }
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
