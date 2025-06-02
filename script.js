// DOM Elements
const chatToggle = document.getElementById('chat-toggle');
const chatOverlay = document.getElementById('chat-overlay');
const chatClose = document.getElementById('chat-close');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Welcome message options
const welcomeMessages = [
  `Hey there! 👋 I'm JosephBot, your friendly digital buddy.<br>Wondering what to ask? Try one of these:<br>
   • My career journey<br>
   • Why I'm a good fit for your company and role<br>
   • Cool projects I've worked on<br>
   • My hobbies<br>
   • Or surprise me with something fun!`,

  `Hello! 😊 Curious about who I am?<br>You could ask my digital brain about:<br>
   • My career journey<br>
   • Why I'm a good fit for your company and role<br>
   • Cool projects I've worked on<br>
   • My hobbies<br>
   • Or anything else — I'm all ears!`,

  `Hi there! I'm JosephBot, at your service.<br>Need a starting point? You could ask about:<br>
   • My career journey<br>
   • Why I'm a good fit for your company and role<br>
   • Cool projects I've worked on<br>
   • My hobbies<br>
   • Or just throw me a curveball!`
];

// Event: open chatbot with welcome message
chatToggle.addEventListener('click', () => {
  chatOverlay.classList.add('open');

  // Show random welcome message if chat is empty
  if (chatBox.children.length === 0) {
    const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    showTypingIndicator().then(() => typeMessage('Joseph', message));
  }
});

chatClose.addEventListener('click', () => chatOverlay.classList.remove('open'));

// Input events
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Append message to chat box with typing animation
async function typeMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + (sender === 'You' ? 'user' : 'bot');

  const content = document.createElement('div');
  content.className = 'bubble-content';
  content.innerHTML = `<strong>${sender}</strong><p></p>`;
  bubble.appendChild(content);
  chatBox.appendChild(bubble);

  const p = content.querySelector('p');
let buffer = '';

  for (let i = 0; i < text.length; i++) {
    buffer += text[i];
    p.innerHTML = buffer; // allows <br> to be rendered properly
    await new Promise(r => setTimeout(r, 10)); // typing speed
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Show typing indicator (returns a promise that resolves after delay)
function showTypingIndicator() {
  return new Promise(resolve => {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.id = 'typing-indicator';

    const content = document.createElement('div');
    content.className = 'bubble-content';
    content.innerHTML = `<strong>Joseph</strong><p class="dots">...</p>`;

    bubble.appendChild(content);
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      bubble.remove();
      resolve();
    }, 800); // Simulate typing delay
  });
}

// Append user message and fetch bot reply
async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  await typeMessage('You', msg);
  chatInput.value = '';

  await showTypingIndicator();

  try {
    const res = await fetch('https://huggingface-chatbot.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    if (!res.ok) throw new Error(res.statusText);
    const { reply } = await res.json();
    await typeMessage('Joseph', reply);
  } catch (err) {
    await typeMessage('Joseph', 'Sorry, something went wrong.');
    console.error(err);
  }
}
