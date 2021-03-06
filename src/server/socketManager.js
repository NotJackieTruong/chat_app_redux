const io = require('./index').io
const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, USER_DISCONNECTED, TYPING, PRIVATE_CHAT, NEW_CHAT_USER, ADD_USER_TO_CHAT } = require("../Events") // import namespaces
const { createMessage, createChat, createUser } = require('../Factories')
const { act } = require('react-dom/test-utils')

let connectedUsers = {} // list of connected users
let communityChat = createChat({ isCommunity: true })

// socket.emit('something', 'another something') is used to send to sender-client only
// io.emit('something', 'another something') is used to send to all connected clients


// function to receive message on the server
module.exports = function (socket) {
  // check socket id
  console.log('socket id: ', socket.id)

  // function to emit a message to send a message from an user
  let sendMessageToChatFromUser;

  // function to emit a message to check whether user is typing
  let sendTypingFromUser;

  // receive verify event to verify user name
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null })
    } else {
      callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) })
    }

  })

  // handle when user is connected
  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id
    connectedUsers = addUser(connectedUsers, user)
    socket.user = user

    sendMessageToChatFromUser = sendMessageToChat(user.name)
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)
    console.log('Connected user list: ', connectedUsers)
  })

  // receive user disconnected event
  socket.on('disconnected', () => {
    // check if the object 'socket' has property 'user'
    if ('user' in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name)
      io.emit(USER_DISCONNECTED, connectedUsers)
      console.log('user connected list after disconnecting: ', connectedUsers)
    }
  })

  // receive user logout event
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit(USER_DISCONNECTED, connectedUsers)
    console.log('user connected list after loggin out: ', connectedUsers)
  })

  // receive community_chat (default chat) event
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat)
  })

  // receive message event
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message)
  })

  // receive typing event
  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping)
  })

  // receive private chat event
  socket.on(PRIVATE_CHAT, ({ sender, receivers, chats }) => {
    const groupOfUsers = [...receivers, sender]

    // if there are chats at the moment
    if (chats) {
      // check if there exists the chat
      if (!checkIsCreated(groupOfUsers, chats)) {
        const newChat = createChat({ name: `${sender},${groupOfUsers.map(user => ' ' + user)}`, users: groupOfUsers })
        groupOfUsers.filter(user => user in connectedUsers) // take all users that are in activeChat.users array out of connectedUsers object
          .map(user => connectedUsers[user]) // get user object in connectedUsers
          .map(user => {
            socket.to(user.socketId).emit(PRIVATE_CHAT, newChat)
          })
        socket.emit(PRIVATE_CHAT, newChat)
      }

    } else {
      const newChat = createChat({ name: `${sender},${groupOfUsers.map(user => ' ' + user)}`, users: groupOfUsers })
      groupOfUsers.filter(user => user in connectedUsers) // take all users that are in activeChat.users array out of connectedUsers object
        .map(user => connectedUsers[user]) // get user object in connectedUsers
        .map(user => {
          socket.to(user.socketId).emit(PRIVATE_CHAT, newChat)
        })
      socket.emit(PRIVATE_CHAT, newChat)
    }
  })

  socket.on(ADD_USER_TO_CHAT, ({ receivers, activeChat, chats }) => {
    // const receiverSocket = receiver.socketId
    const groupOfUsers = activeChat.users.concat(receivers)

    activeChat.users.filter(user => user in connectedUsers) // take all users that are in activeChat.users array out of connectedUsers object
      .map(user => connectedUsers[user]) // get user object in connectedUsers
      .map(user => {
        socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: receivers })
      })
    socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: receivers })
    receivers.filter(user => user in connectedUsers)
      .map(user => connectedUsers[user])
      .map(user => {
        socket.to(user.socketId).emit(PRIVATE_CHAT, Object.assign({}, activeChat, {name: activeChat.users.concat(receivers).join(", "), users: activeChat.users.concat(receivers)}))
      })
  })

}


// function to add user
function addUser(userList, user) {
  let newList = Object.assign({}, userList)
  newList[user.name] = user
  return newList
}

// function to remove user
function removeUser(userList, username) {
  let newList = Object.assign({}, userList)
  delete newList[username]
  return newList
}

// function to check username whether it's in the list 
function isUser(userList, username) {
  return username in userList
}

// function to send a message event
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }))
  }
}

// function to send a typing event
function sendTypingToChat(sender) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { sender, isTyping })
  }
}

// function to check if a chat is exists
function checkIsCreated(groupOfUsers, chats) {
  var isCreated = null
  chats.some(chat => {
    if (JSON.stringify(chat.users.sort()) === JSON.stringify(groupOfUsers.sort())) {
      return isCreated = true
    } else {
      isCreated = false
    }
  })
  return isCreated

}

function sendPrivateMessageToChat(sender, receiver) {

}