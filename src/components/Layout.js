import React, {useState, useEffect, useRef} from 'react'
import io from 'socket.io-client'
import {USER_CONNECTED, LOGOUT, VERIFY_USER} from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './ChatContainer'

// port 3001: server
// port 3000: reactjs
const socketURL = "http://localhost:3001"
const Layout = (props)=>{
  const [socket, setSocket] = useState(null)
  // user account
  const [user, setUser] = useState(null)
  const userStateRef = useRef()
  userStateRef.current = user

  // component will mount
  useEffect(()=>{
    const socket = io(socketURL)
    socket.on('connect', ()=>{
      if(userStateRef.current){
        reconnect(socket)
      }else{
        console.log('Socket connected!')

      }
    })
    setSocket(socket)
  }, [])

  var reconnect = (socket)=>{
    socket.emit(VERIFY_USER, userStateRef.current.name, ({isUser, user})=>{
      if(isUser){
        setUser(null)
      } else {
        setUser(user)
      }
    })

  }

  var setUserFunc = (user)=>{
    // send user connected event to the server
    socket.emit(USER_CONNECTED, user)
    setUser(user)
  }

  var setLogoutFunc = ()=>{
    socket.emit(LOGOUT)
    setUser(null)
  }

  return(
    <div className="contaienr">
      {!user? <LoginForm socket={socket} setUser={setUserFunc}/>:<ChatContainer user={user} socket={socket} logout={setLogoutFunc}/>}
      {/* <ChatContainer user={user} socket={socket} logout={setLogoutFunc}/> */}
    </div>
  )
}

export default Layout