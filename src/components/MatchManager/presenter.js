/* global fetch, SERVICE_URL */
import React from 'react'
import io from 'socket.io-client'
import { StandardComponent } from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators as eventActions } from '../../ducks/event'
import processData from '../../ducks/processData'
import css from './style.css'
import { Dialogue } from '../Dialogue/presenter'
import Button from '../Button'
import Header from '../Header'

const render = {
  advanceMenu: ({nonEntryRaces, raceNames, value, handleEditAdvnace, index}) => <select defaultValue={value} onChange={handleEditAdvnace(index)}><option value='-1'>無</option>{nonEntryRaces.map(race => <option key={'race' + race.id} value={race.id}>{raceNames[race.id]}</option>)}</select>,
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
  raceListDraggable: ({raceId, races, index, handleSelect, groupNames, handleDragStart, handleDragOver, handleDragEnd}) => {
    const race = races.filter(V => (V.id === raceId))[0]
    return <li className={css.li} key={'race' + race.id} draggable='true' onDragStart={handleDragStart(index)} onDragOver={handleDragOver(index)} onDragEnd={handleDragEnd}>
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
        return <span className={css.raceCtrl}>{(processData.canStartRace(ongoingRace, race)) ? <Button style='short' text='開賽倒數' onClick={handleUpdateDialog('startCountdown')} /> : <Button text='開賽倒數' style='shortDisabled' />}<Button style='shortRed' text='重設比賽' onClick={handleUpdateDialog('cancelRace')} /></span>
      }
      case 'started': {
        return <span className={css.raceCtrl}>
          {(processData.canStopRace(race.result, race.laps))
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
      <tbody>{race && race.result.length > 0 && race.result.map((record, index) => <tr key={'tr-rec-' + index} className={css.dashItem}>
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
    </table>,
    edit: ({nonEntryRaces, race, raceNames, handleDragStart, handleDragOver, handleDragEnd, handleEditAdvnace}) => <table className={css.dashTable}>
      <thead><tr><th><span>校正成績</span></th></tr></thead>
      <tbody>{race && race.result && race.result.map((record, index) => <tr key={'adv' + index} className={css.dashItem}><td className={css.center}>{!race.isFinalRace && render.advanceMenu({nonEntryRaces, raceNames, index, value: record.advanceTo, handleEditAdvnace})}<div className={css.dragHandle} draggable='true' onDragStart={handleDragStart(index)} onDragOver={handleDragOver(index)} onDragEnd={handleDragEnd} /></td></tr>)}</tbody>
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
      readerStatus: 'idle', // didmount的時候打一次api先init狀態
      ongoingRace: '',
      dialog: undefined,
      countdown: 60,
      counter: undefined,
      editField: undefined,
      editValue: undefined,
      counting: false
    }
    this.dispatch = this.props.dispatch
    this._bind('socketIoEvents', 'countdown', 'handleChangeCountdown', 'handleControlReader', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleEditAdvnace', 'handleEndRace', 'handleResize', 'handleSelect', 'handleStartRace', 'handleSubmitRaceOrder', 'handleSubmitResult', 'handleToggleEdit', 'handleUpdateDialog', 'handleResetRace', 'updateRecords', 'updateOngoingRaces')
  }
  updateOngoingRaces (toSelectRace) {
    let stateObj = {
      ongoingRace: processData.returnOngoingRace(this.props.event.ongoingRace, this.props.races),
      dialog: undefined
    }
    if (toSelectRace) { stateObj.raceSelected = processData.returnSelectedRace(this.props.races, stateObj.ongoingRace) }
    if (stateObj.ongoingRace === '') {
      clearInterval(this.timer)
    } else if (this.props.races[stateObj.ongoingRace].startTime && this.props.races[stateObj.ongoingRace].startTime > Date.now()) {
      stateObj.dialog = 'countdown'
      if (!this.state.counting) { this.timer = setInterval(this.countdown, 100) }
      stateObj.counting = true
    }
    this.setState(stateObj)
  }
  componentDidMount () {
    const onSuccess = () => { this.updateOngoingRaces(true) }
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
  componentWillReceiveProps () {
    if (this.props.event) { this.updateOngoingRaces() }
  }
  countdown () {
    const reset = () => {
      clearInterval(this.timer)
      return this.setState({ counter: undefined, dialog: undefined })
    }
    if (this.state.ongoingRace === '') { return reset() }
    const startTime = this.props.races[this.state.ongoingRace].startTime
    const timeLeft = (startTime - Date.now())
    if (timeLeft <= 0) { return reset() }
    const result = Math.ceil(timeLeft / 1000)
    this.setState({ counter: result })
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
    this.socketio.on('raceupdate', function (data) {
      this.dispatch(eventActions.updateRaceOnTheFly(data))
    }.bind(this))
  }
  handleToggleEdit (field) {
    return (e) => {
      if (this.state.editField === field) {
        this.modified = false
        return this.setState({ editField: undefined })
      }
      if (field === 'raceOrder') { return this.setState({ editField: field, editValue: [...this.props.event.raceOrder] }) }
      this.setState({ editField: field, editValue: this.props.races[this.state.raceSelected].result })
    }
  }
  handleDragStart (fromIndex) {
    return (e) => {
      this.dragFromIndex = fromIndex
      this.dragOverIndex = fromIndex
    }
  }
  handleDragOver (overIndex) {
    return (e) => { this.dragOverIndex = overIndex }
  }
  handleDragEnd () {
    if (this.dragFromIndex !== this.dragOverIndex) {
      this.modified = true
      this.setState({ editValue: processData.returnMovedArray(this.state.editValue, this.dragFromIndex, this.dragOverIndex) })
    }
  }
  handleEditAdvnace (index) {
    return (e) => {
      let stateObj = { editValue: (this.state.editValue) ? this.state.editValue : this.props.races[this.state.raceSelected] }
      stateObj.editValue[index].advanceTo = (e.target.value === '-1') ? undefined : e.target.value
      this.modified = true
      this.setState(stateObj)
    }
  }
  handleSubmitRaceOrder () {
    const onSuccess = () => {
      this.modified = false
      this.setState({ editField: undefined, editValue: undefined })
    }
    return this.dispatch(eventActions.submit('event', { id: this.props.event.id, raceOrder: this.state.editValue }, onSuccess))
  }
  handleSubmitResult () {
    const onSuccess = () => {
      this.modified = false
      this.setState({ editField: undefined, editValue: undefined })
      this.updateOngoingRaces()
    }
    let input = {...this.props.races[this.state.raceSelected]}
    if (this.state.editField === 'raceResult') { input.result = this.state.editValue }
    const trimmedRace = processData.returnRaceWithTrimmedResult(input)
    const submitObj = processData.returnRaceResultSubmitArray(trimmedRace, this.props.races)
    this.dispatch(eventActions.submitRaces(submitObj, onSuccess))
  }
  handleUpdateDialog (value) {
    return (e) => { this.setState({ dialog: value }) }
  }
  handleChangeCountdown () {
    return (e) => { this.setState({ countdown: e.target.value }) }
  }
  handleControlReader (type) {
    const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
    fetch(`/api/socket/mgmt?sid=${this.socketio.id}`, returnPostHeader({ type: type, payload: { eventId: this.props.event.id } }))
  }
  handleStartRace () {
    const obj = { id: this.props.races[this.state.raceSelected].id, startTime: Date.now() + (this.state.countdown * 1000) }
    if (this.props.races[this.state.raceSelected].raceStatus === 'init' && this.state.ongoingRace === '') {
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
      this.setState({ ongoingRace: '', dialog: undefined }, function () { this.updateOngoingRaces() }.bind(this))
    }
    this.dispatch(eventActions.controlRace('reset', {id: this.props.races[this.state.raceSelected].id}, onSuccess))
  }
  handleEndRace () {
    const onSuccess = () => {
      this.handleControlReader('terminatereader')
      this.setState({ ongoingRace: '' }, function () { this.updateOngoingRaces() }.bind(this))
    }
    this.dispatch(eventActions.controlRace('end', {id: this.props.races[this.state.raceSelected].id}, onSuccess))
  }
  handleSelect (index) {
    return (e) => { if (this.state.editField === undefined) { this.setState({ raceSelected: index }) } }
  }
  render () {
    const { location, event, match, nameTables, races } = this.props
    const { counter, raceSelected, readerStatus, dialog, ongoingRace, countdown, editField, editValue } = this.state
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
            <ul className={css.ul}>
            {(editField === 'raceOrder')
              ? editValue.map((raceId, index) => render.raceListDraggable({ raceId, races, index, groupNames: nameTables.group, handleSelect, handleDragStart, handleDragOver, handleDragEnd }))
              : races.map((race, index) => render.raceList({ race, index, raceSelected, groupNames: nameTables.group, handleSelect }))
            }
            </ul>
          </div>
          {render.dashboard.labels(race, nameTables.reg)}
          <div className={css.scrollBox}>{render.dashboard.results(race)}</div>
          <div className={css.summary}>{render.dashboard.summary(race)}</div>
          {(editField === 'raceResult')
            ? <div className={css.editRank}>{ render.dashboard.edit({ nonEntryRaces: races.filter(race => (!race.isEntryRace)), race, raceNames: nameTables.race, handleDragStart, handleDragOver, handleDragEnd, handleEditAdvnace }) }</div>
            : <div className={css.advTable}>{render.dashboard.advance({race, raceNames: nameTables.race})}</div>}
            </div>
        </div>
        {dialog && <Dialogue content={render.dialog[dialog]({ countdown, counter, handleStartRace, handleUpdateDialog, handleChangeCountdown, handleResetRace, handleEndRace, handleSubmitResult })} />}
    </div>)
  }
}
