document.getElementById('theme-toggle').onclick=()=>{
  document.body.classList.toggle('dark-mode');
};

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value;
  input.value = "";

  document.getElementById("chat-box").innerHTML += `<p><b>You:</b> ${message}</p>`;

  const response = await fetch("https://YOUR_RENDER_URL/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message})
  });

  const data = await response.json();
  document.getElementById("chat-box").innerHTML += `<p><b>Assistant:</b> ${data.reply}</p>`;
}
