// Node server which will handle socker io connections
const port = 80;
const path = require("path");
const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname,"../../chat app")));
app.get("*",(req,res)=>{

    res.sendFile(path.join(__dirname,"../index.html"));
})
const server = require("http").createServer(app);
const io = require('socket.io')(server);

const users = {};

io.on('connection', Socket =>{
    console.log("Hey i am new");
    Socket.on('new-user-joined', name =>{
    console.log("New user",name);
        users[Socket.id] = name;
        Socket.broadcast.emit('user-joined', name);
    });

    Socket.on('send', message =>{
        Socket.broadcast.emit('receive', {message: message, name: users[Socket.id]})
    });
    Socket.on('disconnect', message =>{
        Socket.broadcast.emit('left', users[Socket.id]);
        delete users[Socket.id];
    });
})

server.listen(port,()=>{
    console.log("Server is running on port "+port);
});