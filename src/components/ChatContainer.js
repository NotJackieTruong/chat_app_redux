import React, {useState, useEffect, useRef} from 'react'
// import custom components
import Sidebar from './Sidebar'
import ActiveUserList from './ActiveUserList'
import {COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER} from '../Events'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import MessageInput from './MessageInput'
import Grid from '@material-ui/core/Grid'

import {useDispatch, useSelector, useStore} from 'react-redux'
import {setUserList} from '../actions/userActions'
import {setChats, setActiveChat} from '../actions/chatActions'

const ChatContainer = (props)=>{
    const socket = useSelector(state => state.socketReducer.socket)
    const user = useSelector(state => state.userReducer.user)
    const chats = useSelector(state => state.chatReducer.chats)
    const activeChat = useSelector(state => state.chatReducer.activeChat)
    const store = useStore()
    const dispatch = useDispatch()
    
    // componentDidMount()
    useEffect(()=>{        
        initSocket(socket)
    }, [])

    var initSocket = (socket)=>{
        socket.emit(COMMUNITY_CHAT, resetChat)
        // listen on private message namespace
        socket.on(PRIVATE_MESSAGE, addChat)
        socket.on('connect', ()=>{
            socket.emit(COMMUNITY_CHAT, resetChat)
        })

        // listen on event when user is connected
        socket.on(USER_CONNECTED, (connectedUsers)=>{
            console.log('connected user: ',connectedUsers, ', user list state: ', store.getState().userReducer.userList)
            dispatch(setUserList([]))
            for (let key in connectedUsers){
                const newUserList = [...store.getState().userReducer.userList, connectedUsers[key]]
                dispatch(setUserList(newUserList))
            }
            // Object.keys(connectedUsers).map(function(key){
                

            // })
        })
        // listen on event when user is disconnected
        socket.on(USER_DISCONNECTED, (connectedUsers)=>{
            // const removedUsers = userListStateRef.current.filter(otherUser => !connectedUsers.some(connectedUser=>connectedUser.id === otherUser.id))
            // console.log('remove user: ', removedUsers)
            // removeUsersFromChat(removedUsers)
            dispatch(setUserList([]))
            Object.keys(connectedUsers).map(function(key){
                const newUserList = [...store.getState().userReducer.userList, connectedUsers[key]]
                dispatch(setUserList(newUserList))
            })
        })
        socket.on(NEW_CHAT_USER, addUserToChat)
    }

    // Adds chat to the chat container, if reset is true removes all chats
	// and sets that chat to the main chat.
    // Sets the message and typing socket events for the chat.
    // the chat parameter here is the result of the callback function createChat() in the socketManager
    var resetChat=(chat)=>{
        return addChat(chat, true)
    }

    var addChat = (chat, reset=false)=>{
        const newChats = reset? [chat] : [...store.getState().chatReducer.chats, chat]
        dispatch(setChats(newChats))
        dispatch(setActiveChat(reset? chat: activeChat))
        // console.log('newChats: ', newChats, ', reset: ', reset, ', chat: ', chat, ', chats: ', chats)
        
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
            dispatch(setChats(newChats2))
        })

        // receive typing event from typingEvent namespace
        socket.on(typingEvent, ({sender, isTyping})=>{
            // only show the "user is typing" for the client that is not the sender
			if(sender !== user.name){
				var newChats3 = newChats.map((newChat)=>{
					if(newChat.id === chat.id){
                        // typingUser = [] (initiate)

                        // Scenario 1: user is typing
                        // active chat checks if the user is in typingUser array or not
                        // if not, then active chat push user into the array

                        // Scenerio 2: user is not typing
                        // Remove objects that is current user and reassigns the active chat's typingUser array
						if(isTyping && !newChat.typingUsers.includes(sender)){
							newChat.typingUsers.push(sender)
						}else if(!isTyping && newChat.typingUsers.includes(sender)){
							newChat.typingUsers = newChat.typingUsers.filter(u => u !== sender)
						}
					}
					return newChat
				})
                dispatch(setChats(newChats3))
            }
		})

    }

    var addUserToChat = ({chatId, newUser})=>{
        const newChats = store.getState().chatReducer.chats.map(chat=>{
            if(chat.id === chatId){
                return Object.assign({}, chat, {users: [...chat.users, newUser]})
            }
            return chat
        })
        dispatch(setChats(newChats))
    }

    // remove users from chat
    var removeUsersFromChat = (removeUsers)=>{
        const newChats = chats.map(chat =>{
            let newUsers = chat.users.filter(user=> !removeUsers.includes(user))
            return Object.assign({}, chat, {users: newUsers})
        })
        dispatch(setChats(newChats))
    }

    // render component
    return(
        <div className="container" style={{height: '100%'}}>
            <Grid container>
                <Grid item xs={3}>  
                    <Sidebar/>
                </Grid>
                <Grid item xs>
                    {
                        activeChat !== null ? (
                            <div className="chat-room" style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'}}>
                                {/* display chat dialouge part (messages in an active chat) */}
                                <ChatHeading />
                                <Messages />
                                <MessageInput/>
                            </div>
                        ):(<div className="chat-room choose">
                            <h3>Welcome to our chat application!</h3>
                        </div>)
                    }

                </Grid>
                <Grid item xs={2}>
                    <ActiveUserList/>
                </Grid>

            </Grid>
        </div>
    )
}

export default ChatContainer