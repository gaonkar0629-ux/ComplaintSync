document.addEventListener("DOMContentLoaded", function () {
    const entries = [
        ["Language", "भाषा", "भाषा"],
        ["Student Portal", "छात्र पोर्टल", "विद्यार्थी पोर्टल"],
        ["Dashboard", "डैशबोर्ड", "डॅशबोर्ड"],
        ["New Complaint", "नई शिकायत", "नवीन तक्रार"],
        ["My Complaints", "मेरी शिकायतें", "माझ्या तक्रारी"],
        ["Notifications", "सूचनाएं", "सूचना"],
        ["AI Assistant", "एआई सहायक", "एआय सहाय्यक"],
        ["Settings", "सेटिंग्स", "सेटिंग्ज"],
        ["Logout", "लॉग आउट", "बाहेर पडा"],
        ["Student", "छात्र", "विद्यार्थी"],
        ["Faculty", "शिक्षक", "प्राध्यापक"],
        ["SMART COMPLAINT", "स्मार्ट शिकायत", "स्मार्ट तक्रार"],
        ["Report a Problem", "समस्या की रिपोर्ट करें", "समस्येची नोंद करा"],
        ["Describe your issue and our AI will automatically analyze it.", "अपनी समस्या बताएं और हमारा एआई उसका विश्लेषण करेगा।", "तुमची समस्या सांगा आणि आमचे एआय तिचे विश्लेषण करेल."],
        ["Complaint Details", "शिकायत का विवरण", "तक्रारीचा तपशील"],
        ["Smart templates", "स्मार्ट टेम्पलेट", "स्मार्ट नमुने"],
        ["WiFi outage", "वाई-फ़ाई बंद", "वाय-फाय बंद"],
        ["Library issue", "पुस्तकालय की समस्या", "ग्रंथालयाची समस्या"],
        ["Hostel issue", "छात्रावास की समस्या", "वसतिगृहाची समस्या"],
        ["Complaint Title", "शिकायत का शीर्षक", "तक्रारीचे शीर्षक"],
        ["Describe your complaint", "अपनी शिकायत बताएं", "तुमची तक्रार सांगा"],
        ["AI will analyze this description", "एआई इस विवरण का विश्लेषण करेगा", "एआय या वर्णनाचे विश्लेषण करेल"],
        ["Location & Evidence", "स्थान और सबूत", "ठिकाण आणि पुरावा"],
        ["Location", "स्थान", "ठिकाण"],
        ["Select location", "स्थान चुनें", "ठिकाण निवडा"],
        ["Main Building", "मुख्य भवन", "मुख्य इमारत"],
        ["Computer Laboratory", "कंप्यूटर प्रयोगशाला", "संगणक प्रयोगशाळा"],
        ["Library", "पुस्तकालय", "ग्रंथालय"],
        ["Hostel", "छात्रावास", "वसतिगृह"],
        ["Canteen", "कैंटीन", "उपहारगृह"],
        ["Sports Ground", "खेल का मैदान", "क्रीडांगण"],
        ["Complaint Category", "शिकायत की श्रेणी", "तक्रारीचा प्रकार"],
        ["Let AI decide", "एआई को तय करने दें", "एआयला ठरवू द्या"],
        ["Examination", "परीक्षा", "परीक्षा"],
        ["Transport", "परिवहन", "वाहतूक"],
        ["WiFi", "वाई-फ़ाई", "वाय-फाय"],
        ["Electricity", "बिजली", "वीज"],
        ["Water", "पानी", "पाणी"],
        ["Laboratory", "प्रयोगशाला", "प्रयोगशाळा"],
        ["Other", "अन्य", "इतर"],
        ["Upload evidence", "सबूत अपलोड करें", "पुरावा अपलोड करा"],
        ["Drag & drop an image or click to browse", "तस्वीर यहां छोड़ें या चुनने के लिए क्लिक करें", "प्रतिमा येथे टाका किंवा निवडण्यासाठी क्लिक करा"],
        ["PNG, JPG up to 5MB", "PNG, JPG अधिकतम 5MB", "PNG, JPG कमाल 5MB"],
        ["Use Camera", "कैमरा इस्तेमाल करें", "कॅमेरा वापरा"],
        ["📸 Use Camera", "📸 कैमरा इस्तेमाल करें", "📸 कॅमेरा वापरा"],
        ["🎙️ Voice", "🎙️ आवाज़", "🎙️ आवाज"],
        ["Capture evidence", "सबूत की तस्वीर लें", "पुराव्याचा फोटो घ्या"],
        ["Capture Photo", "तस्वीर लें", "फोटो घ्या"],
        ["Analyze & Submit Complaint", "विश्लेषण करें और शिकायत भेजें", "विश्लेषण करून तक्रार पाठवा"],
        ["✨ Analyze & Submit Complaint", "✨ विश्लेषण करें और शिकायत भेजें", "✨ विश्लेषण करून तक्रार पाठवा"],
        ["Ready to analyze", "विश्लेषण के लिए तैयार", "विश्लेषणासाठी तयार"],
        ["Summary", "सारांश", "सारांश"],
        ["Rewrite", "दोबारा लिखें", "पुन्हा लिहा"],
        ["Escalate", "आगे भेजें", "पुढे पाठवा"],
        ["Send", "भेजें", "पाठवा"],
        ["Ask AI assistant...", "एआई सहायक से पूछें...", "एआय सहाय्यकाला विचारा..."],
        ["AI Analysis", "एआई विश्लेषण", "एआय विश्लेषण"],
        ["Once you describe your complaint, AI will predict category, priority, sentiment and responsible department.", "शिकायत बताने पर एआई श्रेणी, प्राथमिकता, भावना और जिम्मेदार विभाग का अनुमान लगाएगा।", "तक्रारीचे वर्णन केल्यावर एआय प्रकार, प्राधान्य, भावना आणि जबाबदार विभागाचा अंदाज देईल."],
        ["AI is analyzing...", "एआई विश्लेषण कर रहा है...", "एआय विश्लेषण करत आहे..."],
        ["Understanding the issue, routing it to the right team, and predicting urgency.", "समस्या को समझ रहे हैं, सही टीम चुन रहे हैं और तात्कालिकता तय कर रहे हैं।", "समस्या समजून योग्य पथक निवडत आहोत आणि तातडीचा अंदाज घेत आहोत."],
        ["Category", "श्रेणी", "प्रकार"],
        ["Priority", "प्राथमिकता", "प्राधान्य"],
        ["Sentiment", "भावना", "भावना"],
        ["Department", "विभाग", "विभाग"],
        ["AI Confidence", "एआई विश्वास स्तर", "एआय विश्वास पातळी"],
        ["Recommended action", "सुझाई गई कार्रवाई", "सुचवलेली कृती"],
        ["Escalation path", "आगे भेजने का तरीका", "पुढे पाठवण्याचा मार्ग"],
        ["Next step", "अगला कदम", "पुढील पाऊल"],
        ["Overview", "अवलोकन", "आढावा"],
        ["Track every grievance, update status, and monitor resolution progress.", "अपनी शिकायतों की स्थिति और समाधान की प्रगति देखें।", "तक्रारींची स्थिती आणि निराकरणाची प्रगती पाहा."],
        ["Total", "कुल", "एकूण"],
        ["Total Complaints", "कुल शिकायतें", "एकूण तक्रारी"],
        ["In Progress", "काम जारी है", "काम सुरू आहे"],
        ["Resolved", "हल हो गया", "निराकरण झाले"],
        ["High Priority", "उच्च प्राथमिकता", "उच्च प्राधान्य"],
        ["Need attention", "ध्यान देना आवश्यक", "लक्ष देणे आवश्यक"],
        ["Completed", "पूरा हुआ", "पूर्ण"],
        ["Urgent", "तत्काल", "तातडीचे"],
        ["Complaint history", "शिकायत का इतिहास", "तक्रारींचा इतिहास"],
        ["All active and resolved grievances", "सभी सक्रिय और हल की गई शिकायतें", "सर्व सक्रिय आणि निकाली काढलेल्या तक्रारी"],
        ["Complaint", "शिकायत", "तक्रार"],
        ["Date", "तारीख", "तारीख"],
        ["Status", "स्थिति", "स्थिती"],
        ["Medium", "मध्यम", "मध्यम"],
        ["Low", "कम", "कमी"],
        ["Pending", "लंबित", "प्रलंबित"],
        ["Updates & alerts", "अपडेट और सूचनाएं", "अपडेट आणि सूचना"],
        ["Track complaint status changes, reminders, and admin actions.", "शिकायत की स्थिति, रिमाइंडर और व्यवस्थापक की कार्रवाइयां देखें।", "तक्रारीतील बदल, स्मरणपत्रे आणि प्रशासकीय कृती पाहा."],
        ["Unread", "अपठित", "न वाचलेले"],
        ["Pending review", "समीक्षा लंबित", "पुनरावलोकन प्रलंबित"],
        ["Escalations", "आगे भेजी गई शिकायतें", "पुढे पाठवलेल्या तक्रारी"],
        ["Recent notifications", "हाल की सूचनाएं", "अलीकडील सूचना"],
        ["Latest updates from your department and admin", "आपके विभाग और व्यवस्थापक के नए अपडेट", "तुमच्या विभागाकडून आणि प्रशासकाकडून नवीन अपडेट"],
        ["Mark all as read", "सभी को पढ़ा हुआ चिह्नित करें", "सर्व वाचलेले म्हणून चिन्हांकित करा"],
        ["New", "नई", "नवीन"],
        ["2 min ago", "2 मिनट पहले", "2 मिनिटांपूर्वी"],
        ["18 min ago", "18 मिनट पहले", "18 मिनिटांपूर्वी"],
        ["1 hour ago", "1 घंटे पहले", "1 तासापूर्वी"],
        ["3 hours ago", "3 घंटे पहले", "3 तासांपूर्वी"],
        ["Today", "आज", "आज"],
        ["Action required: hostel water issue", "कार्रवाई आवश्यक: छात्रावास में पानी की समस्या", "कृती आवश्यक: वसतिगृहातील पाण्याची समस्या"],
        ["Library issue resolved", "पुस्तकालय की समस्या हल हुई", "ग्रंथालयाची समस्या सुटली"],
        ["AI assistant recommended escalation", "एआई सहायक ने आगे भेजने की सलाह दी", "एआय सहाय्यकाने पुढे पाठवण्याची शिफारस केली"],
        ["Maintenance reminder", "रखरखाव रिमाइंडर", "देखभाल स्मरणपत्र"],
        ["Technician is checking the lab routers and expects a status update within 30 minutes.", "तकनीशियन लैब के राउटर की जांच कर रहा है। 30 मिनट में स्थिति अपडेट मिलने की उम्मीद है।", "तंत्रज्ञ प्रयोगशाळेतील राउटर तपासत आहे. 30 मिनिटांत स्थिती अपडेट अपेक्षित आहे."],
        ["Admin requested additional photos and your complaint has been escalated for review.", "व्यवस्थापक ने अतिरिक्त तस्वीरें मांगी हैं और आपकी शिकायत समीक्षा के लिए आगे भेजी गई है।", "प्रशासकाने अतिरिक्त छायाचित्रे मागितली आहेत आणि तुमची तक्रार पुनरावलोकनासाठी पुढे पाठवली आहे."],
        ["Printer service was restored and the complaint was marked resolved by the library team.", "प्रिंटर सेवा बहाल कर दी गई है और पुस्तकालय टीम ने शिकायत हल कर दी है।", "प्रिंटर सेवा पुन्हा सुरू झाली असून ग्रंथालयाच्या पथकाने तक्रार निकाली काढली आहे."],
        ["Based on the complaint wording, the system suggested a higher-priority route to the IT desk.", "शिकायत के विवरण के आधार पर सिस्टम ने इसे उच्च प्राथमिकता के साथ आईटी विभाग को भेजने का सुझाव दिया।", "तक्रारीच्या मजकुरानुसार प्रणालीने ती उच्च प्राधान्याने आयटी विभागाकडे पाठवण्याची सूचना केली."],
        ["Electrical inspection for Block A is scheduled for 4:00 PM. Please keep your complaint updated.", "ब्लॉक A के लिए बिजली निरीक्षण शाम 4:00 बजे तय है। कृपया अपनी शिकायत अपडेट रखें।", "ब्लॉक A साठी विद्युत तपासणी संध्याकाळी 4:00 वाजता नियोजित आहे. कृपया तक्रारीची माहिती अद्ययावत ठेवा."],
        ["Smart support", "स्मार्ट सहायता", "स्मार्ट सहाय्य"],
        ["Get smarter complaint summaries, escalation guidance, and department suggestions.", "शिकायत का सारांश, आगे भेजने की सलाह और विभाग के सुझाव पाएं।", "तक्रारीचा सारांश, पुढे पाठवण्याचे मार्गदर्शन आणि विभागांचे सुझाव मिळवा."],
        ["AI Support Desk", "एआई सहायता केंद्र", "एआय सहाय्य केंद्र"],
        ["Online now", "अभी ऑनलाइन", "आता ऑनलाइन"],
        ["I can review the complaint, suggest the right escalation, and help draft an update to the department.", "मैं शिकायत की समीक्षा, सही विभाग का सुझाव और विभाग को भेजने के लिए संदेश तैयार करने में मदद कर सकता हूं।", "मी तक्रारीचा आढावा, योग्य विभागाची सूचना आणि विभागाला पाठवण्यासाठी संदेश तयार करण्यात मदत करू शकतो."],
        ["Please help me summarize my WiFi complaint at the computer lab.", "कृपया कंप्यूटर लैब की मेरी वाई-फ़ाई शिकायत का सारांश बनाएं।", "कृपया संगणक प्रयोगशाळेतील माझ्या वाय-फाय तक्रारीचा सारांश द्या."],
        ["Summary: The WiFi in the computer lab is unstable and disconnecting frequently, which is affecting student productivity and digital learning. This requires quick review by the CS Department.", "सारांश: कंप्यूटर लैब का वाई-फ़ाई अस्थिर है और बार-बार डिस्कनेक्ट हो रहा है, जिससे पढ़ाई प्रभावित हो रही है। सीएस विभाग को इसकी शीघ्र जांच करनी चाहिए।", "सारांश: संगणक प्रयोगशाळेतील वाय-फाय अस्थिर असून वारंवार खंडित होत आहे, त्यामुळे विद्यार्थ्यांच्या अभ्यासावर परिणाम होत आहे. सीएस विभागाने याची त्वरित तपासणी करावी."],
        ["AI insight", "एआई जानकारी", "एआय माहिती"],
        ["Priority score", "प्राथमिकता अंक", "प्राधान्य गुण"],
        ["Suggested department", "सुझाया गया विभाग", "सुचवलेला विभाग"],
        ["Most suitable team for reviewing computer science and campus technology-related concerns.", "कंप्यूटर विज्ञान और परिसर की तकनीक से जुड़ी समस्याओं की समीक्षा के लिए उपयुक्त टीम।", "संगणक विज्ञान आणि परिसरातील तंत्रज्ञानाशी संबंधित समस्यांचा आढावा घेण्यासाठी योग्य पथक."],
        ["Good morning, Pavan 👋", "सुप्रभात, Pavan 👋", "शुभ सकाळ, Pavan 👋"],
        ["Here's what's happening with your complaints.", "आपकी शिकायतों की ताज़ा जानकारी यहां है।", "तुमच्या तक्रारींची ताजी माहिती येथे आहे."],
        ["↑ 2 this month", "↑ इस महीने 2", "↑ या महिन्यात 2"],
        ["Being handled", "कार्यवाही जारी", "कार्यवाही सुरू आहे"],
        ["58% success rate", "58% सफलता दर", "58% यशस्वी दर"],
        ["100% analyzed", "100% विश्लेषण किया गया", "100% विश्लेषण झाले"],
        ["Recent Complaints", "हाल की शिकायतें", "अलीकडील तक्रारी"],
        ["Your latest submissions", "आपकी हाल की शिकायतें", "तुमच्या अलीकडील तक्रारी"],
        ["Your complaints are being handled.", "आपकी शिकायतों पर कार्यवाही हो रही है।", "तुमच्या तक्रारींवर कार्यवाही सुरू आहे."],
        ["AI confidence: 78%", "एआई विश्वास स्तर: 78%", "एआय विश्वास पातळी: 78%"],
        ["Quick Actions", "त्वरित कार्रवाइयां", "जलद कृती"],
        ["Submit Complaint", "शिकायत भेजें", "तक्रार पाठवा"],
        ["Report a new issue", "नई समस्या की रिपोर्ट करें", "नवीन समस्येची नोंद करा"],
        ["Ask AI Assistant", "एआई सहायक से पूछें", "एआय सहाय्यकाला विचारा"],
        ["Get instant help", "तुरंत सहायता पाएं", "त्वरित मदत मिळवा"],
        ["Track Complaint", "शिकायत ट्रैक करें", "तक्रारीचा मागोवा घ्या"],
        ["View complaint progress", "शिकायत की प्रगति देखें", "तक्रारीची प्रगती पाहा"],
        ["WiFi not working in computer lab", "कंप्यूटर लैब में वाई-फ़ाई काम नहीं कर रहा", "संगणक प्रयोगशाळेत वाय-फाय चालत नाही"],
        ["Hostel water supply issue", "छात्रावास में पानी की आपूर्ति की समस्या", "वसतिगृहातील पाणीपुरवठ्याची समस्या"],
        ["Library printer not working", "पुस्तकालय का प्रिंटर काम नहीं कर रहा", "ग्रंथालयातील प्रिंटर चालत नाही"],
        ["Exam hall AC failure", "परीक्षा हॉल का एसी खराब", "परीक्षा हॉलमधील एसी बंद"],
        ["Canteen food quality complaint", "कैंटीन के भोजन की गुणवत्ता की शिकायत", "उपहारगृहातील अन्नाच्या गुणवत्तेबाबत तक्रार"],
        ["Computer Lab", "कंप्यूटर लैब", "संगणक प्रयोगशाळा"],
        ["Hostel Block C", "छात्रावास ब्लॉक C", "वसतिगृह ब्लॉक C"],
        ["Library Hall", "पुस्तकालय हॉल", "ग्रंथालय हॉल"],
        ["Exam Hall 2", "परीक्षा हॉल 2", "परीक्षा हॉल 2"],
        ["Main Canteen", "मुख्य कैंटीन", "मुख्य उपहारगृह"],
        ["IT Department", "आईटी विभाग", "आयटी विभाग"],
        ["CS Department", "सीएस विभाग", "सीएस विभाग"],
        ["Route the WiFi complaint to the CS support team with a quick response deadline.", "वाई-फ़ाई शिकायत को शीघ्र कार्रवाई की समय-सीमा के साथ सीएस सहायता टीम को भेजें।", "वाय-फाय तक्रार त्वरित प्रतिसादाच्या वेळेसह सीएस सहाय्य पथकाकडे पाठवा."],
        ["WiFi not working in Lab 3", "लैब 3 में वाई-फ़ाई काम नहीं कर रहा", "लॅब 3 मध्ये वाय-फाय चालत नाही"],
        ["#CMP-2026-0012 • 2 hours ago", "#CMP-2026-0012 • 2 घंटे पहले", "#CMP-2026-0012 • 2 तासांपूर्वी"],
        ["#CMP-2026-0011 • Yesterday", "#CMP-2026-0011 • कल", "#CMP-2026-0011 • काल"],
        ["#CMP-2026-0009 • 3 days ago", "#CMP-2026-0009 • 3 दिन पहले", "#CMP-2026-0009 • 3 दिवसांपूर्वी"],
        ["AI-Powered Grievance Management", "एआई-संचालित शिकायत प्रबंधन", "एआय-आधारित तक्रार व्यवस्थापन"],
        ["Your Complaint.", "आपकी शिकायत।", "तुमची तक्रार."],
        ["Our Intelligence.", "हमारी बुद्धिमत्ता।", "आमची बुद्धिमत्ता."],
        ["Features", "विशेषताएं", "वैशिष्ट्ये"],
        ["How It Works", "यह कैसे काम करता है", "हे कसे कार्य करते"],
        ["About", "परिचय", "माहिती"],
        ["Register Complaint", "शिकायत दर्ज करें", "तक्रार नोंदवा"],
        ["Explore System", "प्रणाली देखें", "प्रणाली पाहा"],
        ["Create Account", "खाता बनाएं", "खाते तयार करा"],
        ["INTELLIGENT FEATURES", "बुद्धिमान सुविधाएं", "बुद्धिमान वैशिष्ट्ये"],
        ["More Than Just a", "सिर्फ एक से बढ़कर", "फक्त एकापेक्षा अधिक"],
        ["Complaint Box", "शिकायत पेटी", "तक्रार पेटी"],
        ["Powerful AI technologies work together to make grievance management faster, smarter and transparent.", "शक्तिशाली एआई तकनीकें शिकायत प्रबंधन को तेज़, बेहतर और पारदर्शी बनाती हैं।", "प्रगत एआय तंत्रज्ञान तक्रार व्यवस्थापन अधिक जलद, स्मार्ट आणि पारदर्शक बनवते."],
        ["AI Classification", "एआई वर्गीकरण", "एआय वर्गीकरण"],
        ["Automatically identify complaint categories and forward them to the correct department.", "शिकायत की श्रेणी पहचानें और सही विभाग को भेजें।", "तक्रारीचा प्रकार ओळखून योग्य विभागाकडे पाठवा."],
        ["Sentiment Analysis", "भावना विश्लेषण", "भावना विश्लेषण"],
        ["Understand whether a complaint is normal, frustrated, angry or an emergency.", "समझें कि शिकायत सामान्य, निराशाजनक, गुस्से वाली या आपातकालीन है।", "तक्रार सामान्य, नाराजीची, संतप्त किंवा आपत्कालीन आहे हे समजून घ्या."],
        ["Smart Priority", "स्मार्ट प्राथमिकता", "स्मार्ट प्राधान्य"],
        ["AI determines whether your complaint requires low, medium, high or critical priority.", "एआई तय करता है कि शिकायत की प्राथमिकता कम, मध्यम, उच्च या अति आवश्यक है।", "तक्रारीचे प्राधान्य कमी, मध्यम, उच्च किंवा अत्यंत तातडीचे आहे हे एआय ठरवते."],
        ["Duplicate Detection", "दोहराई गई शिकायत पहचान", "पुनरावृत्ती तक्रार शोध"],
        ["Detect similar complaints and combine them into a single actionable issue.", "मिलती-जुलती शिकायतों को पहचानकर एक कार्रवाई योग्य समस्या में जोड़ें।", "समान तक्रारी शोधून एकाच कार्यवाहीयोग्य समस्येत एकत्र करा."],
        ["Voice Complaints", "आवाज़ से शिकायत", "आवाजाद्वारे तक्रारी"],
        ["Speak naturally and convert your voice into a complaint using speech recognition.", "बोलकर अपनी शिकायत दर्ज करें; वाणी पहचान इसे लिखित रूप में बदलेगी।", "नैसर्गिकपणे बोला आणि वाणी ओळख वापरून तक्रार नोंदवा."],
        ["Image Intelligence", "चित्र विश्लेषण", "प्रतिमा विश्लेषण"],
        ["Upload images of broken equipment, leakage, garbage or infrastructure problems.", "खराब उपकरण, रिसाव, कचरे या बुनियादी ढांचे की समस्या की तस्वीरें अपलोड करें।", "बिघडलेली उपकरणे, गळती, कचरा किंवा पायाभूत सुविधांच्या समस्यांचे फोटो अपलोड करा."],
        ["SIMPLE PROCESS", "सरल प्रक्रिया", "सोपी प्रक्रिया"],
        ["From Complaint to", "शिकायत से", "तक्रारीपासून"],
        ["Resolution", "समाधान", "निराकरण"],
        ["Submit", "जमा करें", "सबमिट करा"],
        ["Submit your complaint using text, voice or image.", "अपनी शिकायत टेक्स्ट, आवाज़ या तस्वीर से दर्ज करें।", "मजकूर, आवाज किंवा प्रतिमेद्वारे तक्रार नोंदवा."],
        ["AI analyzes category, sentiment, priority and similarity.", "एआई श्रेणी, भावना, प्राथमिकता और समानता का विश्लेषण करता है।", "एआय प्रकार, भावना, प्राधान्य आणि समानतेचे विश्लेषण करते."],
        ["Smart Routing", "स्मार्ट रूटिंग", "स्मार्ट मार्गीकरण"],
        ["Complaint is automatically sent to the responsible department.", "शिकायत अपने-आप जिम्मेदार विभाग को भेजी जाती है।", "तक्रार आपोआप जबाबदार विभागाकडे पाठवली जाते."],
        ["Track progress until the complaint is successfully resolved.", "शिकायत का समाधान होने तक प्रगति देखें।", "तक्रार निकाली निघेपर्यंत प्रगतीचा मागोवा घ्या."],
        ["WHY SMARTGRIEVANCE?", "स्मार्टग्रिवेंस क्यों?", "स्मार्टग्रिव्हन्स का?"],
        ["Building a better", "बेहतर बनाने की दिशा में", "अधिक चांगला"],
        ["campus experience.", "परिसर का अनुभव।", "कॅम्पस अनुभव घडवूया."],
        ["Traditional complaint books are slow, difficult to track and provide little transparency.", "पारंपरिक शिकायत पुस्तिकाएं धीमी हैं, उनका पता रखना कठिन है और पारदर्शिता कम है।", "पारंपरिक तक्रार पुस्तिका संथ आहेत, त्यांचा मागोवा घेणे कठीण आहे आणि पारदर्शकता कमी आहे."],
        ["SmartGrievance uses artificial intelligence to transform the entire complaint lifecycle into a transparent digital process.", "स्मार्टग्रिवेंस कृत्रिम बुद्धिमत्ता से शिकायत प्रक्रिया को पारदर्शी डिजिटल प्रणाली में बदलता है।", "स्मार्टग्रिव्हन्स कृत्रिम बुद्धिमत्तेच्या मदतीने संपूर्ण तक्रार प्रक्रिया पारदर्शक डिजिटल स्वरूपात बदलते."],
        ["✓ Faster complaint processing", "✓ शिकायतों पर तेज़ कार्रवाई", "✓ तक्रारींवर जलद कार्यवाही"],
        ["✓ Automatic department routing", "✓ विभाग को स्वतः भेजना", "✓ विभागाकडे स्वयंचलित पाठवणी"],
        ["✓ Transparent complaint tracking", "✓ पारदर्शी शिकायत ट्रैकिंग", "✓ पारदर्शक तक्रार मागोवा"],
        ["✓ AI-powered decision making", "✓ एआई-आधारित निर्णय", "✓ एआय-आधारित निर्णय"],
        ["AI Dashboard", "एआई डैशबोर्ड", "एआय डॅशबोर्ड"],
        ["● Live", "● लाइव", "● थेट"],
        ["GET STARTED", "शुरू करें", "सुरुवात करा"],
        ["Make your campus", "अपने परिसर को बनाएं", "तुमचा कॅम्पस बनवा"],
        ["smarter today.", "आज ही और स्मार्ट।", "आजच अधिक स्मार्ट."],
        ["Register and submit your first complaint.", "पंजीकरण करें और अपनी पहली शिकायत दर्ज करें।", "नोंदणी करा आणि पहिली तक्रार नोंदवा."],
        ["Create Account →", "खाता बनाएं →", "खाते तयार करा →"],
        ["AI-powered college grievance management.", "एआई-संचालित कॉलेज शिकायत प्रबंधन।", "एआय-आधारित महाविद्यालयीन तक्रार व्यवस्थापन."],
        ["Home", "होम", "मुख्यपृष्ठ"],
        ["Register", "पंजीकरण", "नोंदणी"],
        ["Full Name", "पूरा नाम", "पूर्ण नाव"],
        ["Email Address", "ईमेल पता", "ईमेल पत्ता"],
        ["Role", "भूमिका", "भूमिका"],
        ["Department / Program", "विभाग / पाठ्यक्रम", "विभाग / अभ्यासक्रम"],
        ["Select your department", "अपना विभाग चुनें", "तुमचा विभाग निवडा"],
        ["Computer Science (CS)", "कंप्यूटर विज्ञान (CS)", "संगणक विज्ञान (CS)"],
        ["Information Technology (IT)", "सूचना प्रौद्योगिकी (IT)", "माहिती तंत्रज्ञान (IT)"],
        ["Bachelor of Commerce (B.Com)", "बैचलर ऑफ कॉमर्स (B.Com)", "बॅचलर ऑफ कॉमर्स (B.Com)"],
        ["Bachelor of Management Studies (BMS)", "बैचलर ऑफ मैनेजमेंट स्टडीज़ (BMS)", "बॅचलर ऑफ मॅनेजमेंट स्टडीज (BMS)"],
        ["Bachelor of Accounting and Finance (BAF)", "बैचलर ऑफ अकाउंटिंग एंड फाइनेंस (BAF)", "बॅचलर ऑफ अकाउंटिंग अँड फायनान्स (BAF)"],
        ["Bachelor of Science (B.Sc)", "बैचलर ऑफ साइंस (B.Sc)", "बॅचलर ऑफ सायन्स (B.Sc)"],
        ["Preferred language", "पसंदीदा भाषा", "पसंतीची भाषा"],
        ["Password", "पासवर्ड", "पासवर्ड"],
        ["Confirm Password", "पासवर्ड की पुष्टि करें", "पासवर्डची पुष्टी करा"],
        ["Already have an account?", "पहले से खाता है?", "आधीच खाते आहे?"],
        ["Welcome Back", "वापसी पर स्वागत है", "पुन्हा स्वागत आहे"],
        ["Login to manage your complaints", "अपनी शिकायतें देखने के लिए लॉग इन करें", "तक्रारी व्यवस्थापित करण्यासाठी लॉग इन करा"],
        ["Remember me", "मुझे याद रखें", "मला लक्षात ठेवा"],
        ["Login to Dashboard", "डैशबोर्ड में लॉग इन करें", "डॅशबोर्डवर लॉग इन करा"],
        ["Continue with Google", "Google से जारी रखें", "Google वापरून पुढे जा"],
        ["Don't have an account?", "खाता नहीं है?", "खाते नाही?"],
        ["AI Complaint System", "एआई शिकायत प्रणाली", "एआय तक्रार प्रणाली"],
        ["Example: WiFi not working in computer lab", "उदाहरण: कंप्यूटर लैब में वाई-फ़ाई काम नहीं कर रहा", "उदाहरण: संगणक प्रयोगशाळेत वाय-फाय चालत नाही"],
        ["Explain what happened, where it happened and when you noticed the problem...", "बताएं कि क्या हुआ, कहां हुआ और आपको समस्या कब दिखी...", "काय घडले, कुठे घडले आणि समस्या कधी लक्षात आली ते सांगा..."],
        ["Enter your full name", "अपना पूरा नाम दर्ज करें", "तुमचे पूर्ण नाव लिहा"],
        ["Create password", "पासवर्ड बनाएं", "पासवर्ड तयार करा"],
        ["Confirm password", "पासवर्ड की पुष्टि करें", "पासवर्डची पुष्टी करा"],
        ["Enter your password", "अपना पासवर्ड दर्ज करें", "तुमचा पासवर्ड लिहा"],
        ,["Voice input is not supported in this browser.", "इस ब्राउज़र में आवाज़ से लिखना उपलब्ध नहीं है।", "या ब्राउझरमध्ये आवाजाद्वारे इनपुट उपलब्ध नाही."]
        ,["Type a question for the AI assistant.", "एआई सहायक के लिए सवाल लिखें।", "एआय सहाय्यकासाठी प्रश्न लिहा."]
        ,["Please describe the issue first so I can help you.", "मदद के लिए पहले समस्या का विवरण दें।", "मदत करण्यासाठी आधी समस्येचे वर्णन करा."]
        ,["Please complete the complaint title and description.", "शिकायत का शीर्षक और विवरण भरें।", "तक्रारीचे शीर्षक आणि वर्णन भरा."]
        ,["Please select the complaint location.", "शिकायत का स्थान चुनें।", "तक्रारीचे ठिकाण निवडा."]
        ,["Camera access was blocked. Please upload an image instead.", "कैमरा अनुमति नहीं मिली। कृपया तस्वीर अपलोड करें।", "कॅमेरा वापरण्याची परवानगी मिळाली नाही. कृपया प्रतिमा अपलोड करा."]
        ,["This browser does not support camera capture.", "यह ब्राउज़र कैमरा कैप्चर का समर्थन नहीं करता।", "हा ब्राउझर कॅमेरा वापरून फोटो घेण्यास समर्थन देत नाही."]
        ,["Camera image captured successfully", "कैमरे से तस्वीर सफलतापूर्वक ली गई", "कॅमेऱ्याने प्रतिमा यशस्वीरीत्या घेतली"]
        ,["Photo captured successfully.", "तस्वीर सफलतापूर्वक ली गई।", "फोटो यशस्वीरीत्या घेतला."]
        ,["Please upload an image file only.", "कृपया केवल तस्वीर अपलोड करें।", "कृपया फक्त प्रतिमा अपलोड करा."]
        ,["Image size should be under 5MB.", "तस्वीर का आकार 5MB से कम होना चाहिए।", "प्रतिमेचा आकार 5MB पेक्षा कमी असावा."]
        ,["Image uploaded successfully", "तस्वीर सफलतापूर्वक अपलोड हुई", "प्रतिमा यशस्वीरीत्या अपलोड झाली"]
        ,["Evidence uploaded successfully.", "सबूत सफलतापूर्वक अपलोड हुआ।", "पुरावा यशस्वीरीत्या अपलोड झाला."]
        ,["Voice text added successfully.", "आवाज़ से लिखा गया टेक्स्ट जोड़ा गया।", "आवाजेने लिहिलेला मजकूर जोडला."]
        ,["Voice input could not be captured. Please type manually.", "आवाज़ दर्ज नहीं हो सकी। कृपया खुद टाइप करें।", "आवाज नोंदवता आली नाही. कृपया स्वतः टाइप करा."]
        ,["Photo captured", "तस्वीर ली गई", "फोटो घेतला"]
        ,["Image uploaded successfully", "तस्वीर सफलतापूर्वक अपलोड हुई", "प्रतिमा यशस्वीरीत्या अपलोड झाली"]
        ,["Listening", "सुन रहा है", "ऐकत आहे"]
        ,["🔴 Listening", "🔴 सुन रहा है", "🔴 ऐकत आहे"]
        ,["Complaint analyzed and routed to", "शिकायत का विश्लेषण कर इसे भेजा गया:", "तक्रारीचे विश्लेषण करून ती येथे पाठवली:"]
        ,["Summarize this complaint", "इस शिकायत का सारांश बनाएं", "या तक्रारीचा सारांश द्या"]
        ,["Rewrite this complaint in a clearer and more professional tone", "इस शिकायत को स्पष्ट और पेशेवर तरीके से लिखें", "ही तक्रार अधिक स्पष्ट आणि व्यावसायिक भाषेत पुन्हा लिहा"]
        ,["Tell me the best escalation path for this issue", "इस समस्या को आगे भेजने का सही तरीका बताएं", "ही समस्या पुढे पाठवण्याचा योग्य मार्ग सांगा"]
        ,["Help me improve this complaint", "इस शिकायत को बेहतर बनाने में मदद करें", "ही तक्रार सुधारण्यात मदत करा"]
        ,["IT Department", "आईटी विभाग", "आयटी विभाग"]
        ,["Electrical Department", "विद्युत विभाग", "विद्युत विभाग"]
        ,["Maintenance Department", "रखरखाव विभाग", "देखभाल विभाग"]
        ,["Hostel Administration", "छात्रावास प्रशासन", "वसतिगृह प्रशासन"]
        ,["Library Services", "पुस्तकालय सेवाएं", "ग्रंथालय सेवा"]
        ,["Student Affairs", "छात्र कल्याण विभाग", "विद्यार्थी व्यवहार विभाग"]
        ,["Lab Services", "प्रयोगशाला सेवाएं", "प्रयोगशाळा सेवा"]
        ,["Examination Cell", "परीक्षा प्रकोष्ठ", "परीक्षा विभाग"]
        ,["Transport Office", "परिवहन कार्यालय", "वाहतूक कार्यालय"]
        ,["Student Support Desk", "छात्र सहायता केंद्र", "विद्यार्थी सहाय्य कक्ष"]
        ,["Complaint analyzed and routed to the relevant department.", "शिकायत का विश्लेषण कर संबंधित विभाग को भेज दिया गया।", "तक्रारीचे विश्लेषण करून संबंधित विभागाकडे पाठवले."]
        ,["CS Department", "सीएस विभाग", "सीएस विभाग"]
        ,["Electrical Department", "विद्युत विभाग", "विद्युत विभाग"]
        ,["Maintenance Department", "रखरखाव विभाग", "देखभाल विभाग"]
        ,["Hostel Administration", "छात्रावास प्रशासन", "वसतिगृह प्रशासन"]
        ,["Library Services", "पुस्तकालय सेवाएं", "ग्रंथालय सेवा"]
        ,["Student Affairs", "छात्र कल्याण विभाग", "विद्यार्थी व्यवहार विभाग"]
        ,["Lab Services", "प्रयोगशाला सेवाएं", "प्रयोगशाळा सेवा"]
        ,["Examination Cell", "परीक्षा प्रकोष्ठ", "परीक्षा विभाग"]
        ,["Transport Office", "परिवहन कार्यालय", "वाहतूक कार्यालय"]
        ,["Student Support Desk", "छात्र सहायता केंद्र", "विद्यार्थी सहाय्य कक्ष"]
        ,["Summary: A complaint has been reported for ", "सारांश: शिकायत दर्ज की गई है:", "सारांश: तक्रार नोंदवली आहे:"]
        ,["Rewritten complaint: ", "दोबारा लिखा गया शिकायत विवरण: ", "पुन्हा लिहिलेली तक्रार: "]
        ,["Escalation plan: Route this complaint to the ", "आगे भेजने की योजना: इस शिकायत को यहां भेजें: ", "पुढे पाठवण्याची योजना: ही तक्रार येथे पाठवा: "]
        ,["AI suggestion: Add precise dates, location details, and the exact impact on students so the complaint can be triaged faster and resolved more effectively.", "सुझाव: शिकायत को जल्दी समझने और हल करने के लिए सटीक तारीख, स्थान और छात्रों पर प्रभाव बताएं।", "सूचना: तक्रार लवकर समजून सोडवण्यासाठी अचूक तारीख, ठिकाण आणि विद्यार्थ्यांवरील परिणाम नमूद करा."]
        ,["Professional rewrite: ", "पेशेवर रूप में लिखा गया: ", "व्यावसायिक पुनर्लेखन: "]
        ,["Summary: ", "सारांश: ", "सारांश: "]
        ,["Escalation: Route this complaint to the ", "आगे भेजें: इस शिकायत को यहां भेजें: ", "पुढे पाठवा: ही तक्रार येथे पाठवा: "]
        ,["support desk, add the urgency level, and send a resolution timeline request within 24 hours. Include the location, impact, and student impact details in the ticket.", " सहायता डेस्क को भेजें, प्राथमिकता तय करें और 24 घंटे में समाधान का समय मांगें। टिकट में स्थान और छात्रों पर प्रभाव शामिल करें।", " सहाय्य कक्षाकडे पाठवा, प्राधान्य ठरवा आणि 24 तासांत निराकरणाची वेळ मागा. तक्रारीत ठिकाण आणि विद्यार्थ्यांवरील परिणाम नमूद करा."]
        ,["Suggested action", "सुझाई गई कार्रवाई", "सुचवलेली कृती"]
        ,["Escalation plan", "आगे भेजने की योजना", "पुढे पाठवण्याची योजना"]
        ,["Professional rewrite", "पेशेवर रूप में दोबारा लिखा गया", "व्यावसायिक पुनर्लेखन"]
        ,["Urgent", "तत्काल", "तातडीचे"]
        ,["Priority", "प्राथमिकता", "प्राधान्य"]
        ,["HIGH", "उच्च", "उच्च"]
        ,["MEDIUM", "मध्यम", "मध्यम"]
        ,["LOW", "कम", "कमी"]
        ,["follow-up", "अनुवर्ती कार्रवाई", "पुढील कार्यवाही"]
        ,["Urgent follow-up", "तत्काल कार्रवाई", "तातडीची कार्यवाही"]
        ,["Priority follow-up", "प्राथमिकता वाली कार्रवाई", "प्राधान्याची कार्यवाही"]
        ,["Routine follow-up", "नियमित कार्रवाई", "नियमित कार्यवाही"]
        ,["Frustrated sentiment", "निराशा की भावना", "नाराजीची भावना"]
        ,["Neutral sentiment", "तटस्थ भावना", "तटस्थ भावना"]
        ,["Concerned sentiment", "चिंता की भावना", "चिंतेची भावना"]
        ,["Routine", "सामान्य", "नियमित"]
        ,["Frustrated", "निराश", "नाराज"]
        ,["Neutral", "तटस्थ", "तटस्थ"]
        ,["Concerned", "चिंतित", "चिंतित"]
        ,["Check network routers and access points in the affected block.", "प्रभावित ब्लॉक के नेटवर्क राउटर और एक्सेस पॉइंट की जांच करें।", "प्रभावित ब्लॉकमधील नेटवर्क राउटर आणि ॲक्सेस पॉइंट तपासा."]
        ,["Prioritize bandwidth test and student device connectivity review.", "बैंडविड्थ और छात्रों के उपकरणों के कनेक्शन की प्राथमिकता से जांच करें।", "बँडविड्थ आणि विद्यार्थ्यांच्या उपकरणांच्या जोडणीची प्राधान्याने तपासणी करा."]
        ,["Inspect switchboards and power backup systems immediately.", "स्विचबोर्ड और बैकअप बिजली व्यवस्था की तुरंत जांच करें।", "स्विचबोर्ड आणि वीज बॅकअप प्रणालीची त्वरित तपासणी करा."]
        ,["Escalate to electrical maintenance if outage is repeated.", "बिजली बार-बार बंद हो तो इलेक्ट्रिकल मेंटेनेंस को भेजें।", "वीजपुरवठा वारंवार खंडित होत असल्यास विद्युत देखभाल विभागाकडे पाठवा."]
        ,["Verify tank and pipeline supply status for the affected floor.", "प्रभावित मंज़िल की टंकी और पाइपलाइन की जांच करें।", "प्रभावित मजल्यावरील टाकी आणि पाइपलाइनचा पुरवठा तपासा."]
        ,["Alert maintenance team to restore drinking water access.", "पीने के पानी की सुविधा बहाल करने के लिए मेंटेनेंस टीम को सूचित करें।", "पिण्याच्या पाण्याची सुविधा पूर्ववत करण्यासाठी देखभाल पथकाला कळवा."]
        ,["Review hostel room conditions and warden escalation log.", "छात्रावास के कमरों की स्थिति और वार्डन की शिकायतें देखें।", "वसतिगृहातील खोल्यांची स्थिती आणि वॉर्डनकडे पाठवलेल्या तक्रारी तपासा."]
        ,["Coordinate with housing office for urgent student support.", "छात्रों की तत्काल सहायता के लिए आवास कार्यालय से समन्वय करें।", "विद्यार्थ्यांना तातडीची मदत देण्यासाठी निवास कार्यालयाशी समन्वय साधा."]
        ,["Check library system logs and printer availability status.", "पुस्तकालय सिस्टम लॉग और प्रिंटर की उपलब्धता जांचें।", "ग्रंथालय प्रणालीचे लॉग आणि प्रिंटरची उपलब्धता तपासा."]
        ,["Arrange quick help desk support for study access.", "पढ़ाई की सुविधा के लिए हेल्प डेस्क की मदद उपलब्ध कराएं।", "अभ्यासासाठी हेल्प डेस्कची त्वरित मदत उपलब्ध करा."]
        ,["Inspect food quality and hygiene compliance records.", "भोजन की गुणवत्ता और स्वच्छता रिकॉर्ड की जांच करें।", "अन्नाची गुणवत्ता आणि स्वच्छतेच्या नोंदी तपासा."]
        ,["Coordinate with cafeteria management for corrective action.", "सुधारात्मक कार्रवाई के लिए कैंटीन प्रबंधन से संपर्क करें।", "सुधारात्मक कार्यवाहीसाठी उपहारगृह व्यवस्थापनाशी समन्वय साधा."]
        ,["Check equipment connectivity and lab inventory logs.", "उपकरणों के कनेक्शन और लैब इन्वेंटरी लॉग जांचें।", "उपकरणांची जोडणी आणि प्रयोगशाळेतील नोंदी तपासा."]
        ,["Schedule technician support for urgent experiment continuity.", "प्रयोग जारी रखने के लिए तकनीशियन की तत्काल सहायता तय करें।", "प्रयोग सुरू ठेवण्यासाठी तंत्रज्ञांची तातडीची मदत निश्चित करा."]
        ,["Review the issue with the examination controller and exam setup team.", "परीक्षा नियंत्रक और परीक्षा व्यवस्था टीम के साथ समस्या की समीक्षा करें।", "परीक्षा नियंत्रक आणि परीक्षा व्यवस्था पथकासोबत समस्येचा आढावा घ्या."]
        ,["Confirm a resolution timeline before the next test window.", "अगली परीक्षा से पहले समाधान का समय तय करें।", "पुढील परीक्षेपूर्वी निराकरणाची वेळ निश्चित करा."]
        ,["Verify route schedule and vehicle availability logs.", "मार्ग समय-सारणी और वाहनों की उपलब्धता जांचें।", "मार्गाचे वेळापत्रक आणि वाहनांची उपलब्धता तपासा."]
        ,["Coordinate with transport operator for service recovery.", "सेवा बहाल करने के लिए परिवहन संचालक से समन्वय करें।", "सेवा पूर्ववत करण्यासाठी वाहतूक संचालकाशी समन्वय साधा."]
        ,["Route the complaint to the support desk for triage.", "शिकायत को प्राथमिक जांच के लिए सहायता डेस्क पर भेजें।", "प्राथमिक तपासणीसाठी तक्रार सहाय्य कक्षाकडे पाठवा."]
        ,["Request additional student context if the issue remains unclear.", "समस्या स्पष्ट न हो तो छात्र से और जानकारी मांगें।", "समस्या स्पष्ट नसल्यास विद्यार्थ्याकडून अधिक माहिती मागवा."],
        ["Join the smart grievance platform", "स्मार्ट शिकायत मंच से जुड़ें", "स्मार्ट तक्रार मंचात सामील व्हा"],
        ["🔒 Your information is securely protected.", "🔒 आपकी जानकारी सुरक्षित रखी जाती है।", "🔒 तुमची माहिती सुरक्षित ठेवली जाते."],
        ["Login", "लॉग इन", "लॉग इन"],
        ["⚙ Settings", "⚙ सेटिंग्स", "⚙ सेटिंग्ज"],
        ["↪ Logout", "↪ लॉग आउट", "↪ बाहेर पडा"],
        ["↑ 3 from yesterday", "↑ कल से 3 अधिक", "↑ कालपेक्षा 3 अधिक"],
        ["Latest update", "नवीनतम अपडेट", "नवीनतम अपडेट"],
        ["Awaiting action", "कार्रवाई की प्रतीक्षा", "कृतीची प्रतीक्षा"],
        ["High priority", "उच्च प्राथमिकता", "उच्च प्राधान्य"],
        ["Urgent", "तत्काल", "तातडीचे"],
        ["Reminder", "रिमाइंडर", "स्मरणपत्र"],
        ["AI", "एआई", "एआय"],
        ["IT department assigned your WiFi complaint", "आईटी विभाग ने आपकी वाई-फ़ाई शिकायत संभाली", "आयटी विभागाने तुमची वाय-फाय तक्रार स्वीकारली"],
        ["Ask AI assistant...", "एआई सहायक से पूछें...", "एआय सहाय्यकाला विचारा..."],
        ["student@example.com", "student@example.com", "student@example.com"]
    ];

    const translations = { hi: {}, mr: {} };
    const englishByTranslation = { hi: {}, mr: {} };
    entries.forEach(function (entry) {
        translations.hi[entry[0]] = entry[1];
        translations.mr[entry[0]] = entry[2];
        if (!(entry[1] in englishByTranslation.hi)) {
            englishByTranslation.hi[entry[1]] = entry[0];
        }
        if (!(entry[2] in englishByTranslation.mr)) {
            englishByTranslation.mr[entry[2]] = entry[0];
        }
    });

    const languageNames = { en: "English", hi: "हिन्दी", mr: "मराठी" };
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();

    function translatePage(language) {
        const dictionary = translations[language] || {};
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;

        while ((node = walker.nextNode())) {
            if (!originalText.has(node)) {
                const initialText = node.nodeValue;
                const normalizedText = initialText.trim().replace(/\s+/g, " ");
                const sourceLanguage = document.documentElement.lang;
                const englishText = englishByTranslation[sourceLanguage] &&
                    englishByTranslation[sourceLanguage][normalizedText];
                originalText.set(node, englishText
                    ? initialText.replace(initialText.trim(), englishText)
                    : initialText);
            }
            const source = originalText.get(node);
            const leadingWhitespace = source.match(/^\s*/)[0];
            const trailingWhitespace = source.match(/\s*$/)[0];
            const sourceText = source.slice(leadingWhitespace.length, source.length - trailingWhitespace.length);
            if (!sourceText) {
                continue;
            }
            const translated = dictionary[sourceText.replace(/\s+/g, " ")];
            node.nodeValue = translated
                ? leadingWhitespace + translated + trailingWhitespace
                : source;
        }

        document.querySelectorAll("[placeholder], [aria-label]").forEach(function (element) {
            ["placeholder", "aria-label"].forEach(function (attribute) {
                if (!element.hasAttribute(attribute)) {
                    return;
                }
                let saved = originalAttributes.get(element);
                if (!saved) {
                    saved = {};
                    originalAttributes.set(element, saved);
                }
                if (!(attribute in saved)) {
                    saved[attribute] = element.getAttribute(attribute);
                }
                const source = saved[attribute];
                element.setAttribute(attribute, language === "en" ? source : (dictionary[source] || source));
            });
        });

        document.documentElement.lang = language;
        const pageTitles = {
            "Dashboard | SmartGrievance": ["डैशबोर्ड | SmartGrievance", "डॅशबोर्ड | SmartGrievance"],
            "Submit Complaint | SmartGrievance": ["शिकायत दर्ज करें | SmartGrievance", "तक्रार नोंदवा | SmartGrievance"],
            "My Complaints | SmartGrievance": ["मेरी शिकायतें | SmartGrievance", "माझ्या तक्रारी | SmartGrievance"],
            "Notifications | SmartGrievance": ["सूचनाएं | SmartGrievance", "सूचना | SmartGrievance"],
            "AI Assistant | SmartGrievance": ["एआई सहायक | SmartGrievance", "एआय सहाय्यक | SmartGrievance"],
            "Create Account | SmartGrievance": ["खाता बनाएं | SmartGrievance", "खाते तयार करा | SmartGrievance"],
            "Login | SmartGrievance": ["लॉग इन | SmartGrievance", "लॉग इन | SmartGrievance"]
        };
        const englishTitle = document.body.dataset.englishTitle ||
            (document.body.dataset.englishTitle = document.title);
        const translatedTitle = pageTitles[englishTitle];
        document.title = language === "hi" && translatedTitle
            ? translatedTitle[0]
            : language === "mr" && translatedTitle
                ? translatedTitle[1]
                : englishTitle;

        document.querySelectorAll(".language-switcher").forEach(function (select) {
            select.value = language;
        });
        const preferredLanguage = document.getElementById("preferredLanguage");
        if (preferredLanguage) {
            preferredLanguage.value = language;
        }
    }

    window.smartGrievanceTranslate = function (text) {
        const language = document.documentElement.lang;
        return translations[language] && translations[language][text]
            ? translations[language][text]
            : text;
    };

    function createLanguageSelect(className) {
        const select = document.createElement("select");
        select.className = className;
        select.setAttribute("aria-label", "Language");
        Object.keys(languageNames).forEach(function (language) {
            const option = document.createElement("option");
            option.value = language;
            option.textContent = languageNames[language];
            select.appendChild(option);
        });
        select.addEventListener("change", function () {
            localStorage.setItem("smartGrievanceLanguage", select.value);
            translatePage(select.value);
        });
        return select;
    }

    const savedLanguage = localStorage.getItem("smartGrievanceLanguage");
    const initialLanguage = Object.prototype.hasOwnProperty.call(languageNames, savedLanguage)
        ? savedLanguage
        : "en";
    const control = document.createElement("div");
    control.className = "language-control";
    const label = document.createElement("label");
    label.textContent = "Language";
    label.htmlFor = "siteLanguage";
    const globalSelect = createLanguageSelect("language-switcher");
    globalSelect.id = "siteLanguage";
    control.append(label, globalSelect);

    const host = document.querySelector(".header-actions") ||
        document.querySelector(".navbar") ||
        document.querySelector(".auth-brand");
    if (host) {
        if (host.classList.contains("navbar")) {
            host.appendChild(control);
        } else {
            host.prepend(control);
        }
    } else {
        document.body.prepend(control);
    }

    const preferredLanguage = document.getElementById("preferredLanguage");
    if (preferredLanguage) {
        preferredLanguage.value = initialLanguage;
        preferredLanguage.addEventListener("change", function () {
            localStorage.setItem("smartGrievanceLanguage", preferredLanguage.value);
            translatePage(preferredLanguage.value);
        });
    }

    translatePage(initialLanguage);

    const dynamicTextObserver = new MutationObserver(function (mutations) {
        if (mutations.some(function (mutation) { return mutation.addedNodes.length > 0; })) {
            translatePage(document.documentElement.lang);
        }
    });
    dynamicTextObserver.observe(document.body, { childList: true, subtree: true });
});
