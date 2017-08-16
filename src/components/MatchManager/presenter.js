/* global fetch, SERVICE_URL */
import React from 'react'
import io from 'socket.io-client'
import { StandardComponent } from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators as eventActions } from '../../ducks/event'
import css from './style.css'
import { Dialogue } from '../Dialogue/presenter'
import Button from '../Button'
import Header from '../Header'

const canStopRace = (result, laps) => {
  let canStop = true
  result.map(V => { if (V.laps < laps) { canStop = false } })
  return canStop
}
const returnMovedArray = (arr, oldIndex, newIndex) => {
  while (oldIndex < 0) { oldIndex += arr.length }
  while (newIndex < 0) { newIndex += arr.length }
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length
    while ((k--) + 1) { arr.push(undefined) }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}
const canStartRace = (ongoingRace, race) => {
  if (ongoingRace === undefined && race.registrationIds.length > 0) { return true }
  return false
}
const render = {
  advanceMenu: ({advancingRules, raceNames, value, handleEditAdvnace, index}) => <select defaultValue={value} onChange={handleEditAdvnace(index)}><option value='-1'>無</option>{advancingRules.map(rule => <option key={'rule' + rule.toRace} value={rule.toRace}>{raceNames[rule.toRace]}</option>)}</select>,

  raceList: ({race, raceSelected, index, handleSelect, groupNames}) => {
    return <li className={(index === raceSelected) ? css.selected : css.li} key={'race' + race.id}>
      <button className={css.list} onClick={handleSelect(index)}>
        <span>{groupNames[race.group.toString()]}</span>
        <span>:</span>
        <span>{(race.nameCht) ? race.nameCht : race.name}</span>
      </button>
      <div className={css[race.raceStatus]} />
    </li>
  },
  raceListDraggable: ({race, raceSelected, index, handleSelect, groupNames, handleDragStart, handleDragOver, handleDragEnd}) => {
    return <li className={(index === raceSelected) ? css.selected : css.li} key={'race' + race.id} draggable='true' onDragStart={handleDragStart(index)} onDragOver={handleDragOver(index)} onDragEnd={handleDragEnd}>
      <button className={css.list} onClick={handleSelect(index)}>
        <span>{groupNames[race.group.toString()]}</span>
        <span>:</span>
        <span>{(race.nameCht) ? race.nameCht : race.name}</span>
      </button>
      <div className={css.dragHandle} />
    </li>
  },
  raceCtrl: ({race, readerStatus, editField, ongoingRace, handleEndRace, handleUpdateDialog, handleToggleEdit, modified}) => {
    switch (race.raceStatus) {
      case 'init': {
        return <span className={css.raceCtrl}>{(canStartRace(ongoingRace, race)) ? <Button style='short' text='開賽倒數' onClick={handleUpdateDialog('startCountdown')} /> : <Button text='開賽倒數' style='shortDisabled' />}<Button style='shortRed' text='重設比賽' onClick={handleUpdateDialog('cancelRace')} /></span>
      }
      case 'started': {
        return <span className={css.raceCtrl}>
          {(canStopRace(race.result, race.laps))
            ? <Button style='short' text='結束比賽' onClick={handleEndRace} />
            : <Button style='shortRed' text='結束比賽' onClick={handleUpdateDialog('endRace')} />
          }
          <Button style='shortRed' text='重設比賽' onClick={handleUpdateDialog('cancelRace')} />
        </span>
      }
      case 'ended': {
        return <span className={css.raceCtrl}>
          <Button style='short' text='送出結果' onClick={handleUpdateDialog('submitResult')} />
          {(editField === 'raceResult')
            ? <span>
              <Button style='shortGrey' text='取消' onClick={handleToggleEdit('raceResult')} />
              <Button style='shortDisabled' text='重設比賽' />
            </span>
            : <span>
              <Button style='short' text='編輯' onClick={handleToggleEdit('raceResult')} />
              <Button style='shortRed' text='重設比賽' onClick={handleUpdateDialog('cancelRace')} />
            </span>
          }
        </span>
      }
      case 'submitted': {
        return <span className={css.raceCtrl}>
          {(editField === 'raceResult')
            ? <span>
              {modified
                ? <Button style='short' text='送出結果' onClick={handleUpdateDialog('submitResult')} />
                : <Button style='shortDisabled' text='送出結果' />
              }
              <Button style='shortGrey' text='取消' onClick={handleToggleEdit('raceResult')} />
              <Button style='shortDisabled' text='重設比賽' />
            </span>
            : <span>
              <Button style='short' text='編輯' onClick={handleToggleEdit('raceResult')} />
              <Button style='shortRed' text='重設比賽' onClick={handleUpdateDialog('cancelRace')} />
            </span>
          }
        </span>
      }
    }
  },
  dialog: {
    startCountdown: ({ handleStartRace, handleUpdateDialog, countdown, handleChangeCountdown }) => <div className={css.form}>
      <h3>開賽倒數</h3>
      <div><input className={css.countDown} type='number' value={countdown} onChange={handleChangeCountdown()} placeholder='秒' /></div>
      <div className={css.boxFt}>
        <Button onClick={handleStartRace} text='開始' />
        <Button style='grey' onClick={handleUpdateDialog()} text='取消' />
      </div>
    </div>,
    countdown: ({ counter, handleUpdateDialog }) => <div className={css.form}>
      <h3>開賽倒數</h3>
      {counter && <div className={css.timer}>{counter}</div>}
      <div className={css.boxFt}>
        <Button style='alert' onClick={handleUpdateDialog('cancelRace')} text='重設比賽' />
      </div>
    </div>,
    cancelRace: ({ handleResetRace, handleUpdateDialog, counter }) => <div className={css.form}>
      <h3>重設比賽</h3>
      <h4>您確定要取消這場比賽的所有成績，並將比賽狀態還原嗎？</h4>
      <div className={css.boxFt}>
        <Button style='alert' onClick={handleResetRace} text='確定重設' />
        <Button style='grey' onClick={ counter ? handleUpdateDialog('countdown') : handleUpdateDialog() } text='取消' />
      </div>
    </div>,
    endRace: ({ handleEndRace, handleUpdateDialog }) => <div className={css.form}>
      <h3>結束比賽</h3>
      <h4>您確定要結束這場比賽，使用這場比賽記錄的資料計算成績？</h4>
      <div className={css.boxFt}>
        <Button style='alert' onClick={handleEndRace} text='確定結束' />
        <Button style='grey' onClick={handleUpdateDialog()} text='取消' />
      </div>
    </div>,
    submitResult: ({handleSubmitResult, handleUpdateDialog}) => <div className={css.form}>
      <h3>送出比賽結果</h3>
      <h4>確認並送出比賽結果</h4>
      <div className={css.boxFt}>
        <Button style='alert' onClick={handleSubmitResult} text='送出' />
        <Button style='grey' onClick={handleUpdateDialog()} text='取消' />
      </div>
    </div>,
    readerNotStarted: ({handleUpdateDialog}) => <div className={css.form}>
      <h3>連線異常</h3>
      <h4>無法連接到RFID閘門系統，請確定閘門系統已正確啟動，並具備網路連線</h4>
      <div className={css.boxFt}>
        <Button onClick={handleUpdateDialog()} text='關閉' />
      </div>
    </div>
  },
  dashboard: {
    labels: (race, regNames) => <div className={css.dashId}><table className={css.dashTable}>
      <thead><tr>
        <th key='lb-0' className={css.no}>名次</th>
        <th key='lb-1' className={css.name}>選手</th>
      </tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => {
        const reg = regNames[record.registration]
        return reg ? <tr className={css.dashItem} key={'rec' + index}>
          <td className={css.no}>{index + 1}</td>
          <td className={css.name}><span className={css.raceNumber}>{reg.raceNumber}</span> <span>{reg.name}</span></td>
        </tr> : <tr key={'rec-na-' + index}></tr>
      })
      }</tbody>
    </table></div>,
    results: (race) => <table className={css.dashTable}>
      <thead><tr>
      {race && race.result[0] && race.result[0].lapRecords.map((V, I) => <th key={'th-' + I}>{I + 1}</th>)}
      </tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr key={'tr-rec-' + index} className={css.dashItem}>
        {record.lapRecords.map((time, index) => <td key={'record-' + index} className={css.lap}>{time}</td>)}
      </tr>)}</tbody>
    </table>,
    summary: (race) => <table className={css.dashTable}>
      <thead><tr><th>加總</th></tr></thead>
      <tbody>{race.result.map((record, index) => <tr className={css.dashItem} key={'lap' + index}><td className={css.lap}>{record.sum}</td></tr>)}
      </tbody>
    </table>,
    advance: ({race, raceNames}) => <table className={css.dashTable}>
      <thead><tr><th><span>{race.isFinalRace ? '總排名' : '晉級資格'}</span></th></tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr key={'adv' + index} className={css.dashItem}><td className={css.center}>{race.isFinalRace ? index + 1 : raceNames[record.advanceTo]}</td></tr>)}</tbody>
    </table>,
    edit: ({race, raceNames, handleDragStart, handleDragOver, handleDragEnd, handleEditAdvnace}) => <table className={css.dashTable}>
      <thead><tr><th><span>校正成績</span></th></tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr key={'adv' + index} className={css.dashItem}><td className={css.center}>{!race.isFinalRace && render.advanceMenu({advancingRules: race.advancingRules, raceNames, index, value: record.advanceTo, handleEditAdvnace})}<div className={css.dragHandle} draggable='true' onDragStart={handleDragStart(index)} onDragOver={handleDragOver(index)} onDragEnd={handleDragEnd} /></td></tr>)}</tbody>
    </table>
  }
}

