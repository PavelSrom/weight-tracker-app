import React, { Component } from 'react'
import { connect } from 'react-redux'
import { redirectToRegister, redirectToDashboard } from '../store/actions/routeActions'
import { updateUserCredentials, saveUserEmail } from '../store/actions/userInfoActions'
import axios from 'axios'
import Spinner from '../components/Spinner/Spinner'

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: false,
    fetching: false
  }

  // this method is executed when the user wants to go to their account
  loginUser = () => {
    // show spinner while the request is processing
    this.setState({ fetching: true })
    // extract email and password from our state
    const { email, password } = this.state
    // make a POST request to our endpoint, providing the email and password
    axios.post('/api/login', { email, password }).then(res => {
      // hide the spinner
      this.setState({ fetching: false })
      // save token to local storage when the response is successful
      localStorage.setItem('authToken', res.headers.authtoken)
      // if we get the token back from local storage and there's no error,
      // redirect the user to dashboard and save their userID and email to Redux
      if (!this.state.error && localStorage.getItem('authToken')) {
        this.props.goToDashboard()
        this.props.updateCredentials(res.data)
        this.props.saveUserEmail(res.data.email)
      }
      // handle errors from here in UI
    }).catch(err => this.setState({ error: true, fetching: false }))
  }

  // set state for each individual inputs ('name' attribute in JSX must be the same as in state)
  handleInputChange = e => this.setState({ [e.target.name]: e.target.value })

  render() {
    const { goToRegister } = this.props

    // render stuff to the screen
    return (
      <div className="container">
        <h2 className="text-primary mb-5">Login page</h2>
        {/* if we get errors, render this paragraph */}
        {this.state.error && <p>Incorrect email or password :(</p>}
        {this.state.fetching && <Spinner description="your account" />}

        <label htmlFor="email">Email</label>
        <input onChange={e => this.handleInputChange(e)} type="email" className="form-control" name="email" />
        <label htmlFor="password">Password</label>
        <input onChange={e => this.handleInputChange(e)} type="password" className="form-control" name="password" />

        <button className="btn btn-primary btn-block mt-5 mb-2" onClick={this.loginUser}>LOGIN</button>
        <p className="text-center" style={{ cursor: 'pointer' }} onClick={goToRegister}>Not registered? Register instead!</p>
      </div>
    )
  }
}

// dispatching stuff to Redux
const mapDispatchToProps = dispatch => {
  return {
    goToRegister: () => dispatch(redirectToRegister()),
    goToDashboard: () => dispatch(redirectToDashboard()),
    updateCredentials: creds => dispatch(updateUserCredentials(creds)),
    saveUserEmail: email => dispatch(saveUserEmail(email))
  }
}

// connecting the component to Redux
export default connect(null, mapDispatchToProps)(Login)