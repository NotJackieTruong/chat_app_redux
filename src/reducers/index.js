import {combineReducers} from 'redux'
// import reducer
import socketReducer from './socketReducer'
import userReducer from './userReducer'
import chatReducer from './chatReducer'

export default combineReducers({
  socketReducer,
  userReducer,
  chatReducer,
})