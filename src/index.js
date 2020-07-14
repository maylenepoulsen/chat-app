const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0

io.on('connection', (socket) => {
  console.log('New Websocket connection')
  //to send an event from the server to the clients we use socket.emit
  //the first argument is the event name (we can name it whatever we want)
  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()

    if(filter.isProfane(message)) {
      return callback('Profanity is not allowed!')
    }

    io.emit('message', message)
    callback()  
  })

  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    callback()
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!')
  })
})

server.listen(port, () => {
    console.log(`The server is up on port ${port}`)
})