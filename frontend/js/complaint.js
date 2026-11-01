/* =====================================================
   COMPLAINT JAVASCRIPT
===================================================== */

function translateComplaintText(text) {
    return window.smartGrievanceTranslate
        ? window.smartGrievanceTranslate(text)
        : text;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("complaintForm");
    const uploadArea = document.getElementById("uploadArea");
    const imageInput = document.getElementById("complaintImage");
    const imagePreview = document.getElementById("imagePreview");
    const cameraButton = document.getElementById("cameraButton");
    const cameraModal = document.getElementById("cameraModal");
    const cameraPreview = document.getElementById("cameraPreview");
    const cameraCanvas = document.getElementById("cameraCanvas");
    const capturePhotoButton = document.getElementById("capturePhotoButton");
    const closeCameraButton = document.getElementById("closeCameraButton");
    const voiceButton = document.getElementById("voiceButton");
    const voiceLanguage = document.getElementById("voiceLanguage");
    const voiceStatus = document.getElementById("voiceStatus");
    const inputType = document.getElementById("inputType");
    let recognition = null;
    const complaintTitle = document.getElementById("complaintTitle");
    const complaintDescription = document.getElementById("complaintDescription");
    const locationInput = document.getElementById("location");
    const categoryInput = document.getElementById("category");
    const submitButton = form && form.querySelector('[type="submit"]');
    const submitButtonLabel = submitButton ? submitButton.textContent.trim() : "";
    const charCounter = document.getElementById("charCounter");
    const templateButtons = document.querySelectorAll(".template-chip");
    const assistantPrompt = document.getElementById("assistantPrompt");
    const assistantSend = document.getElementById("assistantSend");
    const assistantActions = document.querySelectorAll(".assistant-action");
    const assistantChat = document.getElementById("assistantChat");

    const translatedTemplates = {
        hi: {
            WiFi: {
                title: "कंप्यूटर लैब में वाई-फ़ाई काम नहीं कर रहा",
                description: "कंप्यूटर लैब का वाई-फ़ाई बहुत धीमा है और बार-बार डिस्कनेक्ट हो रहा है। यह जरूरी है और हमारी पढ़ाई को प्रभावित कर रहा है।"
            },
            Library: {
                title: "पुस्तकालय के कंप्यूटर में समस्या",
                description: "परीक्षा की तैयारी के दौरान पुस्तकालय के कंप्यूटर अटक रहे हैं और प्रिंटर काम नहीं कर रहे। छात्र अपना असाइनमेंट पूरा नहीं कर पा रहे हैं।"
            },
            Hostel: {
                title: "छात्रावास में पानी की आपूर्ति की समस्या",
                description: "पिछले दो घंटों से छात्रावास के पानी के पंप काम नहीं कर रहे हैं। छात्रों को पीने और सफाई के लिए पानी नहीं मिल पा रहा है।"
            }
        },
        mr: {
            WiFi: {
                title: "संगणक प्रयोगशाळेत वाय-फाय चालत नाही",
                description: "संगणक प्रयोगशाळेतील वाय-फाय खूप धीमे असून वारंवार खंडित होत आहे. ही तातडीची समस्या आमच्या अभ्यासावर परिणाम करत आहे."
            },
            Library: {
                title: "ग्रंथालयातील संगणकाची समस्या",
                description: "परीक्षेच्या तयारीदरम्यान ग्रंथालयातील संगणक अडकत आहेत आणि प्रिंटर प्रतिसाद देत नाहीत. विद्यार्थ्यांना असाइनमेंट पूर्ण करता येत नाहीत."
            },
            Hostel: {
                title: "वसतिगृहातील पाणीपुरवठ्याची समस्या",
                description: "गेल्या दोन तासांपासून वसतिगृहातील पाण्याचे पंप बंद आहेत. विद्यार्थ्यांना पिण्यासाठी आणि स्वच्छतेसाठी पाणी मिळत नाही."
            }
        }
    };

    if (assistantActions.length) {
        assistantActions.forEach(function (button) {
            button.addEventListener("click", function () {
                const action = button.dataset.action;
                const promptText = buildAssistantPrompt(action, complaintTitle, complaintDescription, locationInput, categoryInput);
                if (promptText) {
                    addAssistantMessage(promptText, "user");
                    addAssistantMessage(generateAssistantReply(action, complaintTitle, complaintDescription, locationInput, categoryInput), "ai");
                }
            });
        });
    }

    if (assistantSend && assistantPrompt) {
        assistantSend.addEventListener("click", function () {
            const message = assistantPrompt.value.trim();
            if (!message) {
                showToast("Type a question for the AI assistant.");
                return;
            }
            addAssistantMessage(message, "user");
            assistantPrompt.value = "";
            addAssistantMessage(generateAssistantReplyFromPrompt(message, complaintTitle, complaintDescription, locationInput, categoryInput), "ai");
        });

        assistantPrompt.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                assistantSend.click();
            }
        });
    }

    if (templateButtons.length) {
        templateButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const language = document.documentElement.lang;
                const localizedTemplate = translatedTemplates[language] &&
                    translatedTemplates[language][button.dataset.category];
                if (complaintTitle) {
                    complaintTitle.value = localizedTemplate
                        ? localizedTemplate.title
                        : button.dataset.title || "";
                }
                if (complaintDescription) {
                    complaintDescription.value = localizedTemplate
                        ? localizedTemplate.description
                        : button.dataset.description || "";
                }
                if (locationInput) locationInput.value = button.dataset.location || "Select location";
                if (categoryInput) categoryInput.value = button.dataset.category || "Let AI decide";
                updateCharCounter(complaintDescription, charCounter);
                analyzeComplaint({
                    title: complaintTitle ? complaintTitle.value.trim() : "",
                    description: complaintDescription ? complaintDescription.value.trim() : "",
                    location: locationInput ? locationInput.value : "",
                    category: categoryInput ? categoryInput.value : "Let AI decide"
                });
            });
        });
    }

    if (complaintDescription && charCounter) {
        updateCharCounter(complaintDescription, charCounter);
        complaintDescription.addEventListener("input", function () {
            updateCharCounter(complaintDescription, charCounter);
        });
    }

    if (uploadArea && imageInput) {
        uploadArea.addEventListener("click", function () {
            imageInput.click();
        });

        ["dragenter", "dragover"].forEach(function (eventName) {
            uploadArea.addEventListener(eventName, function (event) {
                event.preventDefault();
                uploadArea.classList.add("has-file");
            });
        });

        ["dragleave", "drop"].forEach(function (eventName) {
            uploadArea.addEventListener(eventName, function (event) {
                event.preventDefault();
                uploadArea.classList.remove("has-file");
            });
        });

        uploadArea.addEventListener("drop", function (event) {
            const file = event.dataTransfer && event.dataTransfer.files[0];
            if (file) {
                setEvidenceFile(file);
            }
        });

        imageInput.addEventListener("change", function () {
            const file = imageInput.files[0];
            if (file) {
                if (!handleFileSelection(file)) {
                    imageInput.value = "";
                }
            } else {
                clearEvidencePreview();
            }
        });
    }

    function setEvidenceFile(file) {
        if (!handleFileSelection(file)) {
            imageInput.value = "";
            return;
        }

        const transfer = new DataTransfer();
        transfer.items.add(file);
        imageInput.files = transfer.files;
    }

    function clearEvidencePreview() {
        if (imagePreview) {
            imagePreview.replaceChildren();
            imagePreview.hidden = true;
        }
        if (uploadArea) {
            uploadArea.classList.remove("has-file");
            uploadArea.style.backgroundImage = "";
            const title = uploadArea.querySelector("strong");
            const description = uploadArea.querySelector("p");
            if (title) title.textContent = "Upload evidence";
            if (description) description.textContent = "Drag & drop an image or click to browse";
        }
    }

    if (cameraButton && cameraModal) {
        cameraButton.addEventListener("click", function () {
            openCameraModal();
        });
    }

    if (closeCameraButton && cameraModal) {
        closeCameraButton.addEventListener("click", function () {
            closeCameraModal();
        });
    }

    if (cameraModal) {
        cameraModal.addEventListener("click", function (event) {
            if (event.target === cameraModal) {
                closeCameraModal();
            }
        });
    }

    if (capturePhotoButton && cameraPreview && cameraCanvas) {
        capturePhotoButton.addEventListener("click", function () {
            const context = cameraCanvas.getContext("2d");
            cameraCanvas.width = cameraPreview.videoWidth || 640;
            cameraCanvas.height = cameraPreview.videoHeight || 480;
            context.drawImage(cameraPreview, 0, 0, cameraCanvas.width, cameraCanvas.height);
            const dataUrl = cameraCanvas.toDataURL("image/png");
            handleCapturedPhoto(dataUrl).catch(function (error) {
                console.error("Unable to prepare camera evidence:", error);
                showToast("The captured photo could not be added. Please try uploading an image.");
            });
            closeCameraModal();
        });
    }

    if (voiceButton) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            voiceButton.disabled = true;
            if (voiceStatus) {
                voiceStatus.textContent = "Voice recognition is not supported in this browser. You can type your complaint.";
            }
        } else {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            let voiceTranscript = "";

            voiceButton.addEventListener("click", function () {
                if (voiceButton.classList.contains("is-recording")) {
                    recognition.stop();
                    return;
                }

                voiceTranscript = "";
                recognition.lang = voiceLanguage ? voiceLanguage.value : "en-IN";
                try {
                    recognition.start();
                } catch (error) {
                    console.error("Unable to start speech recognition:", error);
                    if (voiceStatus) {
                        voiceStatus.textContent = "Voice recognition could not start. Please try again.";
                    }
                }
            });

            recognition.onstart = function () {
                voiceButton.classList.add("is-recording");
                voiceButton.textContent = "⏹ Stop listening";
                if (voiceStatus) {
                    voiceStatus.textContent = "Listening... Speak your complaint.";
                }
            };

            recognition.onresult = function (event) {
                let interimTranscript = "";
                for (let index = event.resultIndex; index < event.results.length; index += 1) {
                    const transcript = event.results[index][0].transcript.trim();
                    if (event.results[index].isFinal && transcript) {
                        voiceTranscript += (voiceTranscript ? " " : "") + transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (complaintDescription && voiceTranscript) {
                    const existingText = complaintDescription.value.trim();
                    complaintDescription.value = existingText
                        ? existingText + " " + voiceTranscript
                        : voiceTranscript;
                    voiceTranscript = "";
                    if (inputType) {
                        inputType.value = "voice";
                    }
                    updateCharCounter(complaintDescription, charCounter);
                }

                if (voiceStatus) {
                    voiceStatus.textContent = interimTranscript
                        ? "Listening: " + interimTranscript
                        : "Listening... Speak your complaint.";
                }
            };

            recognition.onerror = function (event) {
                console.error("Speech recognition error:", event.error);
                const errorMessages = {
                    "not-allowed": "Microphone access was denied. Allow microphone access or type your complaint.",
                    "no-speech": "No speech was detected. Try speaking again.",
                    "audio-capture": "No microphone was found. Connect a microphone or type your complaint."
                };
                if (voiceStatus) {
                    voiceStatus.textContent = errorMessages[event.error] ||
                        "Voice recognition failed. Please type your complaint or try again.";
                }
            };

            recognition.onend = function () {
                voiceButton.classList.remove("is-recording");
                voiceButton.textContent = "🎙️ Speak complaint";
                if (voiceStatus && !voiceStatus.textContent.startsWith("Microphone") &&
                    !voiceStatus.textContent.startsWith("No speech") &&
                    !voiceStatus.textContent.startsWith("No microphone") &&
                    !voiceStatus.textContent.startsWith("Voice recognition failed")) {
                    voiceStatus.textContent = inputType && inputType.value === "voice"
                        ? "Voice text added to your complaint."
                        : "Voice input ended. You can try again or type your complaint.";
                }
            };
        }
    }

    if (form) {
        form.addEventListener("reset", function () {
            window.setTimeout(clearEvidencePreview, 0);
        });

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (voiceButton && voiceButton.classList.contains("is-recording")) {
                if (recognition) {
                    recognition.stop();
                }
                showToast("Stop voice recording before submitting your complaint.");
                return;
            }

            const title = complaintTitle ? complaintTitle.value.trim() : "";
            const description = complaintDescription ? complaintDescription.value.trim() : "";
            const selectedLocation = locationInput ? locationInput.value : "";

            if (!title || !description) {
                showToast("Please enter a complaint title and description.");
                return;
            }

            if (!selectedLocation || selectedLocation === "Select location") {
                showToast("Please select the complaint location.");
                return;
            }

            const complaintText = (title + " " + description).toLowerCase();
            const category = inferCategory(
                complaintText,
                categoryInput ? categoryInput.value : "Let AI decide"
            );
            const priority = inferPriority(complaintText);
            const summary = generateAssistantReply(
                "summary",
                complaintTitle,
                complaintDescription,
                locationInput,
                categoryInput
            );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Saving complaint...";
            }

            try {
                const evidenceFile = imageInput && imageInput.files[0];
                let requestBody;
                const requestHeaders = {};
                if (evidenceFile) {
                    requestBody = new FormData();
                    requestBody.append("title", title);
                    requestBody.append("description", description);
                    requestBody.append("summary", summary);
                    requestBody.append("location", selectedLocation);
                    requestBody.append("evidence", evidenceFile);
                    requestBody.append("input_type", inputType ? inputType.value : "text");
                } else {
                    requestBody = JSON.stringify({
                        title: title,
                        description: description,
                        summary: summary,
                        location: selectedLocation,
                        category: category,
                        priority: priority,
                        input_type: inputType ? inputType.value : "text"
                    });
                    requestHeaders["Content-Type"] = "application/json";
                }

                const response = await fetch("/api/complaints", {
                    method: "POST",
                    credentials: "include",
                    headers: requestHeaders,
                    body: requestBody
                });

                const result = await response.json();
                if (response.status === 401) {
                    window.location.href = "/login.html";
                    return;
                }
                if (!response.ok) {
                    throw new Error(result.message || result.error || "The complaint could not be saved.");
                }

                analyzeComplaint({
                    title: title,
                    description: description,
                    location: selectedLocation,
                    category: category,
                    analysis: result.ai
                });

                if (result && result.ai) {
                    const categoryText = result.ai.category || category;
                    const priorityText = result.ai.priority || priority;
                    const categoryConfidence = result.ai.category_confidence ? Math.round(result.ai.category_confidence * 100) : 0;
                    const priorityConfidence = result.ai.priority_confidence ? Math.round(result.ai.priority_confidence * 100) : 0;
                    showToast(
                        "Complaint saved. AI: " + categoryText + " (" + categoryConfidence + "%), " + priorityText + " (" + priorityConfidence + "%)."
                    );
                } else {
                    showToast("Complaint saved to the database. Ticket #" + result.complaint_id);
                }
                if (result.ocr_warning) {
                    showToast(result.ocr_warning);
                }

                form.reset();
                if (inputType) {
                    inputType.value = "text";
                }
                displayOcrResult(
                    result.evidence ? result.evidence.ocr_text : "",
                    result.ocr_warning
                );
                updateCharCounter(complaintDescription, charCounter);
            } catch (error) {
                console.error("Complaint submission failed:", error);
                showToast(error.message || "Could not connect to the complaint database. Please try again.");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButtonLabel;
                }
            }
        });
    }
});

