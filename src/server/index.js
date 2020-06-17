const app = require('http').createServer()
const io = module.exports.io = require('socket.io')(app)

const PORT = process.env.PORT || 3001
const socketManager = require('./socketManager')

// socketManager contains a function to handle emitting and receiving message
io.on('connection', socketManager)

app.listen(PORT, ()=>{
  console.log("Connected to port: ", PORT)
})
