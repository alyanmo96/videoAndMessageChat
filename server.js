const express = require('express');
const app = express();
const http =require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

http.listen(PORT,()=>{
    console.log('Listing on port: '+PORT);
});
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
});

io.on('connection', (socket)=>{
    socket.on('chat', (data)=>{
        io.sockets.emit('chat', data)
    });
}); 