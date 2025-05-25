const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  showTypingIndicator();

  try {
    const response = await fetch("https://huggingface-chatbot.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    removeTypingIndicator();
    appendMessage("Joseph", data.reply);
  } catch (error) {
    removeTypingIndicator();
    appendMessage("Error", error.message, true);
    console.error("Fetch error:", error);
  }
}

function appendMessage(sender, text, isError = false) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble " + (sender === "You" ? "user" : "bot");

  const content = document.createElement("div");
  content.className = "bubble-content";
  content.innerHTML = `<strong>${sender}</strong><p>${text}</p><span class="timestamp">${getCurrentTime()}</span>`;

  bubble.appendChild(avatar);
  bubble.appendChild(content);

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "chat-bubble bot typing";
  typing.id = "typing-indicator";

  const dots = document.createElement("div");
  dots.className = "bubble-content";
  dots.innerHTML = `<strong>Joseph</strong><p class="dots">...</p>`;

  typing.appendChild(avatar);
  typing.appendChild(dots);

  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
