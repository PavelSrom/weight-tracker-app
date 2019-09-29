import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { setNewestWeight, setOldestWeight } from '../store/actions/userInfoActions'
import axios from 'axios'
import Navbar from '../components/Navbar/Navbar'
import Header from '../components/Header/Header'
import Spinner from '../components/Spinner/Spinner'
import SingleLog from '../components/SingleLog/SingleLog'

class Logs extends Component {
  state = {
    logs: [],
    fetching: false,
    newWeight: '',
    updateWeight: '',
    updateWeightModalOpen: false,
    chosenLogID: null
  }

  // when the component is mounted, make our GET request to get all logs
  componentDidMount() {
    const token = localStorage.getItem('authToken') // get token
    this.setState({ fetching: true }) // display spinner
    // make request
    axios.get('/api/me/logs', { headers: { 'authToken': token } })
      .then(res => {
        // once we get a response, sort the response array from newest to oldest logs
        const newestToOldestLogs = res.data.sort((a, b) => b.logID - a.logID)
        // dispatch actions to Redux only if the array is not empty (important!)
        if (newestToOldestLogs.length > 0) {
          this.props.setOldestWeight(newestToOldestLogs[newestToOldestLogs.length - 1].weight)
          this.props.setNewestWeight(newestToOldestLogs[0].weight)
        }
        // set the component state to our received array and hide the spinner
        this.setState({ logs: newestToOldestLogs, fetching: false })
      })
      // hide the spinner even if we get errors
      .catch(err => this.setState({ fetching: false }))
  }

  // add log value to the state
  setNewLog = e => this.setState({ newWeight: e.target.value })

  // submit the log to our database
  submitNewLog = () => {
    // clear new weight state
    this.setState({ newWeight: '' })
    const token = localStorage.getItem('authToken') // get token
    // make a POST request to the correct endpoint
    axios.post('/api/me/logs', {
      // don't forget to convert the weight (by default it's a string, because it's coming from a form input)
      weight: Number(this.state.newWeight),
      date: new Date().toLocaleDateString()
    }, {
      headers: { 'authToken': token }
    })
      .then(res => {
        // once we get a response, dispatch that weight to Redux
        this.props.setNewestWeight(res.data.weight)
        // if there are still no logs after having done the GET request, it's also the oldest weight
        // the following line has been added as an update - it may cause bugs, I'm not sure
        if (this.state.logs.length === 0) this.props.setOldestWeight(res.data.weight)
        // and add that log to our component state
        this.setState({ logs: [res.data, ...this.state.logs] })
      })
      // hide the spinner even if we get errors
      .catch(err => this.setState({ fetching: false }))
  }

  // pretty self-explanatory here
  editExistingWeight = e => this.setState({ updateWeight: e.target.value })
  hideModal = () => this.setState({ updateWeightModalOpen: false })

  // display a modal when we want to edit a certain log
  editExistingLog = logID => {
    this.setState({ updateWeightModalOpen: true, chosenLogID: logID })
  }

  // this is where we make the PUT request
  submitNewWeight = () => {
    const { updateWeight, chosenLogID } = this.state
    const token = localStorage.getItem('authToken')
    axios.put('/api/me/logs', {
      logID: chosenLogID,
      weight: updateWeight,
      date: new Date().toLocaleDateString()
    }, {
      headers: { 'authToken': token }
    })
      .then(res => {
        // remove old log from the state
        const oldLogRemoved = [...this.state.logs].filter(log => log.logID !== res.data.logID)
        // push updated log to the state and sort their logIDs in descending order again
        const newLogList = [...oldLogRemoved, res.data].sort((a, b) => b.logID - a.logID)
        // dispatch newest log (first item in the array)
        this.props.setNewestWeight(newLogList[0].weight)
        // set state
        this.setState({ logs: newLogList, updateWeightModalOpen: false })
      })
      .catch(err => this.setState({ fetching: false }))
  }

  render() {
    // extract certain keys from our state
    const { fetching, logs, updateWeightModalOpen } = this.state

    // markup for the modal that pops up when we want to update a certain log
    const updateWeightModal = (
      <div className="overlay">
        <div className="container">
          <p className="text-white">Update weight:</p>
          <input onChange={e => this.editExistingWeight(e)} type="text" className="form-control mb-2" placeholder="New weight..." />
          <div className="d-flex justify-content-around">
            <button onClick={this.submitNewWeight} className="btn btn-primary">CONFIRM</button>
            <button onClick={this.hideModal} className="btn btn-outline-secondary">CANCEL</button>
          </div>
        </div>
      </div>
    )

    // markup for all logs
    const allLogs = (
      <ul className="list-group">
        {logs.map(log => {
          return <SingleLog
            key={log.logID}
            logID={log.logID}
            weight={log.weight}
            date={log.date}
            edit={this.editExistingLog}
          />
        })}
      </ul>
    )

    // if there are no logs, this paragraph is rendered
    const noLogsFound = <p className="mt-5 text-center">You have no logs added.</p>

    return (
      <Fragment>
        <Header />
        <div className="container py-2" style={{ marginBottom: 70 }}>
          <h3 className="text-center">Your daily logs</h3>
          <div className="bg-secondary p-2 text-center mb-2">
            <p className="text-white">Add a new log:</p>
            <input onChange={e => this.setNewLog(e)} type="text" className="form-control px-2 w-50 d-block mx-auto" placeholder="Current weight..." />
            <button onClick={this.submitNewLog} className="btn btn-primary btn-block mt-2">SUBMIT LOG</button>
          </div>
          {!fetching && logs.length > 0 && allLogs}
          {!fetching && !logs.length > 0 && noLogsFound}
          {fetching && <Spinner description="your logs" />}
          {updateWeightModalOpen && updateWeightModal}
        </div>
        <Navbar />
      </Fragment>
    )
  }
}

// sending stuff to Redux
const mapDispatchToProps = dispatch => {
  return {
    setOldestWeight: weight => dispatch(setOldestWeight(weight)),
    setNewestWeight: weight => dispatch(setNewestWeight(weight))
  }
}

// connecting the component to Redux
export default connect(null, mapDispatchToProps)(Logs)