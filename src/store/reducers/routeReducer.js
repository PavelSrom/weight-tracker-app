const initialState = {
  route: 'register'
}

// reducer that handles routes
const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GO_TO_REGISTER':
      return {
        route: 'register'
      }
    case 'GO_TO_LOGIN':
      return {
        route: 'login'
      }
    case 'GO_TO_DASHBOARD':
      return {
        route: 'dashboard'
      }
    case 'GO_TO_USERDETAILS':
      return {
        route: 'userdetails'
      }
    case 'GO_TO_LOGS':
      return {
        route: 'logs'
      }
    case 'GO_TO_EXERCISES':
      return {
        route: 'exercises'
      }
    default:
      return state
  }
}

export default routeReducer