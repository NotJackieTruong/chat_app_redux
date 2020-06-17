import {SET_USER, SET_NICKNAME, LOG_OUT, SET_USER_LIST} from '../actions/actionTypes'

const initState = {
  user: {},
  nickname: "",
  userList: []
}

const userReducer = (state = initState, action)=>{
  switch(action.type){
    case SET_USER:
      state.user = action.payload
      return {user: state.user}

    case SET_NICKNAME:
      state.nickname = action.payload
      return {nickname: state.nickname}

    case LOG_OUT:
      state.user = {}
      return {user: state.user}

    case SET_USER_LIST:
      state.userList = [...state.userList, payload]
      return {userList: state.userList}

    default:
      return state
  }
}



export default userReducer