import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'

import { useSelector, useStore } from 'react-redux'
import { PRIVATE_MESSAGE } from '../Events'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    borderLeft: '1px solid lightgrey',
    overflowY: 'scroll'
  },
  listContainer: {
    maxHeight: 800,
  },
  list: {
    margin: '0 1vw',
    padding: '0'
  }
}));


const ActiveUser = (props) => {
  return (
    <ListItem button onClick={() => props.handleOnClick(props.userName)}>
      <ListItemIcon>
        <IconButton>{props.userName[0].toUpperCase()}</IconButton>
      </ListItemIcon>
      <ListItemText primary={props.userName} />
    </ListItem>
  )
}
const ActiveUserList = () => {
  const classes = useStyles();
  const userList = useSelector(state => state.userReducer.userList)
  const user = useSelector(state => state.userReducer.user)
  const socket = useSelector(state => state.socketReducer.socket)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const store = useStore()

  var sendPrivateMessage = (receiver) => {
    socket.emit(PRIVATE_MESSAGE, { sender: user.name, receiver, activeChat })

  }

  var handleOnClick = (receiver) => {
    sendPrivateMessage(receiver)
  }
  return (
    <div className={classes.root}>
      <ListSubheader disableGutters={true} style={{ borderBottom: '1px solid lightgrey', backgroundColor: 'white', width: '100%' }}>Active users</ListSubheader>

      <div className={classes.listContainer}>
        <List component="nav" aria-label="main mailbox folders" className={classes.list}>
          {/*filter all users that is not current user  */}
          {userList.filter(otherUser => otherUser.name !== user.name).map((user) => {
            return (
              <ActiveUser key={user.id} userName={user.name} handleOnClick={handleOnClick} />
            )
          })}

        </List>

      </div>

    </div>
  )
}

export default ActiveUserList