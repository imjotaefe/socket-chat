const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  console.log(`socket conectado: ${socket.id}`);
  
  var readed = true;

  socket.emit('previousMessage', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    readed = false;
    socket.broadcast.emit('recivedMessage', {data, readed});
  })

  socket.on('readMessage', () => {
    readed = true;
  })

  socket.on('error', function (err) { 
    console.log("Socket.IO Error"); 
    console.log(err.stack); // this is changed from your code in last comment
 });
  
})

server.listen(3000, () => {
  console.log("App online")
});