function updateCharCounter(descriptionField, counterElement) {
    if (!descriptionField || !counterElement) {
        return;
    }

    const length = descriptionField.value.length;
    const maxLength = 500;
    counterElement.textContent = length + "/" + maxLength;
    counterElement.style.color = length > maxLength * 0.85 ? "#fbbf24" : "#38bdf8";
}

function openCameraModal() {
    const cameraModal = document.getElementById("cameraModal");
    const cameraPreview = document.getElementById("cameraPreview");

    if (!cameraModal || !cameraPreview) {
        return;
    }

    cameraModal.classList.remove("hidden");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        }).then(function (stream) {
            cameraPreview.srcObject = stream;
        }).catch(function () {
            showToast("Camera access was blocked. Please upload an image instead.");
            closeCameraModal();
        });
    } else {
        showToast("This browser does not support camera capture.");
        closeCameraModal();
    }
}

function closeCameraModal() {
    const cameraModal = document.getElementById("cameraModal");
    const cameraPreview = document.getElementById("cameraPreview");

    if (cameraModal) {
        cameraModal.classList.add("hidden");
    }

    if (cameraPreview && cameraPreview.srcObject) {
        cameraPreview.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        cameraPreview.srcObject = null;
    }
}

async function handleCapturedPhoto(dataUrl) {
    const imageInput = document.getElementById("complaintImage");
    if (!imageInput) {
        return;
    }

    const imageBlob = await fetch(dataUrl).then(function (response) {
        return response.blob();
    });
    const imageFile = new File([imageBlob], "camera-evidence.png", {
        type: "image/png"
    });
    if (!handleFileSelection(imageFile)) {
        return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(imageFile);
    imageInput.files = transfer.files;
}

function handleFileSelection(file) {
    const uploadArea = document.getElementById("uploadArea");
    const imagePreview = document.getElementById("imagePreview");
    const ocrResult = document.getElementById("ocrResult");
    if (!uploadArea || !imagePreview) {
        return false;
    }

    if (ocrResult) {
        ocrResult.replaceChildren();
        ocrResult.hidden = true;
    }

    const extension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    if (!file.type.startsWith("image/") || !allowedExtensions.includes(extension)) {
        showToast("Please upload a PNG, JPG, JPEG, or WEBP image.");
        return false;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
        showToast("Image size should be under 5MB.");
        return false;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        uploadArea.classList.add("has-file");
        const title = uploadArea.querySelector("strong");
        const description = uploadArea.querySelector("p");
        if (title) title.textContent = file.name;
        if (description) description.textContent = "Evidence ready to submit";

        const preview = document.createElement("img");
        preview.src = event.target.result;
        preview.alt = "Evidence preview";
        imagePreview.replaceChildren(preview);
        imagePreview.hidden = false;
        showToast("Evidence uploaded successfully.");
    };
    reader.onerror = function () {
        showToast("The selected image could not be previewed.");
    };
    reader.readAsDataURL(file);
    return true;
}

function displayOcrResult(text, warning) {
    const ocrResult = document.getElementById("ocrResult");
    if (!ocrResult) {
        return;
    }

    ocrResult.replaceChildren();
    if (text) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const extractedText = document.createElement("pre");
        summary.textContent = "Text extracted from evidence (used for AI analysis)";
        extractedText.textContent = text;
        details.append(summary, extractedText);
        ocrResult.appendChild(details);
    }
    if (warning) {
        const warningMessage = document.createElement("p");
        warningMessage.textContent = warning;
        ocrResult.appendChild(warningMessage);
    }
    ocrResult.hidden = !text && !warning;
}

