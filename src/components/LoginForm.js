import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'


import {VERIFY_USER} from '../Events'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(),
  },
}));

var LoginForm = (props) => {
  const classes = useStyles();

  const [nickname, setNickName] = useState('')
  const [error, setError] = useState('')

  const setUser = ({isUser, user})=>{
    if(isUser){
      setError('User name taken!')
    } else {
      setError('')
      props.setUser(user)
    }
  }
  // just for testing :))
  // const setMessage = ({message})=>{
  //   console.log(message)
  // }

  const handleChange = (e) => {
    setNickName(e.target.value)
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    const socket = props.socket
    // send verify user event to the server
    socket.emit(VERIFY_USER, nickname, setUser)

    // just for testing
    // socket.emit('new message', 'hello 123', setMessage)
  }
  // 1. when user enter their name, server emits to VERIFY_USER namespace to verify the user nick name
  // 2. If the nickname is verified successfully, it callbacks the function setUser in login form with isUser=false and user info as parameters
  // 3. In the setUser() in loginform, if isUser == true => set Error message, else set the parameter for the setUser function of Layout property
  // 4. In the handleSetUser() in Layout.js, it emits to the socket the user info and the server add that user to the user_connected list
  return (
    <div className={classes.margin}>
      <form type="text" onSubmit={handleSubmit} autoComplete="off">
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <AccountCircle />
        </Grid>
        <Grid item>
          <Input value={nickname} onChange={handleChange} fullWidth={true} placeholder="Your nickname..."/>
          <div className="error">{error? error:null}</div>
          <Button type="submit">Enter</Button>
         
         
          {/* <TextField id="input-with-icon-grid" label="Nickname" onChange={handleChange} fullWidth />
          <div className="error">{error ? error : null}</div>
          
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Primary
          </Button> */}
        </Grid>
      </Grid>

      </form>
    

    </div>


  );
}

export default LoginForm