import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'

// import dispatch, selector
import { useDispatch, useSelector } from 'react-redux'
import { setNickname, setUser } from '../actions/userActions'

import { VERIFY_USER, USER_CONNECTED } from '../Events'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(),
  },
}));

var LoginForm = () => {
  const socket = useSelector(state => state.socketReducer.socket)
  const nickname = useSelector(state => state.userReducer.nickname)

  const dispatch = useDispatch()

  const classes = useStyles();

  // const [nickname, setNickName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    // console.log('state: ', store.getState().userReducer)
    e.preventDefault()
    // send verify user event to the server
    socket.emit(VERIFY_USER, nickname, ({ isUser, user }) => {
      if (isUser) {
        setError('User name taken!')
      } else {
        setError('')
        socket.emit(USER_CONNECTED, user)
        dispatch(setUser(user))
      }
    })
  }

  return (
    <div className={classes.margin}>
      <form type="text" onSubmit={(e) => { handleSubmit(e) }} autoComplete="off">
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <Input value={nickname} onChange={(e) => dispatch(setNickname(e.target.value))} fullWidth={true} placeholder="Your nickname..." />
            <div className="error">{error ? error : null}</div>
            <Button type="submit">Enter</Button>

          </Grid>
        </Grid>

      </form>


    </div>


  );
}

export default LoginForm