export class MatchManager extends StandardComponent {
  constructor (props) {
    super(props)
    this.timer = 0
    this.rfidTimeout = 0
    this.modified = false
    this.state = {
      raceSelected: 0,
      readerStatus: undefined, // didmount的時候打一次api先init狀態
      ongoingRace: undefined,
      dialog: undefined,
      countdown: 60,
      counter: undefined,
      editField: undefined,
      editValue: undefined
    }
    this.dispatch = this.props.dispatch
    this._bind('socketIoEvents', 'countdown', 'handleChangeCountdown', 'handleControlReader', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleEditAdvnace', 'handleEndRace', 'handleResize', 'handleSelect', 'handleStartRace', 'handleSubmitRaceOrder', 'handleSubmitResult', 'handleToggleEdit', 'handleUpdateDialog', 'handleResetRace', 'updateRecords', 'updateOngoingRaces')
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
      raceSelected: (ongoingRace) ? ongoingRace : returnSelectedRace(this.props.races),
      dialog: undefined
    }
    if (stateObj.ongoingRace === undefined) {
      clearInterval(this.timer)
    } else if (this.props.races[stateObj.ongoingRace].startTime && this.props.races[stateObj.ongoingRace].startTime > Date.now()) {
      stateObj.dialog = 'countdown'
      this.timer = setInterval(this.countdown, 100)
    }
    this.setState(stateObj)
  }
  componentDidMount () {
    const onSuccess = () => {
      this.socketIoEvents(this.handleControlReader('getreaderstatus'))
      this.updateOngoingRaces()
    }
    this.socketio = io(SERVICE_URL)
    if (!this.props.event || this.props.event.uniqueName !== this.props.match.params.uniqueName) {
      return this.dispatch(eventActions.getEvent(this.props.match.params.uniqueName, onSuccess))
    }
    return onSuccess()
  }
  componentWillUnmount () {
    this.socketio.close()
  }
  componentWillReceiveProps () {
    if (this.props.event) {
      this.updateOngoingRaces()
    }
  }
  countdown () {
    const reset = () => {
      clearInterval(this.timer)
      return this.setState({ counter: undefined, dialog: undefined })
    }
    if (this.state.ongoingRace === undefined) { return reset() }
    const startTime = this.props.races[this.state.ongoingRace].startTime
    const timeLeft = (startTime - Date.now())
    if (timeLeft <= 0) { return reset() }
    const result = parseFloat(Math.floor(timeLeft / 100) / 10).toFixed(1)
    this.setState({ counter: result })
  }
  socketIoEvents (callback) {
    this.socketio.on('connect', function () {
      fetch(`/api/socket/mgmt?sid=${this.socketio.id}`, {credentials: 'same-origin'}).then(V => { if (callback !== undefined) { callback() } })
    }.bind(this))
    this.socketio.on('readerstatus', function (data) {
      this.setState({ readerStatus: (data.result && data.result.isSingulating) ? 'started' : 'idle' })
    }.bind(this))
    this.socketio.on('raceupdate', function (data) {
      this.dispatch(eventActions.updateRaceOnTheFly(data))
    }.bind(this))
    this.socketio.on('raceresult', function (data) {
      this.dispatch(eventActions.updateRaceResultOnTheFly(data))
    }.bind(this))
  }
  handleToggleEdit (field) {
    return (e) => {
      if (this.state.editField === field) {
        this.modified = false
        return this.setState({ editField: undefined })
      }
      this.setState({ editField: field })
    }
  }
  handleDragStart (fromIndex) {
    return (e) => {
      this.dragFromIndex = fromIndex
      this.dragOverIndex = fromIndex
    }
  }
  handleDragOver (overIndex) {
    return (e) => {
      this.dragOverIndex = overIndex
    }
  }
  handleDragEnd () {
    if (this.dragFromIndex !== this.dragOverIndex) {
      this.modified = true
      let editValue
      if (this.state.editField === 'raceOrder') {
        editValue = (this.state.editValue) ? this.state.editValue : this.props.event.raceOrder
        this.setState({ editValue: returnMovedArray(editValue, this.dragFromIndex, this.dragOverIndex), raceSelected: this.dragOverIndex })
      } else if (this.state.editField === 'raceResult') {
        let race = this.props.races[this.state.raceSelected]
        race.result = returnMovedArray([...race.result], this.dragFromIndex, this.dragOverIndex)
        this.setState({ editValue: race })
      }
    }
  }
  handleEditAdvnace (index) {
    return (e) => {
      let stateObj = { editValue: (this.state.editValue) ? this.state.editValue : this.props.races[this.state.raceSelected] }
      this.modified = true
      stateObj.editValue.result[index].advanceTo = (e.target.value === '-1') ? undefined : parseInt(e.target.value)
      this.setState(stateObj)
    }
  }
  handleSubmitRaceOrder () {
    const onSuccess = () => this.setState({ editField: undefined, editValue: undefined })
    const eventStateObj = { model: 'event', original: { id: this.props.event.id }, modified: { raceOrder: this.state.races.map(V => V.id) } }
    return this.dispatch(eventActions.submit(eventStateObj, onSuccess))
  }
  handleUpdateDialog (value) {
    return (e) => { this.setState({ dialog: value }) }
  }
  handleChangeCountdown () {
    return (e) => {
      this.setState({ countdown: e.target.value })
    }
  }
  handleControlReader (type) {
    const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
    fetch(`/api/socket/mgmt?sid=${this.socketio.id}`, returnPostHeader({ type: type, payload: { eventId: this.props.event.id } }))
  }
  handleStartRace () {
    const obj = { id: this.props.races[this.state.raceSelected].id, startTime: Date.now() + (this.state.countdown * 1000) }
    if (this.props.races[this.state.raceSelected].raceStatus === 'init' && this.state.ongoingRace === undefined) {
      this.handleControlReader('startreader')
      this.rfidTimeout = setInterval(function () {
        if (this.state.readerStatus === 'started') {
          clearInterval(this.rfidTimeout)
          this.setState({ ongoingRace: this.state.raceSelected }, function () {
            this.dispatch(eventActions.controlRace('start', obj, this.updateOngoingRaces))
          }.bind(this))
        }
      }.bind(this), 300)
      setTimeout(function () {
        if (this.state.readerStatus !== 'started') {
          clearInterval(this.rfidTimeout)
          this.setState({dialog: 'readerNotStarted'})
        }
      }.bind(this), 5000)
    }
  }
  handleResetRace () {
    const onSuccess = () => {
      this.handleControlReader('terminatereader')
      this.setState({ ongoingRace: undefined }, function () { this.updateOngoingRaces() }.bind(this))
    }
    this.dispatch(eventActions.controlRace('reset', {id: this.props.races[this.state.raceSelected].id}, onSuccess))
  }
  handleEndRace () {
    const onSuccess = () => {
      this.handleControlReader('terminatereader')
      this.setState({ ongoingRace: undefined }, function () { this.updateOngoingRaces() }.bind(this))
    }
    this.dispatch(eventActions.controlRace('end', {id: this.props.races[this.state.raceSelected].id}, onSuccess))
  }
  handleSubmitResult () {
    const race = (this.state.editField === 'raceResult' && this.state.editValue !== undefined) ? this.state.editValue : this.props.races[this.state.raceSelected]
    this.dispatch(eventActions.submitRaceResult(race, this.updateOngoingRaces))
  }
  handleSelect (index) {
    return (e) => { if (this.state.editField === undefined) { this.setState({ raceSelected: index }) } }
  }
  render () {
    const { location, event, match, nameTables, races } = this.props
    const { counter, raceSelected, readerStatus, dialog, ongoingRace, countdown, editField } = this.state
    const { handleChangeCountdown, handleDragStart, handleDragOver, handleDragEnd, handleEditAdvnace, handleEndRace, handleResetRace, handleToggleEdit, handleSelect, handleStartRace, handleSubmitResult, handleUpdateDialog, modified } = this
//    const {groupNames, raceNames, regNames } = this.props.nameTables
    if (event === -1 || !match.params.uniqueName) { return <Redirect to={{pathname: '/console'}} /> } else if (!event) { return <div><Header location={location} nav='event' match={match} /><div className={css.loading}>Loading...</div></div> }

    let race = races[raceSelected]

    return (<div className={css.wrap}><Header location={location} nav='event' match={match} />
      <div className={css.mainBody}>
        <div className={css.info}>
          <h2>{event.nameCht}</h2>
          {render.raceCtrl({ race, readerStatus, editField, ongoingRace, modified, handleUpdateDialog, handleEndRace, handleToggleEdit })}
        </div>
        <div className={css.managerList}>
          <div>
            <div className={css.hd}>
            {editField === 'raceOrder'
              ? <span>
                {modified === false ? <Button style='shortDisabled' text='儲存' /> : <Button style='short' onClick={this.handleSubmitRaceOrder} text='儲存' />}
                <Button style='shortGrey' onClick={this.handleToggleEdit('raceOrder')} text='取消' />
              </span>
              : <Button style='short' text='編輯賽程' onClick={this.handleToggleEdit('raceOrder')} />
            }
            </div>
            <ul className={css.ul}>{ races.map((race, index) => (editField === 'raceOrder') ? render.raceListDraggable({ race, index, raceSelected, groupNames: nameTables.group, handleSelect, handleDragStart, handleDragOver, handleDragEnd }) : render.raceList({ race, index, raceSelected, groupNames: nameTables.group, handleSelect })) }</ul>
          </div>
          {render.dashboard.labels(race, nameTables.reg)}
          <div className={css.scrollBox}>{render.dashboard.results(race)}</div>
          <div className={css.summary}>{render.dashboard.summary(race)}</div>
          {(editField === 'raceResult')
            ? <div className={css.editRank}>{ render.dashboard.edit({ race, raceNames: nameTables.race, handleDragStart, handleDragOver, handleDragEnd, handleEditAdvnace }) }</div>
            : <div className={css.advTable}>{render.dashboard.advance({race, raceNames: nameTables.race})}</div>}
            </div>
        </div>
        {dialog && <Dialogue content={render.dialog[dialog]({ countdown, counter, handleStartRace, handleUpdateDialog, handleChangeCountdown, handleResetRace, handleEndRace, handleSubmitResult })} />}
    </div>)
  }
}
