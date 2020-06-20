import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { useSelector } from 'react-redux'
import { PRIVATE_CHAT, ADD_USER_TO_CHAT } from '../Events'

const useStyles = makeStyles((theme) => ({
  buttons: {
    backgroundColor: 'rgba(0, 0, 0, .04)'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const AddIconModal = () => {
  const userList = useSelector(state => state.userReducer.userList)
  const user = useSelector(state => state.userReducer.user)
  const activeChat = useSelector(state => state.chatReducer.activeChat)
  const socket = useSelector(state => state.socketReducer.socket)
  const classes = useStyles();
  const [open, setOpen] = React.useState(false)

  const sendPrivateMessage = (receiver) => {
    socket.emit(ADD_USER_TO_CHAT, { receiver, activeChat })
  }

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <IconButton size="medium" className={classes.buttons} onClick={handleClick}>
        <PersonAddIcon />
      </IconButton>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <List component="nav" aria-label="main mailbox folders" className={classes.list}>
              {userList.filter(onlineUser => !activeChat.users.includes(onlineUser.name)).length !== 0 ?
                (userList.filter(onlineUser => !activeChat.users.includes(onlineUser.name)).map((activeUser) => {
                  return (
                    <ListItem key={activeUser.id} button onClick={() => {
                      console.log('receiver: ', activeUser);
                      sendPrivateMessage(activeUser);
                      handleClose();
                    }}>
                      <ListItemIcon>
                        <IconButton>{activeUser.name[0].toUpperCase()}</IconButton>
                      </ListItemIcon>
                      <ListItemText primary={activeUser.name} />
                    </ListItem>
                  )
                })) : (<div>No active user</div>)
              }

            </List>


          </div>
        </Fade>
      </Modal>
    </div>
  )
}

const ChatHeading = () => {
  const classes = useStyles()
  const activeChat = useSelector(state => state.chatReducer.activeChat)

  return (
    <div className="heading-container" style={{ height: 48, borderBottom: '1px solid lightgrey' }}>
      <div className="container" style={{ margin: '0 1vw', padding: '1vh 0', }}>
        <Grid container style={{ height: 'fit-content' }}>
          <Grid item xs><h2 style={{ margin: 0, padding: 0 }}>{activeChat.name}</h2></Grid>
          <Grid item xs={2}>
            {activeChat.name !== "Community" ? (<AddIconModal />) : (<div></div>)}
          </Grid>
        </Grid>

      </div>
    </div>
  )
}

export default ChatHeading