/* global fetch, SERVICE_URL */
import React from 'react'
import io from 'socket.io-client'
import { StandardComponent } from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators as eventActions } from '../../ducks/event'
import processData from '../../ducks/processData'
import css from './style.css'
import Button from '../Button'
import Header from '../Header'

const render = {
  raceCtrl: ({readerStatus, handleStartRfidTest, handleEndRfidTest, handleResetRfidTest}) => {
    switch (readerStatus) {
      case 'idle': {
        return <span className={css.raceCtrl}>
          <Button key='btn0' style='short' text='開始測試' onClick={handleStartRfidTest} />
          <Button key='btn1' style='short' text='清除結果' onClick={handleResetRfidTest} />
        </span>
      }
      case 'started': {
        return <span className={css.raceCtrl}>
          <Button key='btn0' style='shortRed' text='結束測試' onClick={handleEndRfidTest} />
          <Button key='btn1' style='short' text='清除結果' onClick={handleResetRfidTest} />
        </span>
      }
    }
  },
  dashboard: ({event, races, regFilter, regNameTable, filteredRegIds, handleChangeRegFilter}) => <div className={css.managerList}>
    <div className={css.dashId}><table className={css.dashTable}>
      <thead><tr>
        <th key='lb-1' className={css.name}>
          <select defaultValue={regFilter} onChange={handleChangeRegFilter}>
            <option value='all'>顯示全部</option>
            {races.map(race => <option key={'filter-' + race.id} value={race.id}>{race.nameCht}</option>)}
          </select>
        </th>
      </tr></thead>
      <tbody>
        {filteredRegIds.map(regId => <tr key={'reg-' + regId}>
          <td className={event.testRfidHashTable[regNameTable[regId].epc] ? css.detected : css.notDetected}><span>{regNameTable[regId].raceNumber}</span> <span>{regNameTable[regId].name}</span></td>
        </tr>)}
      </tbody>
    </table></div>
    <div className={css.scrollBox}><table className={css.dashTable}>
      <thead><tr><th>讀取</th></tr></thead>
      <tbody>{filteredRegIds.map(regId => <tr key={'tr-rec-' + regId} className={css.dashItem}><td>
        <ul className={css.times}>{event.testRfidHashTable[regNameTable[regId].epc] && event.testRfidHashTable[regNameTable[regId].epc].map((time, index) => <li className={(event.slaveEpcStat[regNameTable[regId].epc] && event.slaveEpcStat[regNameTable[regId].epc][index.toString()]) ? css.isSlave : css.isMaster} key={'res-' + time}>{returnDateTime(time)}</li>)}</ul>
      </td></tr>)}</tbody>
    </table></div>
  </div>
}
const returnDateTime = (timestamp) => {
  const t = new Date(timestamp + 28800000) // taipei diff
  return ('0' + t.getUTCHours()).slice(-2) + ':' + ('0' + t.getUTCMinutes()).slice(-2) + ':' + ('0' + t.getUTCSeconds()).slice(-2) // hh:mm
}
const returnAllRegIds = (registrations) => registrations.map(reg => reg.id)
export class TestRun extends StandardComponent {
  constructor (props) {
    super(props)
    this.rfidTimeout = 0
    this.allRegIds = []
    this.state = {
      readerStatus: 'idle', // didmount的時候打一次api先init狀態
      regFilter: 'all',
      filteredRegIds: []
    }
    this.dispatch = this.props.dispatch
    this._bind('socketIoEvents', 'handleControlReader', 'handleStartRfidTest', 'handleEndRfidTest', 'handleResetRfidTest', 'handleChangeRegFilter')
  }
  componentDidMount () {
    const onSuccess = () => {
      this.allRegIds = returnAllRegIds(this.props.registrations)
      this.setState({ filteredRegIds: [...this.allRegIds] })
    }
    this.socketio = io(SERVICE_URL)
    this.socketIoEvents()
    if (!this.props.event || (this.props.event.uniqueName !== this.props.match.params.uniqueName)) {
      return this.dispatch(eventActions.getEvent(this.props.match.params.uniqueName, onSuccess))
    }
    return onSuccess()
  }
  componentWillUnmount () {
    this.socketio.close()
  }
  socketIoEvents () {
    this.socketio.on('connect', function () {
      fetch(`/api/socket/mgmt?sid=${this.socketio.id}`, {credentials: 'same-origin'}).then(V => {
        this.handleControlReader('getreaderstatus')
      })
    }.bind(this))
    this.socketio.on('readerstatus', function (data) {
      this.setState({ readerStatus: (data.result && data.result.isSingulating) ? 'started' : 'idle' })
    }.bind(this))
    this.socketio.on('testrfid', function (data) {
      this.dispatch(eventActions.updateEventOnTheFly(data))
    }.bind(this))
  }
  handleControlReader (type) {
    const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
    fetch(`/api/socket/mgmt?sid=${this.socketio.id}`, returnPostHeader({ type: type, payload: { eventId: this.props.event.id } }))
  }
  handleStartRfidTest () {
    this.handleControlReader('startreader')
    this.dispatch(eventActions.controlRace('testRfid', { action: 'start', id: this.props.event.id }))
  }
  handleEndRfidTest () {
    this.handleControlReader('terminatereader')
    this.dispatch(eventActions.controlRace('testRfid', { action: 'end', id: this.props.event.id }))
  }
  handleResetRfidTest () {
    this.dispatch(eventActions.controlRace('testRfid', { action: 'reset', id: this.props.event.id }))
  }
  handleChangeRegFilter (e) {
    let filteredRegIds
    if (e.target.value === 'all') {
      filteredRegIds = this.allRegIds
    } else {
      this.props.races.map(race => { if (race.id === e.target.value) { filteredRegIds = [...race.registrationIds] } })
    }
    this.setState({ regFilter: e.target.value, filteredRegIds: filteredRegIds })
  }
  render () {
    const { location, event, match, nameTables, races, registrations } = this.props
    const { readerStatus, regFilter, filteredRegIds } = this.state
    const { handleStartRfidTest, handleEndRfidTest, handleResetRfidTest, handleChangeRegFilter } = this
    if (event === -1 || !match.params.uniqueName) { return <Redirect to={{pathname: '/console'}} /> } else if (!event) { return <div><Header location={location} nav='event' match={match} /><div className={css.loading}>Loading...</div></div> }

    return <div className={css.wrap}><Header location={location} nav='event' match={match} />
      <div className={css.mainBody}>
        <div className={css.info}>
          <h2>{event.nameCht}</h2>
          {render.raceCtrl({ readerStatus, handleStartRfidTest, handleEndRfidTest, handleResetRfidTest })}
        </div>
        {render.dashboard({event, races, filteredRegIds, regFilter, regNameTable: nameTables.reg, handleChangeRegFilter})}
      </div>
    </div>
  }
}
