import { combineReducers } from 'redux'
import routeReducer from './reducers/routeReducer'
import userInfoReducer from './reducers/userInfoReducer'

// root reducer, that we provide to the store, it combines all other reducers we're using
const rootReducer = combineReducers({
  route: routeReducer,
  userInfo: userInfoReducer
})

export default rootReducer