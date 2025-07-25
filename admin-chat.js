const socket = io();
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

document.getElementById('adminLogout').onclick = function() {
    window.location.href = 'index.html';
};

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