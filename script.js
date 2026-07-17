// ======================================================
// AK TIWARI & ASSOCIATES
// AI LEGAL ASSISTANT
// Part 1
// ======================================================

// =========================
// DOM ELEMENTS
// =========================

const chat = document.getElementById("chat");
const input = document.getElementById("msg");

const popup = document.getElementById("popup");

const suggestionButtons =
document.querySelectorAll(".suggestions button");

const popularQuestions =
document.querySelectorAll(".questionList li");

const newChatBtn =
document.querySelector(".newChat");

// =========================
// STORAGE KEYS
// =========================

const CHAT_KEY = "legal_ai_chat";

const LOGIN_KEY = "legal_ai_login";

const CHAT_HISTORY_KEY = "userChats";

// =========================
// PAGE LOAD
// =========================

window.addEventListener("load", () => {

    loadChat();

    bindSuggestions();

    bindPopularQuestions();

    bindNewChat();

    showPopupLater();

});

// =========================
// LOAD CHAT
// =========================

function loadChat() {

    const savedChat =
        localStorage.getItem(CHAT_KEY);

    if (savedChat) {

        chat.innerHTML = savedChat;

        scrollBottom();

        return;

    }

    welcomeMessage();

}

// =========================
// WELCOME MESSAGE
// =========================

function welcomeMessage() {

    appendAI(`

# 👋 Welcome to AK Tiwari & Associates

I am your **AI Legal Assistant**.

You can ask questions related to:

- Divorce
- Maintenance
- Child Custody
- Domestic Violence
- Property Disputes
- Cheque Bounce
- FIR
- Bail
- Cyber Crime

How may I assist you today?

`);

}

// =========================
// NEW CHAT
// =========================

function bindNewChat() {

    if (!newChatBtn) return;

    newChatBtn.addEventListener(

        "click",

        () => {

            if (

                confirm(

                    "Start a new conversation?"

                )

            ) {

                localStorage.removeItem(CHAT_KEY);

                localStorage.removeItem(CHAT_HISTORY_KEY);

                chat.innerHTML = "";

                welcomeMessage();

            }

        }

    );

}

// =========================
// SUGGESTION BUTTONS
// =========================

function bindSuggestions() {

    suggestionButtons.forEach((button) => {

        button.addEventListener(

            "click",

            () => {

                input.value =

                    button.innerText;

                input.focus();

            }

        );

    });

}

// =========================
// POPULAR QUESTIONS
// =========================

function bindPopularQuestions() {

    popularQuestions.forEach((item) => {

        item.addEventListener(

            "click",

            () => {

                input.value =

                    item.innerText;

                input.focus();

            }

        );

    });

}

// =========================
// SAVE CHAT
// =========================

function saveChat() {

    localStorage.setItem(

        CHAT_KEY,

        chat.innerHTML

    );

}

// =========================
// AUTO SCROLL
// =========================

function scrollBottom() {

    chat.scrollTop =

        chat.scrollHeight;

}

// =========================
// APPEND USER
// =========================

function appendUser(message) {

    const div = document.createElement("div");

    div.className = "user fade";

    div.innerHTML = `

${message}

<div class="time">

${getTime()}

</div>

`;

    chat.appendChild(div);

    scrollBottom();

    saveChat();

}

// =========================
// APPEND AI
// =========================

function appendAI(message) {

    const div = document.createElement("div");

    div.className = "ai fade";

    div.innerHTML = marked.parse(message) +

        `

<div class="time">

${getTime()}

</div>

`;

    chat.appendChild(div);

    scrollBottom();

    saveChat();

}

// =========================
// TIME
// =========================

function getTime() {

    return new Date()

        .toLocaleTimeString(

            [],

            {

                hour: "2-digit",

                minute: "2-digit"

            }

        );

}

// =========================
// CLEAR CHAT
// =========================

function clearChat() {

    if (

        !confirm(

            "Are you sure you want to clear this conversation?"

        )

    ) return;

    localStorage.removeItem(CHAT_KEY);

    localStorage.removeItem(CHAT_HISTORY_KEY);

    chat.innerHTML = "";

    welcomeMessage();

}

// =========================
// SHOW LOGIN POPUP
// =========================

function showPopupLater() {

    setTimeout(() => {

        if (

            localStorage.getItem(LOGIN_KEY)

            !== "true"

        ) {

            popup.style.display = "flex";

        }

    }, 180000);

}

// =========================
// ENTER KEY
// =========================

input.addEventListener(

    "keydown",

    function (e) {

        if (

            e.key === "Enter"

        ) {

            e.preventDefault();

            sendMessage();

        }

    }
  // ======================================================
// PART 2
// AI CHAT
// ======================================================

// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    appendUser(message);

    input.value = "";

    showTyping();

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        removeTyping();

        appendAI(data.reply);

        saveConversation(message, data.reply);

    }

    catch (error) {

        console.error(error);

        removeTyping();

        appendAI(`
### ❌ Unable to connect

The AI server is currently unavailable.

Please try again after some time.
`);

    }

}

// =========================
// TYPING ANIMATION
// =========================