function analyzeComplaint(data) {
    const placeholder = document.getElementById("aiPlaceholder");
    const result = document.getElementById("aiResult");

    if (placeholder) {
        placeholder.innerHTML = "<div>🧠</div><h3>AI is analyzing...</h3><p>Understanding the issue, routing it to the right team, and predicting urgency.</p>";
    }

    setTimeout(function () {
        const complicationText = (data.title + " " + data.description).toLowerCase();
        const analysis = data.analysis;
        const category = analysis
            ? analysis.category
            : inferCategory(complicationText, data.category);
        const priority = analysis
            ? String(analysis.priority || "Low").toLowerCase()
            : inferPriority(complicationText);
        const sentiment = analysis
            ? analysis.sentiment
            : inferSentiment(complicationText);
        const department = analysis
            ? analysis.department
            : mapDepartment(category);
        const confidence = analysis
            ? Math.round((analysis.category_confidence || 0) * 100)
            : inferConfidence(complicationText, category, priority);

        if (placeholder) {
            placeholder.style.display = "none";
        }

        if (result) {
            result.style.display = "block";
            const aiCategory = document.getElementById("aiCategory");
            const aiPriority = document.getElementById("aiPriority");
            const aiSentiment = document.getElementById("aiSentiment");
            const aiDepartment = document.getElementById("aiDepartment");
            const aiConfidence = document.getElementById("aiConfidence");
            const confidenceFill = document.getElementById("confidenceFill");
            const aiSuggestions = document.getElementById("aiSuggestions");

            if (aiCategory) aiCategory.textContent = category;
            if (aiPriority) {
                aiPriority.textContent = priority.toUpperCase();
                aiPriority.className = "priority-tag " + priority.toLowerCase();
            }
            if (aiSentiment) aiSentiment.textContent = sentiment;
            if (aiDepartment) aiDepartment.textContent = department;
            if (aiConfidence) aiConfidence.textContent = confidence + "%";
            if (confidenceFill) confidenceFill.style.width = confidence + "%";
            if (aiSuggestions) aiSuggestions.innerHTML = buildSuggestions(category, priority, department, sentiment);
        }

        showToast(
            (analysis ? "Complaint saved and routed to " : "Complaint analyzed and routed to ") +
            department + "."
        );
    }, 1200);
}

