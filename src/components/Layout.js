import React, {useEffect} from 'react'
import io from 'socket.io-client'
import {USER_CONNECTED, LOGOUT, VERIFY_USER} from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './ChatContainer'

// import dispatch, selector
import {useDispatch, useSelector} from 'react-redux'
import {setSocket} from '../actions/socketActions' // import set socket function
import {setUser} from '../actions/userActions'
// port 3001: server
// port 3000: reactjs
const socketURL = "http://localhost:3001"
const Layout = (props)=>{
  const dispatch = useDispatch()

  const socket = useSelector(state => state.socketReducer.socket)
  const user = useSelector(state => state.userReducer.user)
  console.log('user: ', user)

  // component will mount
  useEffect(()=>{
    const socket = io(socketURL)
    socket.on('connect', ()=>{
      // if(user){
      //   reconnect(socket)
      // }else{
      // }
      console.log('Socket connected!')

    })
    dispatch(setSocket(socket))
  }, [])

  var reconnect = (socket)=>{
    socket.emit(VERIFY_USER, user.name, ({isUser, user})=>{
      if(isUser){
        dispatch(setUser({}))
      } else {
        dispatch(setUser(user))
      }
    })

  }

  var setLogoutFunc = ()=>{
    socket.emit(LOGOUT)
    setUser(null)
  }

  return(
    <div className="contaienr">
      {JSON.stringify(user) === '{}' || user === undefined ? <LoginForm/>:<div>Entered to main message page</div>}
    </div>
  )
}

export default Layout