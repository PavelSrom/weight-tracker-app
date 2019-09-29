import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Register from './containers/Register'
import Login from './containers/Login'
import Dashboard from './containers/Dashboard'
import Logs from './containers/Logs'
import Exercises from './containers/Exercises'
import UserDetails from './containers/UserDetails'

class App extends Component {
  render() {
    const { currentPage } = this.props

    // imitating react-router
    return (
      <Fragment>
        {currentPage === 'register' && <Register />}
        {currentPage === 'login' && <Login />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'logs' && <Logs />}
        {currentPage === 'exercises' && <Exercises />}
        {currentPage === 'userdetails' && <UserDetails />}
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.route.route
  }
}

export default connect(mapStateToProps)(App)
