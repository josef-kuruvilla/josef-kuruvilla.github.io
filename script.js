async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  input.value = "";

  if (!message) return; // Don't send empty messages

  document.getElementById("chat-box").innerHTML += `<p><b>You:</b> ${message}</p>`;

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
    document.getElementById("chat-box").innerHTML += `<p><b>Joseph:</b> ${data.reply}</p>`;
  } catch (error) {
    document.getElementById("chat-box").innerHTML += `<p style="color:red;"><b>Error:</b> ${error.message}</p>`;
    console.error("Error fetching from backend:", error);
  }
}
