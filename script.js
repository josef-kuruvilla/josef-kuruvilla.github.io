const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  try {
    const response = await fetch("https://huggingface-chatbot.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    appendMessage("Joseph", data.reply);
  } catch (error) {
    appendMessage("Error", error.message, true);
    console.error("Error fetching from backend:", error);
  }
}

// Append message to chat box and scroll to bottom
function appendMessage(sender, text, isError = false) {
  const msg = document.createElement("p");
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  if (isError) msg.style.color = "red";
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Allow sending messages with Enter key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission if inside a form
    sendMessage();
  }
});
