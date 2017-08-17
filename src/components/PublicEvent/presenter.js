/* global SERVICE_URL */
import React from 'react'
import io from 'socket.io-client'
import BaseComponent from '../BaseComponent'
import { StandardComponent } from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators as eventActions } from '../../ducks/event'

import css from './style.css'
import Header from '../Header'

const render = {
  raceList: ({race, raceSelected, index, handleSelect, groupNames}) => {
    return <li className={(index === raceSelected) ? css.selected : css.li} key={'race' + race.id}>
      <div className={css[race.raceStatus]} />
      <button className={css.list} onClick={handleSelect(index)}>
        {groupNames && <span>{groupNames[race.group.toString()]} -</span>}
        <span>{(race.nameCht) ? race.nameCht : race.name}</span>
      </button>
    </li>
  },
  dashboard: {
    labels: (race, regNames) => <div className={css.dashId}><table className={css.dashTable}>
      <thead><tr>
        <th className={css.no}>排位</th>
        <th className={css.name}>選手</th>
      </tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => {
        const reg = regNames[record.registration]
        return reg ? <tr className={css.dashItem} key={'rec' + index}>
          <td className={css.no}>{index + 1}</td>
          <td className={css.name}><span className={css.raceNumber}>{reg.raceNumber}</span> <span>{reg.name}</span></td>
        </tr> : <tr />
      })
      }</tbody>
    </table></div>,
    results: (race) => <table className={css.dashTable}>
      <thead><tr>
        {race && race.result[0] && race.result[0].lapRecords.map((V, I) => <th key={'th-' + I}>{I + 1}</th>)}
      </tr></thead>
      <tbody>{race && (race.result.length > 0) && race.result.map((record, index) => <tr key={'tr-rec-' + record.registration} className={css.dashItem}>
        {record.lapRecords.map((time, index) => <td key={'record-' + index} className={css.lap}>{time}</td>)}
      </tr>)}</tbody>
    </table>,
    summary: (race) => <table className={css.dashTable}>
      <thead><tr><th>加總</th></tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr className={css.dashItem} key={'lap' + index}><td className={css.lap}>{record.sum}</td></tr>)}
      </tbody>
    </table>,
    advance: ({race, raceNames}) => <table className={css.dashTable}>
      <thead><tr><th><span>{race && race.isFinalRace ? '總排名' : '晉級資格'}</span></th></tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr key={'adv' + index} className={css.dashItem}><td className={css.center}>{race.isFinalRace ? index + 1 : raceNames[record.advanceTo]}</td></tr>)}</tbody>
    </table>
  }
}

export class PublicEvent extends StandardComponent {
  constructor (props) {
    super(props)
    this.timer = 0
    this.state = {
      raceSelected: 0,
      ongoingRace: undefined
    }
    this.dispatch = this.props.dispatch
    this._bind('socketIoEvents', 'handleSelect', 'updateRecords', 'updateOngoingRaces')
  }
  updateOngoingRaces () {
    const returnOngoingRace = (ongoingRaceId, orderedRaces) => {
      for (let i = 0; i < orderedRaces.length; i += 1) { if (orderedRaces[i].id === ongoingRaceId) { return i } }
      return undefined
    }
    const returnSelectedRace = (orderedRaces) => {
      for (var i = 0; i < orderedRaces.length; i += 1) { if (orderedRaces[i].raceStatus !== 'submitted') { return i } }
      return orderedRaces.length - 1
    }
    const ongoingRace = (this.props.event.ongoingRace === -1) ? undefined : returnOngoingRace(this.props.event.ongoingRace, this.props.races)
    let stateObj = {
      ongoingRace: ongoingRace,
      raceSelected: (ongoingRace) ? ongoingRace : returnSelectedRace(this.props.races)
    }
    if (stateObj.ongoingRace === undefined) { clearInterval(this.timer) }
    this.setState(stateObj)
  }
  componentDidMount () {
    const onSuccess = () => {
      this.socketIoEvents()
      this.updateOngoingRaces()
    }
    this.socketio = io(SERVICE_URL)
    if (!this.props.event || (this.props.event.uniqueName !== this.props.match.params.uniqueName)) {
      return this.dispatch(eventActions.getEvent(this.props.match.params.uniqueName, onSuccess))
    }
    return onSuccess()
  }
  componentWillReceiveProps () {
    if (this.props.event) {
      this.updateOngoingRaces()
    }
  }
  componentWillUnmount () {
    this.socketio.close()
  }
  socketIoEvents (callback) {
    this.socketio.on('connect', function () {
      fetch(`/api/socket/info?sid=${this.socketio.id}`, {credentials: 'same-origin'}).then(V => { if (callback !== undefined) { callback() } })
    }.bind(this))
    this.socketio.on('raceupdate', function (data) {
      this.dispatch(eventActions.updateRaceOnTheFly(data))
    }.bind(this))
    this.socketio.on('raceresult', function (data) {
      this.dispatch(eventActions.updateRaceResultOnTheFly(data))
    }.bind(this))
  }
  handleSelect (index) {
    return (e) => { this.setState({ raceSelected: index }) }
  }
  render () {
    const { location, event, match, races, groups, nameTables } = this.props
    const { raceSelected } = this.state
    const showHeader = (location.search.indexOf('header=0') > -1) ? false : true
    if (!match.params.uniqueName) {
      return <Redirect to={{pathname: '/'}} />
    } else if (!event) {
      return <div><Header location={location} match={match} isPublic='1' /><div className={css.loading}>Loading...</div></div>
    }
    const race = races[raceSelected]
    return (<div className={css.wrap}>
      {showHeader && <Header isPublic='1' location={location} match={match} /> }
      <div className={css.mainBody}>
        <div className={css.info}>
          {showHeader && <h2>{event.nameCht}</h2>}
          <ul className={css.raceSelector}>
            {groups.length > 1
              ? races.map((race, index) => render.raceList({ race, index, raceSelected, groupNames: nameTables.group, handleSelect: this.handleSelect }))
              : races.map((race, index) => render.raceList({ race, index, raceSelected, handleSelect: this.handleSelect }))
            }
          </ul>
        </div>
        {race.registrationIds.length === 0
          ? <div className={css.noData}>尚無資料</div>
          : <div className={css.managerList}>
              <div></div>
              {render.dashboard.labels(race, nameTables.reg)}
              <div className={css.scrollBox}>{render.dashboard.results(race)}</div>
              <div className={css.summary}>{render.dashboard.summary(race)}</div>
              <div className={css.advTable}>{render.dashboard.advance({race, raceNames: nameTables.race})}</div>
            </div>
        }
        <div className={css.footer}>Powered by Beardude Event <span>&copy;</span> <span>{new Date().getFullYear()}</span> </div>
      </div>
    </div>)
  }
}
