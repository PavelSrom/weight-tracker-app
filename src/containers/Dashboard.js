import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Navbar from '../components/Navbar/Navbar'
import Header from '../components/Header/Header'

class Dashboard extends Component {
  state = {
    hasAllNeededInfo: false
  }

  componentDidMount() {
    // extract data from our Redux store
    const {
      kcalPerHour,
      exerciseDuration,
      oldestWeight,
      newestWeight,
      desiredWeight
    } = this.props

    // put it into an array
    const propsArr = [kcalPerHour, exerciseDuration, oldestWeight, newestWeight, desiredWeight]
    // propsArr.every(Boolean) returns either true or false, depending on whether we have all the values needed to render our graphs
    const shouldWeRenderGraphs = propsArr.every(Boolean)

    this.setState({ hasAllNeededInfo: shouldWeRenderGraphs })
  }

  render() {
    const {
      kcalPerHour,
      exerciseDuration,
      oldestWeight,
      newestWeight,
      desiredWeight
    } = this.props

    // It's been a long time since I've done any math, so please make sure this is correct :D
    const kgLeft = newestWeight - desiredWeight
    const kcalLeft = kgLeft * 7000
    const kcalPerSession = (exerciseDuration / 60) * kcalPerHour

    const sessionsLeft = Math.ceil(kcalLeft / kcalPerSession)
    const kgLost = oldestWeight - newestWeight

    // this thing renders if we don't have all the info we need to display our graphs
    const warningParagraph = (
      <div className="container">
        <h4 className="mt-2">Developer's note:</h4>
        <p>Please visit all other pages and choose your favorite exercise in order for this page to work properly. Also, make sure you have at least one log added. Thank you!</p>
      </div>
    )

    // if we have everything needed, we display this markup
    const graphContainer = (
      <div className="container">
        <h3 className="text-center my-3">Dashboard</h3>
        <div className="bg-light p-2">
          <div className="d-flex justify-content-between mt-3 bg-light">
            <div className="w-50 text-center">
              <h1>{sessionsLeft}</h1>
              <p>sessions left</p>
            </div>
            <div className="w-50 text-center">
              <h1>{kgLost}</h1>
              <p>kg lost</p>
            </div>
          </div>
          <div className="text-center mt-5 bg-light">
            <h1>{kgLeft}</h1>
            <p>kg to go</p>
          </div>
        </div>
      </div>
    )

    return (
      <Fragment>
        <Header />
        {!this.state.hasAllNeededInfo && warningParagraph}
        {this.state.hasAllNeededInfo && graphContainer}
        <Navbar />
      </Fragment>
    )
  }
}

// getting data from our Redux store
const mapStateToProps = state => {
  return {
    kcalPerHour: state.userInfo.chosenExercise,
    exerciseDuration: state.userInfo.exerciseDuration,
    oldestWeight: state.userInfo.firstWeight,
    newestWeight: state.userInfo.newestWeight,
    desiredWeight: state.userInfo.desiredWeight
  }
}

// connecting the component to Redux
export default connect(mapStateToProps)(Dashboard)