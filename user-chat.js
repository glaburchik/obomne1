const socket = io();
let userName = '';
let userPhone = '';

function renderUserChat(messages) {
    const chatBox = document.getElementById('userChatBox');
    chatBox.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'user-msg ' + (msg.from === 'admin' ? 'admin' : 'user');
        div.innerHTML = `<div class="user-msg-text">${msg.text}</div><div class="user-msg-time">${msg.time || ''}</div>`;
        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function joinUserChat() {
    userName = document.getElementById('userName').value.trim();
    userPhone = document.getElementById('userPhone').value.trim();
    if (!userName || !userPhone) return false;
    socket.emit('user-join', { name: userName, phone: userPhone });
    document.getElementById('userChatLogin').style.display = 'none';
    document.getElementById('userChatMain').style.display = 'block';
    return false;
}

document.getElementById('userChatLoginForm').onsubmit = function(e) {
    e.preventDefault();
    joinUserChat();
};

document.getElementById('userChatForm').onsubmit = function(e) {
    e.preventDefault();
    const text = document.getElementById('userMessage').value.trim();
    if (!text) return;
    socket.emit('user-message', { name: userName, phone: userPhone, text });
    document.getElementById('userMessage').value = '';
};

socket.on('chat-history', (messages) => {
    renderUserChat(messages);
});
socket.on('new-message', ({ phone, msg }) => {
    if (phone === userPhone) {
        const chatBox = document.getElementById('userChatBox');
        const div = document.createElement('div');
        div.className = 'user-msg ' + (msg.from === 'admin' ? 'admin' : 'user');
        div.innerHTML = `<div class="user-msg-text">${msg.text}</div><div class="user-msg-time">${msg.time || ''}</div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

// --- Вход администратора по 3 кликам по логотипу ---
window.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const adminModal = document.getElementById('adminModal');
    const adminClose = document.getElementById('adminClose');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLogin = document.getElementById('adminLogin');
    const adminPassword = document.getElementById('adminPassword');
    const adminError = document.getElementById('adminError');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminSidebarClose = document.getElementById('adminSidebarClose');
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
                adminSidebar.classList.add('open');
                initAdminSidebarChat();
            } else {
                adminError.textContent = 'Неверный логин или пароль';
            }
        });
    }
    if (adminSidebarClose) {
        adminSidebarClose.addEventListener('click', () => {
            adminSidebar.classList.remove('open');
        });
    }
});

// --- Админ-чат в боковой панели ---
function initAdminSidebarChat() {
    // Используем глобальный socket
    let currentPhone = '';
    let userList = [];
    let allMessages = {};
    function renderUserList() {
        const list = document.getElementById('adminUserList');
        list.innerHTML = '';
        userList.forEach(u => {
            const li = document.createElement('li');
            li.textContent = `${u.name} (${u.phone})`;
            li.className = (u.phone === currentPhone ? 'active' : '');
            li.onclick = () => {
                currentPhone = u.phone;
                renderUserList();
                renderAdminChat();
                socket.emit('user-join', { name: u.name, phone: u.phone });
            };
            list.appendChild(li);
        });
    }
    function renderAdminChat() {
        const chatBox = document.getElementById('adminChatBox');
        chatBox.innerHTML = '';
        const messages = allMessages[currentPhone] || [];
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'admin-msg ' + (msg.from === 'admin' ? 'admin' : 'user');
            div.innerHTML = `<div class="admin-msg-text">${msg.text}</div><div class="admin-msg-time">${msg.time || ''}</div>`;
            chatBox.appendChild(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    document.getElementById('adminMsgForm').onsubmit = function(e) {
        e.preventDefault();
        const text = document.getElementById('adminMsgInput').value.trim();
        if (!text || !currentPhone) return;
        socket.emit('admin-message', { phone: currentPhone, text });
        document.getElementById('adminMsgInput').value = '';
    };
    socket.on('user-list', (list) => {
        userList = list;
        renderUserList();
    });
    socket.on('new-message', ({ phone, msg }) => {
        if (!allMessages[phone]) allMessages[phone] = [];
        allMessages[phone].push(msg);
        if (phone === currentPhone) renderAdminChat();
    });
    socket.on('chat-history', (messages) => {
        if (!currentPhone) return;
        allMessages[currentPhone] = messages;
        renderAdminChat();
    });
}

// --- Лоадер с процентами (строго 10 секунд) ---
(function(){
    let percent = 0;
    const loader = document.getElementById('siteLoader');
    const percentEl = document.getElementById('loaderPercent');
    function setPercent(val) {
        percent = val;
        if (percentEl) percentEl.textContent = (percent * 10) + '%';
    }
    let interval = setInterval(() => {
        if (percent < 10) {
            setPercent(percent + 1);
        } else {
            clearInterval(interval);
            if (loader) loader.classList.add('hide');
        }
    }, 1000);
})();

window.addEventListener('load', () => {
    const loader = document.getElementById('siteLoader');
    if (loader) loader.classList.add('hide');
}); 