function showTyping() {

    removeTyping();

    const typing = document.createElement("div");

    typing.className = "ai";

    typing.id = "typing";

    typing.innerHTML = `

<div class="typing">

<span></span>
<span></span>
<span></span>

</div>

<div class="time">

Typing...

</div>

`;

    chat.appendChild(typing);

    scrollBottom();

}

// =========================
// REMOVE TYPING
// =========================

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) {

        typing.remove();

    }

}

// =========================
// SAVE HISTORY
// =========================

function saveConversation(question, answer) {

    let history = JSON.parse(

        localStorage.getItem(CHAT_HISTORY_KEY)

        || "[]"

    );

    history.push({

        question,

        answer,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(

        CHAT_HISTORY_KEY,

        JSON.stringify(history)

    );

}

// =========================
// COPY AI MESSAGE
// =========================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("copyBtn")) return;

    const message =

        e.target.parentElement.innerText;

    navigator.clipboard.writeText(message);

    e.target.innerHTML = "Copied ✓";

    setTimeout(() => {

        e.target.innerHTML = "Copy";

    }, 1500);

});

// =========================
// REGENERATE
// =========================

async function regenerateResponse(question) {

    input.value = question;

    sendMessage();

}

// =========================
// LOADING BUTTON
// =========================

function disableInput() {

    input.disabled = true;

}

function enableInput() {

    input.disabled = false;

    input.focus();

}

// =========================
// UPDATE SEND MESSAGE
// =========================

// sendMessage() ke start me

// disableInput();

// aur finally me

// enableInput();

// add karna.

);
// ======================================================
// PART 3
// LOGIN + VOICE + UTILITIES
// ======================================================

// =========================
// UPDATE AI MESSAGE
// =========================

function appendAI(message) {

    const div = document.createElement("div");

    div.className = "ai fade";

    div.innerHTML = `

${marked.parse(message)}

<div class="messageActions">

<button class="copyBtn">

<i class="fa-regular fa-copy"></i>

Copy

</button>

</div>

<div class="time">

${getTime()}

</div>

`;

    chat.appendChild(div);

    scrollBottom();

    saveChat();

}

// =========================
// LOGIN
// =========================

async function submitLead() {

    const name =

        document.getElementById("name")

        .value.trim();

    const phone =

        document.getElementById("phone")

        .value.trim();

    if (name.length < 2) {

        alert("Please enter your name.");

        return;

    }

    if (!/^[6-9]\d{9}$/.test(phone)) {

        alert("Enter a valid mobile number.");

        return;

    }

    const chats = JSON.parse(

        localStorage.getItem(CHAT_HISTORY_KEY)

        || "[]"

    );

    try {

        await fetch(

"https://script.google.com/macros/s/AKfycbxY94PtzZ8uWTvO-Hrd9pASGW0dmHMwGlITLwRVcEv9RMnHZ-TKuLabfgIapUmF0LaQvg/exec",

            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type": "text/plain"

                },

                body: JSON.stringify({

                    name,

                    phone,

                    chats

                })

            }

        );

    }

    catch (e) {

        console.log(e);

    }

    localStorage.setItem(

        LOGIN_KEY,

        "true"

    );

    localStorage.setItem(

        "legal_name",

        name

    );

    localStorage.setItem(

        "legal_phone",

        phone

    );

    popup.style.display = "none";

    alert("Welcome " + name);

}

// =========================
// VOICE
// =========================

function startVoice() {

    if (

        !("webkitSpeechRecognition" in window) &&

        !("SpeechRecognition" in window)

    ) {

        alert(

            "Voice recognition not supported."

        );

        return;

    }

    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

    const recognition =

        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function (e) {

        input.value =

            e.results[0][0].transcript;

        input.focus();

    };

    recognition.onerror = function () {

        alert("Voice recognition failed.");

    };

}

// =========================
// COPY BUTTON
// =========================

document.addEventListener(

    "click",

    function (e) {

        const btn =

            e.target.closest(".copyBtn");

        if (!btn) return;

        const text =

            btn.parentElement.parentElement.innerText;

        navigator.clipboard.writeText(text);

        btn.innerHTML =

            '<i class="fa-solid fa-check"></i> Copied';

        setTimeout(() => {

            btn.innerHTML =

                '<i class="fa-regular fa-copy"></i> Copy';

        }, 2000);

    }

);

// =========================
// SUGGESTIONS
// =========================

suggestionButtons.forEach(button => {

    button.addEventListener("click", () => {

        input.value =

            button.innerText;

        sendMessage();

    });

});

// =========================
// POPULAR QUESTIONS
// =========================

popularQuestions.forEach(item => {

    item.addEventListener("click", () => {

        input.value =

            item.innerText;

        sendMessage();

    });

});

// =========================
// AUTO RESIZE
// =========================

input.addEventListener(

    "input",

    () => {

        input.style.height = "58px";

        input.style.height =

            input.scrollHeight + "px";

    }

);

// =========================
// PAGE REFRESH
// =========================

window.addEventListener(

    "beforeunload",

    saveChat

);

// =========================
// INIT
// =========================

scrollBottom();

console.log(

"⚖ AK Tiwari & Associates Legal AI Loaded"

);
