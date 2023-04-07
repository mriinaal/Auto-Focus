const express = require('express');
const app = express();

const path = require('path');

const colors = require('colors');

require('dotenv').config()
const port = process.env.PORT;

const server = require('http').Server(app);
const io = require('socket.io')(server);

const { v4: uuidV4 } = require('uuid');


// const pug = require('pug');
// const cache = require('memory-cache');


app.use('/public', express.static(__dirname + '/public'));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res)=>{ 
    // res.status(200).render('index', { title: 'Auto Focus' });
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res)=>{
    res.status(200).render('room', { roomId: req.params.room, title: 'Auto Focus' });
});

io.on('connection', (socket)=>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        // console.log(roomId, userId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
        
    });
});

app.get("/api", (req, res)=>{
    res.status(200).send("Server Running gg");
});


server.listen(port, ()=>{
    console.log(`> Server Running On Port: http://localhost/ <`.rainbow);
});

// app.listen(port,()=>{
//     console.log(`> Server Running On Port: ${port} <`.rainbow);
// });