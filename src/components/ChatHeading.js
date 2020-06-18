import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'

import {useSelector} from 'react-redux'

const ChatHeading = ()=>{
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  return(
    <div className="heading-container" style={{height: 48, borderBottom: '1px solid lightgrey'}}>
      <div className="container" style={{margin: '0 1vw', padding: '1vh 0', }}>
        <h2 style={{margin: 0, padding: 0}}>{activeChat.name}</h2>
      </div>
    </div>
  )
}

export default ChatHeading