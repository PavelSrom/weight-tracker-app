import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setDesiredWeight } from '../store/actions/userInfoActions'
import axios from 'axios'
import Navbar from '../components/Navbar/Navbar'
import Spinner from '../components/Spinner/Spinner'
import Header from '../components/Header/Header'

class UserDetails extends Component {
  state = {
    firstName: '',
    desiredWeight: null,
    height: null,
    kcalIntake: null,
    newDesiredWeight: null,
    newKcalIntake: null,
    fetching: false,
    updatingMode: false
  }

  // GET request to userdetails when the component is mounted
  componentDidMount() {
    const token = localStorage.getItem('authToken') // get token
    this.setState({ fetching: true }) // display the overlay before sending our request
    axios.get('/api/me/userdetails', { headers: { 'authToken': token } }) // make a GET request
      .then(res => {
        // when we get a response, send the desired weight to Redux so the Dashboard component can use it
        this.props.setDesiredWeight(res.data.desiredWeight)
        // extract everything from the response data and set component state accordingly
        const { firstName, desiredWeight, height, kcalIntake } = res.data
        this.setState({ firstName, desiredWeight, height, kcalIntake, fetching: false })
      }).catch(err => this.setState({ fetching: false }))
  }

  setNewDetails = e => this.setState({ [e.target.name]: e.target.value })
  // toggle-display the form
  editBtnClicked = () => this.setState({ updatingMode: !this.state.updatingMode })

  // this is where the PUT request happens
  submitNewDetails = () => {
    const { desiredWeight, kcalIntake, newDesiredWeight, newKcalIntake } = this.state
    const token = localStorage.getItem('authToken')
    axios.put('/api/me/userdetails', { // make a PUT request, providing the info converted into numbers
      desiredWeight: Number(newDesiredWeight) || desiredWeight, // if new weight isn't provided, take the old one
      kcalIntake: Number(newKcalIntake) || kcalIntake // if new kcalIntake isn't provided, take the old one from the state
    }, {
      headers: { 'authToken': token }
    })
      .then(res => { // when we get a successful response, dispatch the new desired weight to Redux
        this.props.setDesiredWeight(res.data.desiredWeight)
        // and set state correctly (update desiredWeight, kcalIntake, and hide the form)
        this.setState({
          updatingMode: false,
          desiredWeight: res.data.desiredWeight,
          kcalIntake: res.data.kcalIntake
        })
      })
  }

  render() {
    const { firstName, desiredWeight, height, kcalIntake } = this.state

    // markup for user details
    const userDetails = (
      <div className="container-fluid mt-3">
        <div className="d-flex justify-content-between">
          <p>First name:</p>
          <p>{firstName}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Desired weight:</p>
          <p>{desiredWeight}kg</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Height:</p>
          <p>{height}cm</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Caloric intake:</p>
          <p>{kcalIntake}kcal per day</p>
        </div>
        <button onClick={this.editBtnClicked} className="btn btn-outline-info btn-block my-2">EDIT</button>
      </div>
    )

    // markup for the form that pops up when we want to edit something
    const updateDetailsModal = (
      <div className="container-fluid bg-light py-2">
        <label htmlFor="newDesiredWeight">New desired weight:</label>
        <input onChange={e => this.setNewDetails(e)} type="text" className="form-control" name="newDesiredWeight" />
        <label htmlFor="newKcalIntake">New caloric intake:</label>
        <input onChange={e => this.setNewDetails(e)} type="text" className="form-control" name="newKcalIntake" />
        <button onClick={this.submitNewDetails} className="btn btn-primary mx-auto mt-2 d-block">SUBMIT NEW DETAILS</button>
      </div>
    )

    // render stuff to the screen
    return (
      <Fragment>
        <Header />
        <div className="container py-2" style={{ marginBottom: 70 }}>
          <h3 className="text-center">Your user details</h3>
          {!this.state.fetching && userDetails}
          {this.state.updatingMode && updateDetailsModal}
          {this.state.fetching && <Spinner description="your details" />}
        </div >
        <Navbar />
      </Fragment>
    )
  }
}

// dispatch actions to Redux
const mapDispatchToProps = dispatch => {
  return {
    setDesiredWeight: weight => dispatch(setDesiredWeight(weight))
  }
}

// connect the component to Redux
export default connect(null, mapDispatchToProps)(UserDetails)