function buildSuggestions(category, priority, department, sentiment) {
    const actions = {
        WiFi: ["Check network routers and access points in the affected block.", "Prioritize bandwidth test and student device connectivity review."],
        Electricity: ["Inspect switchboards and power backup systems immediately.", "Escalate to electrical maintenance if outage is repeated."],
        Water: ["Verify tank and pipeline supply status for the affected floor.", "Alert maintenance team to restore drinking water access."],
        Hostel: ["Review hostel room conditions and warden escalation log.", "Coordinate with housing office for urgent student support."],
        Library: ["Check library system logs and printer availability status.", "Arrange quick help desk support for study access."],
        Canteen: ["Inspect food quality and hygiene compliance records.", "Coordinate with cafeteria management for corrective action."],
        Laboratory: ["Check equipment connectivity and lab inventory logs.", "Schedule technician support for urgent experiment continuity."],
        Examination: ["Review the issue with the examination controller and exam setup team.", "Confirm a resolution timeline before the next test window."],
        Transport: ["Verify route schedule and vehicle availability logs.", "Coordinate with transport operator for service recovery."],
        Other: ["Route the complaint to the support desk for triage.", "Request additional student context if the issue remains unclear."]
    };

    const list = actions[category] || actions.Other;
    const tone = priority === "high" ? "Urgent" : priority === "medium" ? "Priority" : "Routine";

    return [
        '<div class="suggestion-item"><span class="suggestion-label">Recommended action</span><strong>' + list[0] + '</strong></div>',
        '<div class="suggestion-item"><span class="suggestion-label">Escalation path</span><strong><span>' + department + '</span> · <span>' + tone + ' follow-up</span> · <span>' + sentiment + ' sentiment</span></strong></div>',
        '<div class="suggestion-item"><span class="suggestion-label">Next step</span><strong>' + list[1] + '</strong></div>'
    ].join("");
}

