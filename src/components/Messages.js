import React, { useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

const useStyle = makeStyles(()=>({
  message: {
    backgroundColor: 'rgba(0, 0, 0, .04)',
    borderRadius: '2em',
    width: 'fit-content',
    height: 'fit-content',
    padding: '0.01vh 1vw',
    marginTop: '1vh'
  },
  time: {
    padding: '0.01vh 0 0.01vh 1vw',
    margin: '0 0.5%',
    marginTop: '1vh'
  }
}))

const TypingIndicator = (props)=>{
  return(
    <div className="ticontainer" style={{display: 'flex', flexDirection: 'row'}}>
      <div className="user-name">
        {props.typing}
      </div>
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  )
}

const Message = (props)=>{
  const classes = useStyle()
  return(
    <div id={props.id} className={`message ${classes.message}`}>
      <p>{props.message}</p>
    </div>
  )
}

const Messages = (props)=>{
  const classes = useStyle()

  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const user = useSelector(state => state.userReducer.user)

  // auto scroll down function
  const messagesEndRef = useRef(null)

  const scrollToBottom = ()=>{
    messagesEndRef.current.scrollIntoView({behavior: "smooth"})
  }

  useEffect(()=>{
    scrollToBottom()

  }, [activeChat.messages.length])
  
  return(
    <div className="thread-container">
      <div className="thread">
      {
        activeChat.messages.length !== 0? (
          activeChat.messages.map((mes)=>{
            return(
              <div key={mes.id} className={`message-container ${mes.sender === user.name && "right"}`}>
                <Message key={mes.id} id={mes.id} time={mes.time} message={mes.message} sender={mes.sender}/>
                <div className={classes.time}><p>{mes.time}</p></div>
              </div>
              
            )
          })
        ):(
          <div>Say hi to your partner</div>
        ) 
      }
      <div ref={messagesEndRef}/>
      {
        activeChat.typingUsers.map((name)=>{
          return(
            <TypingIndicator typing={`${name} is typing`}/>
          )
        })
      }
      </div>
      
    </div>
  )
}

export default Messages