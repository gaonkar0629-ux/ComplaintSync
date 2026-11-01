document.addEventListener("DOMContentLoaded", function () {
    const chat = document.getElementById("chatMessages");
    const input = document.getElementById("chatInput");
    const sendButton = document.getElementById("chatSendBtn");

    if (!chat || !input || !sendButton) {
        return;
    }

    async function sendMessage() {
        const message = input.value.trim();
        if (!message || sendButton.disabled) {
            return;
        }

        appendMessage("user", message);
        input.value = "";
        sendButton.disabled = true;
        const typing = appendMessage("ai", "Analyzing your complaint...");

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();
            typing.remove();

            if (response.status === 401) {
                window.location.href = "/login.html";
                return;
            }
            if (!response.ok) {
                throw new Error(data.message || "Unable to analyze your complaint.");
            }

            appendMessage("ai", data.reply);
            appendAnalysis(data.analysis, message);
        } catch (error) {
            typing.remove();
            appendMessage("ai", error.message || "Unable to connect to the AI service.");
        } finally {
            sendButton.disabled = false;
            input.focus();
        }
    }

    function appendMessage(sender, message) {
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble " + sender;
        bubble.textContent = message;
        chat.appendChild(bubble);
        chat.scrollTop = chat.scrollHeight;
        return bubble;
    }

    function appendAnalysis(analysis, complaintText) {
        const card = document.createElement("div");
        card.className = "chatbot-analysis-card";

        const heading = document.createElement("h3");
        heading.textContent = "AI Analysis";
        card.appendChild(heading);

        [
            ["Category", analysis.category],
            ["Category confidence", Math.round(analysis.category_confidence * 100) + "%"],
            ["Priority", analysis.priority],
            ["Priority confidence", Math.round(analysis.priority_confidence * 100) + "%"],
            ["Department", analysis.department]
        ].forEach(function (item) {
            const row = document.createElement("p");
            const label = document.createElement("span");
            const value = document.createElement("strong");
            label.textContent = item[0];
            value.textContent = item[1];
            row.append(label, value);
            card.appendChild(row);
        });

        const location = document.createElement("input");
        location.type = "text";
        location.maxLength = 200;
        location.placeholder = "Enter the exact location (required)";
        location.setAttribute("aria-label", "Complaint location");
        card.appendChild(location);

        const actions = document.createElement("div");
        actions.className = "chatbot-analysis-actions";

        const submit = document.createElement("button");
        submit.type = "button";
        submit.className = "chatbot-submit";
        submit.textContent = "Submit Complaint";
        submit.addEventListener("click", function () {
            submitComplaint(location.value, complaintText, submit);
        });

        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "chatbot-cancel";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", function () {
            card.remove();
            appendMessage("ai", "Submission cancelled. Describe another problem whenever you are ready.");
        });

        actions.append(submit, cancel);
        card.appendChild(actions);
        chat.appendChild(card);
        chat.scrollTop = chat.scrollHeight;
    }

    async function submitComplaint(location, complaintText, button) {
        if (!complaintText) {
            appendMessage("ai", "Please describe your complaint again before submitting.");
            return;
        }
        if (!location.trim()) {
            appendMessage("ai", "Please enter the location of the problem before submitting.");
            return;
        }

        button.disabled = true;
        try {
            const response = await fetch("/api/complaints", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: createComplaintTitle(complaintText),
                    description: complaintText,
                    location: location.trim()
                })
            });
            const data = await response.json();

            if (response.status === 401) {
                window.location.href = "/login.html";
                return;
            }
            if (!response.ok) {
                throw new Error(data.message || data.error || "Complaint submission failed.");
            }

            appendMessage("ai", "Your complaint was submitted successfully. Ticket #" + data.complaint_id + ".");
            button.closest(".chatbot-analysis-card").remove();
        } catch (error) {
            appendMessage("ai", error.message || "Unable to submit your complaint.");
            button.disabled = false;
        }
    }

    function createComplaintTitle(text) {
        const words = text.trim().split(/\s+/);
        return words.length <= 8 ? text.trim() : words.slice(0, 8).join(" ") + "...";
    }

    sendButton.addEventListener("click", sendMessage);
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
