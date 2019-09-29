import React from 'react'
import { connect } from 'react-redux'
import {
  redirectToDashboard,
  redirectToLogs,
  redirectToExercises,
  redirectToUserDetails
} from '../../store/actions/routeActions'
import './Navbar.css'

const navbar = props => {
  const { goToDashboard, goToLogs, goToExercises, goToUserDetails } = props

  return (
    <div className="navigation bg-primary container-fluid">
      <i onClick={goToDashboard} className="fas fa-home"></i>
      <i onClick={goToLogs} className="fas fa-chart-line"></i>
      <i onClick={goToExercises} className="fas fa-running"></i>
      <i onClick={goToUserDetails} className="fas fa-user-cog"></i>
    </div>
  )
}

// handle correct routes in Redux, depending on what we click
const mapDispatchToProps = dispatch => {
  return {
    goToDashboard: () => dispatch(redirectToDashboard()),
    goToLogs: () => dispatch(redirectToLogs()),
    goToExercises: () => dispatch(redirectToExercises()),
    goToUserDetails: () => dispatch(redirectToUserDetails())
  }
}

// connect this component to Redux
export default connect(null, mapDispatchToProps)(navbar)