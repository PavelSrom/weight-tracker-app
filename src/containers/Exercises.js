import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateExerciseDuration } from '../store/actions/userInfoActions'
import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import SingleExercise from '../components/SingleExercise/SingleExercise'
import Duration from '../components/Duration/Duration'
import Spinner from '../components/Spinner/Spinner'

class Exercises extends Component {
  state = {
    exercises: [],
    durations: [15, 30, 45, 60],
    chosenDuration: 30, // this shouldn't be here, but in Redux instead, but whatever
    fetching: false
  }

  // GET request to '/api/exercises' happens here, when the component is mounted
  componentDidMount() {
    // get token from local storage
    const token = localStorage.getItem('authToken')
    // set 'fetching' to true => displays an overlay
    this.setState({ fetching: true })
    // make a GET request to our endpoint, provide token
    axios.get('/api/exercises', { headers: { 'authToken': token } })
      // 'dowload' exercises to our state and hide the overlay
      .then(res => this.setState({ exercises: res.data, fetching: false }))
      .catch(err => this.setState({ fetching: false }))
  }

  render() {
    // loop through our exercises and output each exercise as a standalone component
    const exerciseList = this.state.exercises.map(exercise => {
      return <SingleExercise
        key={exercise.id}
        name={exercise.name}
        kcalHour={exercise.kcalHour}
      />
    })

    // same for durations
    const durationList = (
      <div className="d-flex justify-content-between">
        {this.state.durations.map(duration => {
          return duration === this.props.durationChosen ?
            <Duration
              key={duration}
              duration={duration}
              chosen
              clicked={() => this.props.setChosenDuration(duration)} /> :
            <Duration
              key={duration}
              duration={duration}
              clicked={() => this.props.setChosenDuration(duration)} />
        })}
      </div>
    )

    // render stuff to the screen
    return (
      <Fragment>
        <Header />
        <div className="container" style={{ marginBottom: 70 }}>
          <div className="container-fluid">
            <p className="text-center">Set exercise duration:</p>
            {durationList}
          </div>
          <p>{this.props.chosenDuration}</p>
          <ul className="list-group">
            {exerciseList}
          </ul>
        </div>
        {this.state.fetching && <Spinner description="exercises" />}
        <Navbar />
      </Fragment>
    )
  }
}

// make the selected duration in red text (compare with duration in Redux)
const mapStateToProps = state => {
  return {
    durationChosen: state.userInfo.exerciseDuration
  }
}

// dispatch chosen exercise duration to Redux store
const mapDispatchToProps = dispatch => {
  return {
    setChosenDuration: duration => dispatch(updateExerciseDuration(duration))
  }
}

// connect the component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Exercises)