import React, { Component } from 'react'
import { connect } from 'react-redux'
import { redirectToLogin } from '../store/actions/routeActions'
import axios from 'axios'

class Register extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    desiredWeight: null,
    height: null,
    kcalIntake: null
  }

  // this method is executed when we want to register the user and redirect them to login 'page'
  registerAndRedirectToLogin = () => {
    // extract our information from the state
    const { email, password, firstName, desiredWeight, height, kcalIntake } = this.state
    // make a POST request to the endpoint, providing the information
    axios.post('/api/register', {
      email,
      password,
      firstName,
      desiredWeight: parseFloat(desiredWeight).toFixed(1),
      height: Number(height),
      kcalIntake: Number(kcalIntake)
    }).then(res => {
      // when we get a response, redirect the user to login page
      this.props.goToLogin()
    }) // optional .catch() here, where we can set state and display error messages
  }

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value })

  render() {
    const { goToLogin } = this.props

    return (
      <div className="container">
        <h2 className="text-primary mb-5">Register page</h2>

        <label htmlFor="email">Email</label>
        <input onChange={e => this.handleInputChange(e)} type="email" className="form-control" name="email" />

        <label htmlFor="password">Password</label>
        <input onChange={e => this.handleInputChange(e)} type="password" className="form-control" name="password" />

        <label htmlFor="firstName">First name</label>
        <input onChange={e => this.handleInputChange(e)} type="text" className="form-control" name="firstName" />

        <label htmlFor="desiredWeight">Desired weight</label>
        <input onChange={e => this.handleInputChange(e)} type="text" className="form-control" name="desiredWeight" />

        <label htmlFor="firstName">Height</label>
        <input onChange={e => this.handleInputChange(e)} type="text" className="form-control" name="height" />

        <label htmlFor="kcalIntake">Caloric intake</label>
        <input onChange={e => this.handleInputChange(e)} type="text" className="form-control" name="kcalIntake" />

        <button className="btn btn-primary btn-block mt-5 mb-2" onClick={this.registerAndRedirectToLogin}>SUBMIT AND PROCEED TO LOGIN</button>
        <p className="text-center" style={{ cursor: 'pointer' }} onClick={goToLogin}>Already registered? Sign in instead</p>
      </div>
    )
  }
}

// dispatching actions to Redux
const mapDispatchToProps = dispatch => {
  return {
    goToLogin: () => dispatch(redirectToLogin())
  }
}

// connecting the component to Redux
export default connect(null, mapDispatchToProps)(Register)