function addAssistantMessage(message, sender) {
    const chat = document.getElementById("assistantChat");
    if (!chat) {
        return;
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + sender;
    bubble.textContent = message;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
}

function buildAssistantPrompt(action, titleEl, descEl, locationEl, categoryEl) {
    const title = titleEl && titleEl.value ? titleEl.value.trim() : "";
    const description = descEl && descEl.value ? descEl.value.trim() : "";
    const location = locationEl && locationEl.value ? locationEl.value : "";
    const category = categoryEl && categoryEl.value ? categoryEl.value : "";

    if (!title && !description) {
        return "Please describe the issue first so I can help you.";
    }

    if (action === "summary") {
        return "Summarize this complaint";
    }

    if (action === "rewrite") {
        return "Rewrite this complaint in a clearer and more professional tone";
    }

    if (action === "escalate") {
        return "Tell me the best escalation path for this issue";
    }

    return "Help me improve this complaint";
}

function generateAssistantReply(action, titleEl, descEl, locationEl, categoryEl) {
    const title = titleEl && titleEl.value ? titleEl.value.trim() : "";
    const description = descEl && descEl.value ? descEl.value.trim() : "";
    const location = locationEl && locationEl.value ? locationEl.value : "";
    const category = categoryEl && categoryEl.value ? categoryEl.value : "";
    const language = document.documentElement.lang;

    if (action === "summary") {
        const issue = description || title || (language === "hi"
            ? "बताई गई समस्या"
            : language === "mr"
                ? "नोंदवलेली समस्या"
                : "the reported problem");
        if (language === "hi") {
            return "सारांश: " + issue + (location ? " (" + translateComplaintText(location) + ") में दर्ज किया गया है।" : " दर्ज किया गया है।") +
                " संबंधित सहायता टीम को इसकी जांच और आगे की कार्रवाई करनी चाहिए।";
        }
        if (language === "mr") {
            return "सारांश: " + issue + (location ? " (" + translateComplaintText(location) + ") येथे नोंदवली आहे." : " नोंदवली आहे.") +
                " संबंधित सहाय्य पथकाने तपासणी करून पुढील कार्यवाही करावी.";
        }
        return "Summary: A complaint has been reported for " + issue + (location ? " at " + location + "." : ".") + " The issue appears to require immediate review and follow-up from the relevant support team.";
    }

    if (action === "rewrite") {
        if (language === "hi") {
            return "पेशेवर रूप में दोबारा लिखा गया: " + (title || "परिसर की समस्या") + "। " +
                (location ? translateComplaintText(location) : "परिसर") + " में " + (description || "सेवा में बाधा") +
                " की समस्या है। इससे दैनिक गतिविधियां प्रभावित हो रही हैं। कृपया शीघ्र जांच कर समाधान करें।";
        }
        if (language === "mr") {
            return "व्यावसायिक पुनर्लेखन: " + (title || "कॅम्पसची समस्या") + ". " +
                (location ? translateComplaintText(location) : "कॅम्पसमध्ये") + " येथे " + (description || "सेवेतील अडथळा") +
                " ही समस्या आहे. यामुळे दैनंदिन कामकाजावर परिणाम होत आहे. कृपया लवकर तपासणी करून निराकरण करावे.";
        }
        return "Rewritten complaint: " + (title || "Campus issue") + ". We are facing a problem in " + (location || "the campus area") + " regarding " + (description || "the service disruption") + ". This issue is affecting daily activities and requires prompt attention and resolution.";
    }

    if (action === "escalate") {
        const department = category && category !== "Let AI decide" ? category : "the relevant department";
        if (language === "hi") {
            return "आगे भेजने की योजना: इस शिकायत को " + translateComplaintText(department) +
                " सहायता टीम को भेजें, प्राथमिकता जोड़ें और 24 घंटे के भीतर समाधान का समय मांगें।";
        }
        if (language === "mr") {
            return "पुढे पाठवण्याची योजना: ही तक्रार " + translateComplaintText(department) +
                " सहाय्य पथकाकडे पाठवा, प्राधान्य नोंदवा आणि 24 तासांत निराकरणाची वेळ मागा.";
        }
        return "Escalation plan: Route this complaint to the " + department + " support desk, add the urgency level, and send a resolution timeline request within 24 hours. Include the location, impact, and student impact details in the ticket.";
    }

    if (language === "hi") {
        return "सुझाव: शिकायत में सही तारीख, स्थान और छात्रों पर पड़ने वाला प्रभाव बताएं, ताकि संबंधित विभाग समस्या को जल्दी समझकर हल कर सके।";
    }
    if (language === "mr") {
        return "सूचना: तक्रारीत अचूक तारीख, ठिकाण आणि विद्यार्थ्यांवर होणारा परिणाम नमूद करा, जेणेकरून संबंधित विभागाला समस्या लवकर समजून निराकरण करता येईल.";
    }
    return "AI suggestion: Add precise dates, location details, and the exact impact on students so the complaint can be triaged faster and resolved more effectively.";
}

function generateAssistantReplyFromPrompt(prompt, titleEl, descEl, locationEl, categoryEl) {
    const lower = prompt.toLowerCase();
    const title = titleEl && titleEl.value ? titleEl.value.trim() : "";
    const description = descEl && descEl.value ? descEl.value.trim() : "";
    const language = document.documentElement.lang;

    if (lower.includes("summary") || lower.includes("summarize") || lower.includes("सारांश")) {
        if (language === "hi") {
            return "सारांश: " + (description || title || "बताई गई समस्या") + "। संबंधित विभाग को इसकी जांच कर उचित कार्रवाई करनी चाहिए।";
        }
        if (language === "mr") {
            return "सारांश: " + (description || title || "नोंदवलेली समस्या") + ". संबंधित विभागाने तपासणी करून योग्य कार्यवाही करावी.";
        }
        return "Summary: " + (description || title || "The reported issue") + ". This complaint needs prompt investigation and appropriate action from the responsible department.";
    }

    if (lower.includes("rewrite") || lower.includes("rephrase") || lower.includes("पुन्हा लिहा") || lower.includes("दोबारा लिखें")) {
        if (language === "hi") {
            return "पेशेवर रूप: " + (title || "परिसर की समस्या") + "। समस्या का स्पष्ट विवरण दें और समाधान के लिए संबंधित विभाग से शीघ्र कार्रवाई का अनुरोध करें।";
        }
        if (language === "mr") {
            return "व्यावसायिक स्वरूप: " + (title || "कॅम्पसची समस्या") + ". समस्येचे स्पष्ट वर्णन करून निराकरणासाठी संबंधित विभागाला त्वरित कार्यवाहीची विनंती करा.";
        }
        return "Professional rewrite: " + (title || "Campus issue") + ". We are facing a problem in the campus environment that affects daily activities. This issue requires immediate attention, documentation, and a clear resolution plan.";
    }

    if (lower.includes("escalate") || lower.includes("urgent") || lower.includes("आगे भेज") || lower.includes("तत्काल") || lower.includes("पुढे पाठव") || lower.includes("तातडी")) {
        const target = (categoryEl && categoryEl.value && categoryEl.value !== "Let AI decide") ? categoryEl.value : "relevant department";
        if (language === "hi") {
            return "आगे भेजने का तरीका: शिकायत को " + translateComplaintText(target) +
                " विभाग को उच्च प्राथमिकता के साथ भेजें और समाधान की समय-सीमा मांगें।";
        }
        if (language === "mr") {
            return "पुढे पाठवण्याचा मार्ग: तक्रार " + translateComplaintText(target) +
                " विभागाकडे उच्च प्राधान्याने पाठवा आणि निराकरणाची वेळ मागा.";
        }
        return "Escalation: Route this complaint to the " + target + " team immediately, flag it as high priority, and request a corrective action update with a timeline.";
    }

    if (language === "hi") {
        return "सुझाव: शिकायत जल्दी हल कराने के लिए सटीक स्थान, समय और छात्रों पर पड़ने वाला प्रभाव जोड़ें।";
    }
    if (language === "mr") {
        return "सूचना: तक्रार लवकर सोडवण्यासाठी अचूक ठिकाण, वेळ आणि विद्यार्थ्यांवर होणारा परिणाम नमूद करा.";
    }
    return "AI recommendation: Keep the complaint specific, include the exact location, the impact on students, and any evidence or recent timeline details so it can be resolved faster.";
}

function inferCategory(text, selectedCategory) {
    if (selectedCategory && selectedCategory !== "Let AI decide") {
        return selectedCategory;
    }

    const keywords = {
        wifi: ["wifi", "wi-fi", "internet", "network", "connectivity", "latency", "router", "signal", "वाई-फ़ाई", "वाईफाई", "इंटरनेट", "नेटवर्क", "वाय-फाय", "वायफाय", "जाळे", "इंटरनेट"],
        electricity: ["power", "electricity", "light", "fan", "socket", "breaker", "voltage", "बिजली", "बत्ती", "पंखा", "विद्युत", "वीज", "दिवा", "पंखा"],
        water: ["water", "tap", "tank", "drinking water", "pipeline", "leak", "पानी", "नल", "टंकी", "पाइपलाइन", "गळती", "पाणी", "नळ", "टाकी"],
        hostel: ["hostel", "room", "mess", "roommate", "warden", "accommodation", "छात्रावास", "कमरा", "वॉर्डन", "वसतिगृह", "खोली"],
        library: ["library", "book", "study room", "reading hall", "journal", "पुस्तकालय", "किताब", "ग्रंथालय", "पुस्तक"],
        canteen: ["canteen", "food", "mess", "meal", "tea", "snacks", "कैंटीन", "भोजन", "खाना", "उपहारगृह", "अन्न", "जेवण"],
        laboratory: ["lab", "computer lab", "experiment", "equipment", "software", "printer", "प्रयोगशाला", "लैब", "कंप्यूटर", "संगणक", "प्रयोग"],
        examination: ["exam", "hall ticket", "result", "grade", "marks", "paper", "परीक्षा", "परिणाम", "अंक", "निकाल"],
        transport: ["bus", "transport", "route", "driver", "vehicle", "pickup", "बस", "परिवहन", "मार्ग", "वाहतूक", "मार्ग"]
    };

    let detectedCategory = "Other";
    let maxScore = 0;

    Object.entries(keywords).forEach(function ([category, words]) {
        const score = words.reduce(function (total, word) {
            return total + (text.includes(word) ? 1 : 0);
        }, 0);

        if (score > maxScore) {
            maxScore = score;
            detectedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        }
    });

    return detectedCategory;
}

function inferPriority(text) {
    const criticalWords = ["urgent", "emergency", "unsafe", "not working", "stopped", "no power", "critical", "dangerous", "तत्काल", "आपातकाल", "असुरक्षित", "काम नहीं कर", "बंद है", "जरूरी", "अत्यावश्यक", "धोकादायक", "काम करत नाही", "बंद आहे", "तातडी", "तात्काळ"];
    const mediumWords = ["slow", "delayed", "late", "bad", "unable", "issue", "broken", "poor", "धीमा", "देरी", "समस्या", "खराब", "अटक", "अडचण", "मंद", "उशीर", "बिघड"];

    if (criticalWords.some(function (word) { return text.includes(word); })) {
        return "high";
    }
    if (mediumWords.some(function (word) { return text.includes(word); })) {
        return "medium";
    }
    return "low";
}

function inferSentiment(text) {
    const frustratedWords = ["very angry", "frustrated", "annoyed", "disappointed", "terrible", "bad", "worse", "निराश", "गुस्सा", "परेशान", "नाराज", "त्रास", "निराश"];
    const neutralWords = ["issue", "concern", "problem", "needs attention", "please fix", "समस्या", "चिंता", "कृपया ठीक", "अडचण", "कृपया दुरुस्त"];

    if (frustratedWords.some(function (word) { return text.includes(word); })) {
        return "Frustrated";
    }
    if (neutralWords.some(function (word) { return text.includes(word); })) {
        return "Neutral";
    }
    return "Concerned";
}

function mapDepartment(category) {
    const departments = {
        WiFi: "CS Department",
        Electricity: "Electrical Department",
        Water: "Maintenance Department",
        Hostel: "Hostel Administration",
        Library: "Library Services",
        Canteen: "Student Affairs",
        Laboratory: "Lab Services",
        Examination: "Examination Cell",
        Transport: "Transport Office",
        Other: "Student Support Desk"
    };

    return departments[category] || "Student Support Desk";
}

function inferConfidence(text, category, priority) {
    let score = 65;

    if (text.length > 80) score += 10;
    if (text.length > 150) score += 8;
    if (category && category !== "Other") score += 8;
    if (priority === "high") score += 5;
    if (priority === "medium") score += 3;

    return Math.min(97, score);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
        return;
    }

    const routePrefix = "Complaint analyzed and routed to ";
    const localizedMessage = message.indexOf(routePrefix) === 0
        ? translateComplaintText("Complaint analyzed and routed to") + " " +
            translateComplaintText(message.slice(routePrefix.length).replace(/\.$/, "")) + "."
        : translateComplaintText(message);

    toast.textContent = localizedMessage;
    toast.classList.add("show");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(function () {
        toast.classList.remove("show");
    }, 2200);
}