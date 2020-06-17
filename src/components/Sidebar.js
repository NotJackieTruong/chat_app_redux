import React, { useState } from 'react'
import { makeStyles, fade } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// icons
import SettingsRounded from '@material-ui/icons/SettingsRounded'
import SearchIcon from '@material-ui/icons/Search'
import Videocam from '@material-ui/icons/Videocam'
import AddCommentIcon from '@material-ui/icons/AddComment'

import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import Tooltip from '@material-ui/core/Tooltip'

import {createChatNameFromUser} from '../Factories'

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: '50px',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },

    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        height: '12px',
    },
    icons: {
        fontSize: 30
    },
    buttons: {
        backgroundColor: 'rgba(0, 0, 0, .04)'
    },
    chats: {
        "&:hover": {
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 0, 0, .04)',
            borderRadius: '10px'
        }
    }
}))

const SidebarHeader = (props) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const classes = useStyles()
    return (
        <div className="sidebar-header" style={{ height: 'fit-content', margin: '0 0.8vw', padding: '1vh 0' }}>
            <Grid container>
                <Grid item xs>
                    <Tooltip title="User account" placement="bottom-end">
                        <IconButton size="medium" onClick={handleClick}>
                            {/* <AccountCircle className={classes.icons}/> */}
                            {props.user.name[0].toUpperCase()}
                        </IconButton>
                    </Tooltip>


                    {/* <span class="user-name" style={{fontWeight: 'bold', marginRight: '8px', fontSize: '24px', padding: 0, margin: 0}}>{props.user.name}</span> */}
                    <Menu
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        getContentAnchorEl={null}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={() => { handleClose(); props.logout(); }}>Logout</MenuItem>
                    </Menu>

                </Grid>
                <Grid item container xs style={{ float: 'right' }}>
                    <Grid item xs></Grid>
                    <Grid item xs>
                        <Tooltip title="Settings" placement="bottom-end">
                            <IconButton size="small" className={classes.buttons}>
                                <SettingsRounded className={classes.icons} />
                            </IconButton>
                        </Tooltip>

                    </Grid>
                    <Grid item xs>
                        <Tooltip title="Create new meeting" placement="bottom-end">
                            <IconButton size="small" className={classes.buttons}>
                                <Videocam className={classes.icons} />
                            </IconButton>
                        </Tooltip>

                    </Grid>
                    <Grid item xs>
                        <Tooltip title="Write new messages" placement="bottom-end">
                            <IconButton size="small" className={classes.buttons}>
                                <AddCommentIcon className={classes.icons} />
                            </IconButton>
                        </Tooltip>

                    </Grid>



                </Grid>
            </Grid>

        </div>
    )
}
const SidebarSearch = (props) => {
    const classes = useStyles()
    const [receiver, setReceiver] = useState("")

    var handleChange = (e)=>{
        setReceiver(e.target.value)
    }

    var handleSubmit = (e)=>{
        e.preventDefault()
        props.onSendPrivateMessage(receiver)
        setReceiver("")
    }
    return (
        <div className={classes.search} style={{ height: 'fit-content', margin: '0 1vw', backgroundColor: 'rgba(0, 0, 0, .04)' }}>
            <form onSubmit = {handleSubmit}>
                <div className={classes.searchIcon}>
                    <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                </div>
                <Input
                    type="text"
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    disableUnderline={true}
                    inputProps={{ 'aria-label': 'search' }}
                    value={receiver}
                    onChange = {handleChange}
                />
            </form>
           
        </div>
    )
}

const Chat = (props) => {
    const classes = useStyles()

    const [isClicked, setIsClicked] = useState(false)
    var handleOnclick = (e) => {
        props.onClick(props.chat)
        setIsClicked(!isClicked)
    }
    return (
        <div className={classes.chats} style={isClicked ? { height: 48, margin: '1vh 0.8vw', backgroundColor: 'rgba(0, 0, 0, .04)', borderRadius: '10px' } : { height: 48, margin: '1vh 0.8vw', }} key={props.chatId} onClick={handleOnclick}>
            <Grid container>
                <Grid item xs sm={2}>
                    <IconButton size="medium">
                        {props.name[0].toUpperCase()}
                    </IconButton>
                </Grid>
                <Grid item xs>
                    <div className="chat-name" style={{ fontWeight: 'bold' }}>{props.name}</div>
                    <div className="chat-last-message" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '15vw' }}>{props.lastMessage !== undefined ? props.lastMessage.message : 'No messages!'}</div>
                </Grid>
                <Grid item xs sm={2}>
                    <div className="chat-time">{props.lastMessage ? props.lastMessage.time : null}</div>
                </Grid>
            </Grid>
        </div>
    )
}

const Sidebar = (props) => {
    var handleOnclick = (chat) => {
        props.setActiveChat(chat)
    }
    console.log('active chat from sidebar: ', props.activeChat)
    return (
        <div className="container" style={{ borderRight: '1px solid lightgrey', height: '100vh' }}>
            <SidebarHeader user={props.user} logout={props.logout}/>
            <SidebarSearch onSendPrivateMessage={props.onSendPrivateMessage}/>
            {/* <Chat key="somethin" className="something" user="anc" lastMessage="yo what's up"/> */}
            <div className="active-chat" style={{ marginTop: '2vh' }}>
                {props.chats.map((chat) => {
                    if (chat.name) {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        // const chatSideName = chat.users.find((name) => {
                        //     return name !== props.user.name
                        // }) || "Community"
                        const classNames = (props.activeChat && props.activeChat.id === chat.id) ? 'active' : ''

                        return (
                            <Chat 
                                key={chat.id} 
                                name={chat.isCommunity ? chat.name : createChatNameFromUser(chat.users, props.user.name)}
                                lastMessage={lastMessage} 
                                onClick={handleOnclick} 

                                chatId={chat.id} 
                                className={`user ${classNames}`} 
                                chat={chat} 
                                chatSideName={props.name} 
                                />

                        )
                    }

                    return null
                })}
            </div>
        </div>
    )
}

export default Sidebar