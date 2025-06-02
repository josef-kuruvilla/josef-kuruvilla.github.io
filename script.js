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

  `Hi there! I'm JosephBot, at your service.<br>Need a starting point? You could ask about:<br>
   • My career journey<br>
   • Why I'm a good fit for your company and role<br>
   • Cool projects I've worked on<br>
   • My hobbies<br>
   • Or just throw me a curveball!`
];

// Flags for first message
let isFirstMessage = true;
let firstBotBubble = null;
let dotInterval = null;

// Event: open chatbot with welcome message
chatToggle.addEventListener('click', () => {
  chatOverlay.classList.add('open');

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

// Typing animation
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
    p.innerHTML = buffer;
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

// Send message and fetch bot reply
async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  await typeMessage('You', msg);
  chatInput.value = '';

  await showTypingIndicator();

  if (isFirstMessage) {
    // Show placeholder bubble with animated dots
    firstBotBubble = document.createElement('div');
    firstBotBubble.className = 'chat-bubble bot';

    const content = document.createElement('div');
    content.className = 'bubble-content';
    content.innerHTML = `<strong>Joseph</strong><p class="dots">First response will take a few seconds. Thinking<span>.</span></p>`;

    firstBotBubble.appendChild(content);
    chatBox.appendChild(firstBotBubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Animate the dots (Thinking... → .... → .....)
    const span = content.querySelector('span');
    let dotCount = 1;
    dotInterval = setInterval(() => {
      span.textContent = '.'.repeat(dotCount);
      dotCount = dotCount === 3 ? 1 : dotCount + 1;
    }, 400);
  }

  try {
    const res = await fetch('https://huggingface-chatbot.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });

    if (!res.ok) throw new Error(res.statusText);
    const { reply } = await res.json();

    if (isFirstMessage && firstBotBubble) {
      clearInterval(dotInterval);
      const p = firstBotBubble.querySelector('p');
      p.innerHTML = ''; // clear dots
      let buffer = '';
      for (let i = 0; i < reply.length; i++) {
        buffer += reply[i];
        p.innerHTML = buffer;
        await new Promise(r => setTimeout(r, 10));
        chatBox.scrollTop = chatBox.scrollHeight;
      }
      firstBotBubble = null;
      isFirstMessage = false;
    } else {
      await typeMessage('Joseph', reply);
    }
  } catch (err) {
    if (isFirstMessage && firstBotBubble) {
      clearInterval(dotInterval);
      firstBotBubble.querySelector('p').innerText = 'Sorry, something went wrong.';
      firstBotBubble = null;
      isFirstMessage = false;
    } else {
      await typeMessage('Joseph', 'Sorry, something went wrong.');
    }
    console.error(err);
  }
}
