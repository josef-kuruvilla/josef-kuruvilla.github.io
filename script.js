// Smooth scrolling
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
    if (navLinks.classList.contains('open')) navLinks.classList.remove('open');
  });
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.querySelector('i').classList.toggle('fa-sun');
  themeToggle.querySelector('i').classList.toggle('fa-moon');
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // animate skill bars when in view
      if (entry.target.id === 'skills') {
        document.querySelectorAll('.skill-progress').forEach(bar => {
          bar.style.width = bar.dataset.level;
        });
      }
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(sec => obs.observe(sec));

// Mobile nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Contact form handler
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thanks for reaching out, I’ll get back to you soon!');
  e.target.reset();
});
