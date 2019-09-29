import React, { Component } from 'react'
import { connect } from 'react-redux'
import { redirectToRegister } from '../../store/actions/routeActions'
import { clearAllUserState } from '../../store/actions/userInfoActions'

class Header extends Component {
  // this gets executed when we click 'SIGN OUT'
  removeTokenAndSignOut = () => {
    localStorage.removeItem('authToken') // token gets removed from local storage
    this.props.signOut() // we're redirected back to register page
    this.props.clearAllUserState() // cleanup in Redux
  }

  render() {
    return (
      <header className="pt-1 pb-2 bg-dark">
        <div className="container">
          <p className="text-white text-center">Signed in as {this.props.userEmail}</p>
          <button
            onClick={this.removeTokenAndSignOut}
            className="btn btn-light d-block mx-auto">SIGN OUT
          </button>
        </div>
      </header>
    )
  }
}

// get user's email from Redux store and display it in this component
const mapStateToProps = state => {
  return {
    userEmail: state.userInfo.email
  }
}

// dispatching (sending) stuff to Redux
const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(redirectToRegister()),
    clearAllUserState: () => dispatch(clearAllUserState())
  }
}

// connecting this component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Header)