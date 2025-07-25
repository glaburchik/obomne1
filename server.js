const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.static(__dirname)); // чтобы отдавать index.html, admin.html и т.д.

let users = {}; // { socketId: { name, phone } }
let messages = {}; // { userPhone: [ {from, text, time, name?} ] }

io.on('connection', (socket) => {
  // Пользователь подключился
  socket.on('user-join', ({ name, phone }) => {
    users[socket.id] = { name, phone };
    if (!messages[phone]) messages[phone] = [];
    socket.emit('chat-history', messages[phone]);
    io.emit('user-list', getUserList());
  });

  // Пользователь отправил сообщение
  socket.on('user-message', ({ name, phone, text }) => {
    const msg = { from: 'user', name, phone, text, time: new Date().toLocaleString() };
    if (!messages[phone]) messages[phone] = [];
    messages[phone].push(msg);
    io.emit('new-message', { phone, msg });
  });

  // Админ отправил сообщение
  socket.on('admin-message', ({ phone, text }) => {
    const msg = { from: 'admin', text, time: new Date().toLocaleString() };
    if (!messages[phone]) messages[phone] = [];
    messages[phone].push(msg);
    io.emit('new-message', { phone, msg });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user-list', getUserList());
  });
});

function getUserList() {
  // Список уникальных пользователей по телефону
  return Object.values(users)
    .reduce((acc, u) => {
      if (!acc.find(x => x.phone === u.phone)) acc.push(u);
      return acc;
    }, []);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server started on port', PORT)); 