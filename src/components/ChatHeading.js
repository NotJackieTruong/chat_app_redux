import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'


const ChatHeading = (props)=>{
  return(
    <div className="heading-container" style={{height: 48, borderBottom: '1px solid lightgrey'}}>
      {/* <Grid container>
        <Grid item></Grid>
        <Grid item></Grid>
      </Grid> */}
      <div className="container" style={{margin: '0 1vw', padding: '1vh 0', }}>
        <h2 style={{margin: 0, padding: 0}}>{props.name}</h2>
      </div>
    </div>
  )
}

export default ChatHeading