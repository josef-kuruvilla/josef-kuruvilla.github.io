// Toggle chat overlay
const chatToggle = document.getElementById('chat-toggle');
const chatOverlay = document.getElementById('chat-overlay');
const chatClose  = document.getElementById('chat-close');
chatToggle.addEventListener('click', () => chatOverlay.classList.add('open'));
chatClose .addEventListener('click', () => chatOverlay.classList.remove('open'));

// Chat functionality
const chatBox   = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend  = document.getElementById('chat-send');

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});

function appendMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + (sender === 'You' ? 'user' : 'bot');

  const content = document.createElement('div');
  content.className = 'bubble-content';
  content.innerHTML = `<strong>${sender}</strong><p>${text}</p>`;

  bubble.appendChild(content);
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  appendMessage('You', msg);
  chatInput.value = '';

  // show typing indicator
  appendMessage('Joseph', '<em>typing...</em>');

  try {
    const res = await fetch('https://huggingface-chatbot.onrender.com/chat', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ message: msg })
    });
    if (!res.ok) throw new Error(res.statusText);
    const { reply } = await res.json();

    // replace typing indicator with real reply
    const typing = chatBox.querySelector('em').parentNode.parentNode;
    typing.remove();
    appendMessage('Joseph', reply);
  } catch(err) {
    appendMessage('Joseph', 'Sorry, something went wrong.');
    console.error(err);
  }
}
