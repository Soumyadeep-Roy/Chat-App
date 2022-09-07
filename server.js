const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3030;
const users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () =>{
      console.log('user disconnected');
      socket.broadcast.emit('user-disconnected-chat', users[socket.id]);
      delete users[socket.id] ;
    });
    socket.on('send-msg', msg =>{
      socket.broadcast.emit('chat-msg', {msg:msg, name: users[socket.id]});
    });
    socket.on('new-user', name =>{
      users[socket.id] = name;
      socket.broadcast.emit('user-joined-chat', name);
    });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});