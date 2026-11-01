document.addEventListener("DOMContentLoaded", function () {
    const rows = document.getElementById("historyRows");
    const message = document.getElementById("historyMessage");
    const exportButton = document.getElementById("exportHistoryButton");
    const totalCount = document.getElementById("historyTotal");
    const pendingCount = document.getElementById("historyPending");
    const resolvedCount = document.getElementById("historyResolved");
    const highPriorityCount = document.getElementById("historyHighPriority");

    function appendCell(row, text, className) {
        const cell = document.createElement("td");
        cell.textContent = text || "—";
        if (className) {
            cell.className = className;
        }
        row.appendChild(cell);
        return cell;
    }

    function renderComplaint(complaint) {
        const row = document.createElement("tr");
        const studentCell = document.createElement("td");
        const student = document.createElement("strong");
        student.className = "history-student-name";
        student.textContent = complaint.student_name || "Unknown student";
        studentCell.appendChild(student);
        row.appendChild(studentCell);

        appendCell(row, complaint.department);

        const titleCell = document.createElement("td");
        const title = document.createElement("div");
        title.className = "table-title";
        const complaintTitle = document.createElement("strong");
        complaintTitle.textContent = complaint.title || "Untitled complaint";
        const category = document.createElement("small");
        category.textContent = complaint.category || "Uncategorized";
        title.append(complaintTitle, category);
        if (complaint.input_type && complaint.input_type !== "text") {
            const inputType = document.createElement("small");
            inputType.textContent = "Input: " + complaint.input_type.replace("_", " + ");
            title.appendChild(inputType);
        }
        titleCell.appendChild(title);
        row.appendChild(titleCell);

        appendCell(row, complaint.summary || complaint.description);
        appendCell(row, complaint.location);

        const evidenceCell = document.createElement("td");
        if (complaint.evidence && complaint.evidence.url) {
            const evidenceLink = document.createElement("a");
            evidenceLink.href = complaint.evidence.url;
            evidenceLink.target = "_blank";
            evidenceLink.rel = "noopener noreferrer";
            evidenceLink.textContent = "View image";
            evidenceCell.appendChild(evidenceLink);

            if (complaint.ocr_text) {
                const ocrDetails = document.createElement("details");
                const ocrSummary = document.createElement("summary");
                const ocrContent = document.createElement("p");
                ocrSummary.textContent = "OCR text";
                ocrContent.textContent = complaint.ocr_text;
                ocrDetails.append(ocrSummary, ocrContent);
                evidenceCell.appendChild(ocrDetails);
            }
        } else {
            evidenceCell.textContent = "—";
        }
        row.appendChild(evidenceCell);

        let submittedAt = "—";
        if (complaint.created_at) {
            const date = new Date(complaint.created_at);
            if (!Number.isNaN(date.getTime())) {
                submittedAt = new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short"
                }).format(date);
            }
        }
        appendCell(row, submittedAt);

        const status = document.createElement("span");
        const normalizedStatus = (complaint.status || "Pending").toLowerCase();
        status.className = "status-badge " +
            (normalizedStatus === "resolved" ? "resolved" :
                normalizedStatus === "in progress" ? "progress" : "pending");
        status.textContent = complaint.status || "Pending";
        const statusCell = document.createElement("td");
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        const priorityCell = document.createElement("td");
        const priority = document.createElement("span");
        const normalizedPriority = (complaint.priority || "low").toLowerCase();
        priority.className = "priority-pill " +
            (["high", "medium", "low"].includes(normalizedPriority) ? normalizedPriority : "low");
        priority.textContent = complaint.priority || "Not set";
        priorityCell.appendChild(priority);
        row.appendChild(priorityCell);

        rows.appendChild(row);
    }

    async function loadHistory() {
        try {
            const response = await fetch("/api/complaints", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.status === 401) {
                window.location.href = "/login.html";
                return;
            }
            if (!response.ok) {
                throw new Error(data.error || "Unable to load complaint history.");
            }
            if (!data.success || !Array.isArray(data.complaints)) {
                throw new Error("The complaint history response was invalid.");
            }

            const complaints = data.complaints;
            rows.replaceChildren();
            complaints.forEach(renderComplaint);
            totalCount.textContent = String(complaints.length);
            pendingCount.textContent = String(complaints.filter(function (item) {
                return (item.status || "Pending").toLowerCase() === "pending";
            }).length);
            resolvedCount.textContent = String(complaints.filter(function (item) {
                return (item.status || "").toLowerCase() === "resolved";
            }).length);
            highPriorityCount.textContent = String(complaints.filter(function (item) {
                return (item.priority || "").toLowerCase() === "high";
            }).length);
            message.textContent = complaints.length
                ? complaints.length + " of your complaint" + (complaints.length === 1 ? "" : "s") + " loaded."
                : "You have not submitted any complaints yet.";
            exportButton.disabled = complaints.length === 0;
        } catch (error) {
            console.error("Complaint history could not be loaded:", error);
            rows.replaceChildren();
            totalCount.textContent = "—";
            pendingCount.textContent = "—";
            resolvedCount.textContent = "—";
            highPriorityCount.textContent = "—";
            message.textContent = error.message +
                " Make sure the Flask API and MongoDB are running.";
            exportButton.disabled = true;
        }
    }

    exportButton.addEventListener("click", async function () {
        exportButton.disabled = true;
        try {
            const response = await fetch("/api/complaints/export.xlsx", {
                credentials: "include"
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Unable to export complaint history.");
            }
            const file = await response.blob();
            const downloadUrl = URL.createObjectURL(file);
            const downloadLink = document.createElement("a");
            downloadLink.href = downloadUrl;
            downloadLink.download = "student-complaint-history.xlsx";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Complaint history export failed:", error);
            message.textContent = error.message;
        } finally {
            exportButton.disabled = false;
        }
    });

    loadHistory();
});
