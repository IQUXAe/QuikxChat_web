// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    themeIcon.textContent = prefersDark ? '🌙' : '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
        
        // Update screenshots
        document.querySelectorAll('picture source').forEach(source => {
            if (newTheme === 'light') {
                source.media = '(min-width: 0px)';
            } else {
                source.media = '(max-width: 0px)';
            }
        });
    });
}

// Update real time in status bar
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

updateTime();
setInterval(updateTime, 1000);

// Interactive phone demo
const inputContainer = document.querySelector('.input-container');
const inputText = document.querySelector('.input-text');
const sendButton = document.querySelector('.send-button');
const chatPreview = document.querySelector('.chat-preview');

if (inputContainer && sendButton && chatPreview) {
    // Make input editable
    inputText.contentEditable = true;
    inputText.style.outline = 'none';
    inputText.setAttribute('data-placeholder', 'Message...');
    inputText.textContent = '';
    
    inputText.addEventListener('focus', () => {
        inputContainer.classList.add('active');
    });
    
    inputText.addEventListener('blur', () => {
        inputContainer.classList.remove('active');
    });
    
    inputText.addEventListener('input', () => {
        // Limit to 60 characters
        if (inputText.textContent.length > 60) {
            inputText.textContent = inputText.textContent.substring(0, 60);
            // Move cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(inputText);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        
        const hasText = inputText.textContent.trim() !== '';
        if (hasText) {
            sendButton.innerHTML = '➤';
        } else {
            sendButton.innerHTML = '🎤';
        }
    });
    
    sendButton.addEventListener('click', () => {
        const message = inputText.textContent.trim();
        if (message) {
            const now = new Date();
            const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            const messageEl = document.createElement('div');
            messageEl.className = 'message sent';
            messageEl.innerHTML = `<span>${message}</span><span class="message-time">${time}</span>`;
            
            chatPreview.appendChild(messageEl);
            chatPreview.scrollTop = chatPreview.scrollHeight;
            
            inputText.textContent = '';
            sendButton.innerHTML = '🎤';
        }
    });
    
    // Send on Enter
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Screenshot modal
const modal = document.createElement('div');
modal.className = 'screenshot-modal';
modal.innerHTML = `
    <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img class="modal-img" src="" alt="Screenshot">
    </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector('.modal-img');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.screenshot-img').forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .download-card, .stat-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
