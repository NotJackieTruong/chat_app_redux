import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'

// import dispatch, selector
import {useDispatch, useSelector, useStore} from 'react-redux'
import {setNickname, setUser} from '../actions/userActions'

import {VERIFY_USER, USER_CONNECTED} from '../Events'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(),
  },
}));

var LoginForm = (props) => {
  const socket = useSelector(state => state.socketReducer.socket)
  const nickname = useSelector(state => state.userReducer.nickname)
  const store = useStore()
  const dispatch = useDispatch()

  const classes = useStyles();

  // const [nickname, setNickName] = useState('')
  const [error, setError] = useState('')



  const handleChange = (e) => {
    dispatch(setNickname(e.target.value))
  }

  const handleSubmit = (e)=>{
    console.log('state: ', store.getState())
    e.preventDefault()
    // send verify user event to the server
    socket.emit(VERIFY_USER, nickname, ({isUser, user})=>{
      if(isUser){
        setError('User name taken!')
      } else{
        setError('')
        socket.emit(USER_CONNECTED, user)
        dispatch(setUser(user))
      }
    })

  }

  // 1. when user enter their name, server emits to VERIFY_USER namespace to verify the user nick name
  // 2. If the nickname is verified successfully, it callbacks the function setUser in login form with isUser=false and user info as parameters
  // 3. In the setUser() in loginform, if isUser == true => set Error message, else set the parameter for the setUser function of Layout property
  // 4. In the handleSetUser() in Layout.js, it emits to the socket the user info and the server add that user to the user_connected list
  return (
    <div className={classes.margin}>
      <form type="text" onSubmit={(e)=>{handleSubmit(e)}} autoComplete="off">
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <AccountCircle />
        </Grid>
        <Grid item>
          <Input value={nickname} onChange={(e)=>dispatch(setNickname(e.target.value))} fullWidth={true} placeholder="Your nickname..."/>
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