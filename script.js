// Плавный скролл к секции "Обо мне"
function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// --- Переключение темы ---
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getSystemTheme() {
    return prefersDark.matches ? 'dark' : 'light';
}

function applyTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
    } else {
        setTheme(getSystemTheme());
    }
}

applyTheme();
prefersDark.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) setTheme(getSystemTheme());
});

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- Анимация появления секций и карточек при скролле ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15
});
document.querySelectorAll('.about, .skills, .projects, .contact').forEach(section => {
    observer.observe(section);
});
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// --- Анимация логотипа при загрузке ---
window.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    logo.animate([
        { letterSpacing: '0px', opacity: 0 },
        { letterSpacing: '2px', opacity: 1 }
    ], {
        duration: 1200,
        fill: 'forwards',
        easing: 'cubic-bezier(.77,0,.18,1)'
    });
});

// --- Мини-чат ---
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
window.addEventListener('DOMContentLoaded', () => {
    // --- Админ модал ---
    const logo = document.querySelector('.logo');
    const adminModal = document.getElementById('adminModal');
    const adminClose = document.getElementById('adminClose');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLogin = document.getElementById('adminLogin');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const admin404 = document.getElementById('admin404');
    let clickCount = 0;
    let clickTimer = null;
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 1) {
                clickTimer = setTimeout(() => { clickCount = 0; }, 600);
            }
            if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                adminModal.classList.add('open');
                adminLogin.value = '';
                adminPassword.value = '';
                adminError.textContent = '';
            }
        });
    }
    if (adminClose) {
        adminClose.addEventListener('click', () => {
            adminModal.classList.remove('open');
        });
    }
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminLogin.value === '89651125850' && adminPassword.value === '31102007') {
                adminModal.classList.remove('open');
                window.location.href = 'admin.html';
            } else {
                adminError.textContent = 'Неверный логин или пароль';
            }
        });
    }
    if (admin404) {
        admin404.addEventListener('click', () => {
            admin404.classList.remove('open');
        });
    }
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWidget.classList.toggle('open');
            if (chatWidget.classList.contains('open')) {
                localStorage.setItem('chatOpen', 'true');
            } else {
                localStorage.setItem('chatOpen', 'false');
            }
        });
    }
    const chatClose = document.getElementById('chatClose');
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWidget.classList.remove('open');
            localStorage.setItem('chatOpen', 'false');
        });
    }
    // --- Чат для пользователей ---
    const userChatForm = document.getElementById('userChatForm');
    if (userChatForm) {
        userChatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('userPhone').value.trim();
            const text = document.getElementById('userMessage').value.trim();
            if (!name || !phone || !text) return;
            const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            messages.push({
                name,
                phone,
                text,
                unread: true,
                time: new Date().toLocaleString(),
                chatOpen: true
            });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            userChatForm.reset();
            const notif = document.getElementById('userChatNotif');
            if (notif) {
                notif.textContent = 'Сообщение отправлено!';
                setTimeout(() => notif.textContent = '', 2000);
            }
            // Открываем чат после отправки
            chatWidget.classList.add('open');
            localStorage.setItem('chatOpen', 'true');
        });
    }
    // Открываем чат если chatOpen:true
    if (localStorage.getItem('chatOpen') === 'true') {
        chatWidget.classList.add('open');
    }
}); 




