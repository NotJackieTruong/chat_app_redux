import React, {useState, useEffect, useRef} from 'react'
// import custom components
import Sidebar from './Sidebar'
import ActiveUserList from './ActiveUserList'
import {COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER} from '../Events'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import MessageInput from './MessageInput'
import Grid from '@material-ui/core/Grid'


const ChatContainer = (props)=>{
    var user = props.user
    var logout = props.logout

    var [chats, setChats] = useState([])
    var [activeChat, setActiveChat] = useState(null)
    var [userList, setUserList] = useState([])

    const chatsStateRef = useRef()
    chatsStateRef.current = chats

    const activeChatStateRef = useRef()
    activeChatStateRef.current = activeChat

    const userListStateRef = useRef()
    userListStateRef.current = userList

    // componentDidMount()
    useEffect(()=>{
        const socket = props.socket
        // socket.emit(COMMUNITY_CHAT, resetChat)
        // socket.on(USER_CONNECTED, (user)=>{
        //     const newUserList = [...userListStateRef.current, user]
        //     // console.log('user from chat container: ', newUserList)
            
        //     setUserList(newUserList)
        // })
        
        initSocket(socket)
    }, [])

    // useEffect(()=>{
    //     const socket = props.socket
    //     return()=>{
    //         socket.off(PRIVATE_MESSAGE)
    //         socket.off(USER_CONNECTED)
    //         socket.off(USER_DISCONNECTED)

    //     }
    // }, [])

    var initSocket = (socket)=>{
        socket.emit(COMMUNITY_CHAT, resetChat)
        // listen on private message namespace
        socket.on(PRIVATE_MESSAGE, addChat)
        socket.on('connect', ()=>{
            socket.emit(COMMUNITY_CHAT, resetChat)
        })
        // listen on event when user is connected
        socket.on(USER_CONNECTED, (connectedUsers)=>{
            setUserList([])
            Object.keys(connectedUsers).map(function(key){
                const newUserList = [...userListStateRef.current, connectedUsers[key]]
                setUserList(newUserList)
            })
        })

        // listen on event when user is disconnected
        socket.on(USER_DISCONNECTED, (connectedUsers)=>{
            console.log('connected user: ',connectedUsers)
            // const removedUsers = userListStateRef.current.filter(otherUser => !connectedUsers.some(connectedUser=>connectedUser.id === otherUser.id))
            // console.log('remove user: ', removedUsers)
            // removeUsersFromChat(removedUsers)
            setUserList([])
            Object.keys(connectedUsers).map(function(key){
                const newUserList = [...userListStateRef.current, connectedUsers[key]]
                setUserList(newUserList)
            })
        })

        socket.on(NEW_CHAT_USER, addUserToChat)

        // 
    }

    // Adds chat to the chat container, if reset is true removes all chats
	// and sets that chat to the main chat.
    // Sets the message and typing socket events for the chat.
    // the chat parameter here is the result of the callback function createChat() in the socketManager
    var resetChat=(chat)=>{
        return addChat(chat, true)
    }


    var addChat = (chat, reset=false)=>{
        const socket = props.socket
        const newChats = reset? [chat] : [...chatsStateRef.current, chat]
        // console.log('newChats: ', newChats, ', reset: ', reset, ', chat: ', chat, ', chats: ', chatsStateRef.current)
        setChats(newChats)
        // setActiveChat(reset? chat: activeChatStateRef.current)
        
        // check if has a new chat, then set that chat active
        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        // receive message event from messageEvent namespace
        socket.on(messageEvent, (message)=>{
            var newChats2 = newChats.map((newChat)=>{
                // only append messages array of an active chat
                if(newChat.id === chat.id){
                    newChat.messages.push(message)
                }
                return newChat
            })
            setChats(newChats2)
        })

        // receive typing event from typingEvent namespace
        socket.on(typingEvent, ({isTyping, user})=>{
            // only show the "user is typing" for the client that is not the sender
			if(user !== props.user.name){
				var newChats3 = newChats.map((newChat)=>{
					if(newChat.id === chat.id){
                        // typingUser = [] (initiate)

                        // Scenario 1: user is typing
                        // active chat checks if the user is in typingUser array or not
                        // if not, then active chat push user into the array

                        // Scenerio 2: user is not typing
                        // Remove objects that is current user and reassigns the active chat's typingUser array
						if(isTyping && !newChat.typingUsers.includes(user)){
							newChat.typingUsers.push(user)
						}else if(!isTyping && newChat.typingUsers.includes(user)){
							newChat.typingUsers = newChat.typingUsers.filter(u => u !== user)
						}
					}
					return newChat
				})
                setChats(newChats3)
            }
		})

    }

    var sendMessage = (chatId, message)=>{
        const socket = props.socket
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    var sendTyping = (chatId, isTyping)=>{
        const socket = props.socket
        socket.emit(TYPING, {chatId, isTyping})
    }

    var handleSetActiveChat = (activeChat)=>{
        setActiveChat(activeChat)
    }

    var sendPrivateMessage = (receiver)=>{
        const socket = props.socket
        console.log('active chat: ', activeChat)
        socket.emit(PRIVATE_MESSAGE, {sender: props.user.name, receiver, activeChat})

    }

    var addUserToChat = ({chatId, newUser})=>{
        const newChats = chatsStateRef.current.map(chat=>{
            if(chat.id === chatId){
                return Object.assign({}, chat, {users: [...chat.users, newUser]})
            }
            return chat
        })
        setChats(newChats)
    }

    // remove users from chat
    var removeUsersFromChat = (removeUsers)=>{
        const newChats = chatsStateRef.map(chat =>{
            let newUsers = chat.users.filter(user=> !removeUsers.includes(user))
            return Object.assign({}, chat, {users: newUsers})
        })
        setChats(newChats)
    }
    // console.log('current state of chats: ', chats)
    // render component
    return(
        <div className="container" style={{height: '100%'}}>
            <Grid container>
                <Grid item xs={3}>  
                    <Sidebar 
                    logout = {logout}
                    user = {props.user}
                    users={userList}
                    chats={chats}
                    activeChat = {activeChatStateRef.current}
                    setActiveChat = {handleSetActiveChat}
                    onSendPrivateMessage = {sendPrivateMessage}
                    />
                </Grid>
                <Grid item xs>
                    {
                        activeChat !== null ? (
                            <div className="chat-room" style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'}}>
                                {/* display chat dialouge part (messages in an active chat) */}
                                <ChatHeading name={activeChat.name}/>
                                <Messages messages={activeChat.messages} user={user} typingUsers={activeChat.typingUsers}/>
                                <MessageInput sendMessage={(message)=>{sendMessage(activeChat.id, message)}} sendTyping={(isTyping)=>{sendTyping(activeChat.id, isTyping)}}/>
                            </div>
                        ):(<div className="chat-room choose">
                            <h3>Welcome to our chat application!</h3>
                        </div>)
                    }

                </Grid>
                <Grid item xs={2}>
                    <ActiveUserList userList={userList} user={props.user} handleSendPrivateMessage={sendPrivateMessage}/>
                </Grid>

            </Grid>
        </div>
    )
}

export default ChatContainer