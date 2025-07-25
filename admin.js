function getMessages() {
    return JSON.parse(localStorage.getItem('chatMessages') || '[]');
}
function setMessages(messages) {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}
function renderMessages() {
    const list = document.getElementById('adminChatList');
    const messages = getMessages();
    list.innerHTML = '';
    if (messages.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#aaa;">Нет сообщений</div>';
        return;
    }
    messages.forEach((msg, i) => {
        let classes = 'admin-message';
        if (msg.unread) classes += ' unread';
        if (msg.chatOpen) classes += ' online';
        const div = document.createElement('div');
        div.className = classes;
        div.innerHTML = `
            <div class="admin-msg-header">${msg.name || 'Аноним'}</div>
            <div class="admin-msg-phone">${msg.phone || 'Без номера'}</div>
            <div class="admin-msg-text">${msg.text}</div>
            <div class="admin-msg-time">${msg.time || ''}</div>
        `;
        div.onclick = () => {
            if (msg.unread) {
                messages[i].unread = false;
                setMessages(messages);
                renderMessages();
            }
            if (msg.chatOpen) {
                openReplyModal(msg, i);
            }
        };
        list.appendChild(div);
    });
}
// Модал для ответа
function openReplyModal(msg, idx) {
    let modal = document.getElementById('adminReplyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adminReplyModal';
        modal.className = 'admin-reply-modal';
        modal.innerHTML = `
            <div class="admin-reply-content">
                <h2>Ответ пользователю</h2>
                <div><b>${msg.name}</b> (${msg.phone})</div>
                <div style="margin:10px 0 18px 0;">${msg.text}</div>
                <form id="adminReplyForm">
                    <textarea id="adminReplyText" placeholder="Ваш ответ..." required></textarea>
                    <button type="submit">Отправить</button>
                </form>
                <button class="admin-reply-close" id="adminReplyClose">×</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.getElementById('adminReplyClose').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('adminReplyForm').onsubmit = function(e) {
        e.preventDefault();
        // Здесь можно реализовать отправку ответа (например, сохранить в localStorage или показать уведомление)
        alert('Ответ отправлен (имитация)');
        modal.style.display = 'none';
    };
}
document.getElementById('adminLogout').onclick = function() {
    window.location.href = 'index.html';
};
document.getElementById('adminDownload').onclick = function() {
    const messages = getMessages();
    if (!messages.length) return alert('Нет сообщений для экспорта!');
    const csvRows = [
        'Имя,Телефон,Время,Сообщение'
    ];
    messages.forEach(msg => {
        const row = [
            '"' + (msg.name || '') + '"',
            '"' + (msg.phone || '') + '"',
            '"' + (msg.time || '') + '"',
            '"' + (msg.text || '').replace(/"/g, '""') + '"'
        ].join(',');
        csvRows.push(row);
    });
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
};
window.onload = renderMessages; 