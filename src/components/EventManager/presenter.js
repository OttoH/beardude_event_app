import React from 'react'
import BaseComponent from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators as eventActions } from '../../ducks/event'
// import { actionCreators as racerActions } from '../../ducks/racer'

import css from './style.css'
import { Dialogue } from '../Dialogue/presenter'
import Button from '../Button'
import Header from '../Header'
import AdvRule from '../AdvRule'
import AssignReg from '../AssignReg'
import { renderInput } from '../Table/presenter'

const valueFunc = (modified, original, field) => {
  if (modified && modified[field] !== undefined) { return modified[field] }
  if (original) { return original[field] }
  return undefined
}
const returnDateTime = (timestamp, forDisplay) => {
  const t = new Date(timestamp + 28800000) // taipei diff
  return t.getUTCFullYear() + '-' + ('0' + (t.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + t.getUTCDate()).slice(-2) + (forDisplay ? ' ' : 'T') + ('0' + t.getUTCHours()).slice(-2) + ':' + ('0' + t.getUTCMinutes()).slice(-2) // yyyy-mm-ddThh:mm
}
const validateRfid = ({input, regs, pacerEpc}) => {
  if (pacerEpc && input === pacerEpc) {
    return false
  }
  for (let i = 0; i < regs.length; i += 1) {
    if (regs[i].epc === input) {
      return false
    }
  }
  return true
}
const returnInputs = {
  event: (modified, original) => [
    {label: '中文名稱', field: 'nameCht', type: 'text'},
    {label: '英文名稱', field: 'name', type: 'text'},
    {label: '地點', field: 'location', type: 'text'},
    {label: '跑道長度(公尺)', field: 'lapDistance', type: 'number'},
    {label: '開始時間', field: 'startTime', type: 'datetime', value: (modified && modified.startTime) ? modified.startTime : (original && original.startTime ? returnDateTime(original.startTime) : undefined)},
    {label: '結束時間', field: 'endTime', type: 'datetime', value: (modified && modified.endTime) ? modified.endTime : (original && original.endTime ? returnDateTime(original.endTime) : undefined)},
    {label: '公開活動', field: 'isPublic', type: 'checkbox'},
    {label: '隊伍報名', field: 'isTeamRegistrationOpen', type: 'checkbox'},
    {label: '個人報名', field: 'isRegistrationOpen', type: 'checkbox'},
    {label: '地下活動', field: 'isIndieEvent', type: 'checkbox', value: true}
  ],
  group: () => [
    {label: '中文名稱', field: 'nameCht', type: 'text'},
    {label: '英文名稱', field: 'name', type: 'text'},
    {label: '名額', field: 'racerNumberAllowed', type: 'number'}
  ],
  race: () => [
    {label: '中文名稱', field: 'nameCht', type: 'text'},
    {label: '英文名稱', field: 'name', type: 'text'},
    {label: '名額', field: 'racerNumberAllowed', type: 'number'},
    {label: '圈數', field: 'laps', type: 'number'},
    {label: '組別初賽', field: 'isEntryRace', type: 'checkbox'},
    {label: '組別決賽', field: 'isFinalRace', type: 'checkbox'},
    {label: '需前導車', field: 'requirePacer', type: 'checkbox'}
  ],
  reg: () => [
//    {label: '選手 ID', field: 'racer', type: 'number', disabled: true},
    {label: '稱呼方式', field: 'name', type: 'text'}
//    {label: '選手號碼', field: 'raceNumber', type: 'number'}
  ]
}
const title = { event: '活動', group: '組別', race: '賽事', reg: '選手' }
const lists = ['group', 'race', 'reg']
const render = {
/*
  delete: (model, original, onDelete) => (

    (model === 'event' && original.groups.length === 0) ||
    (model === 'group' && original.races.length === 0 && original.registrations.length === 0) ||
    (model === 'race' && original.registrations.length === 0) ||
    (model === 'reg'))
    ? <Button style='alert' onClick={onDelete(model)} text='刪除' />
    : <Button style='disabled' text='刪除' />,
*/
  li: {
    group: (V, I, selected, onSelect) => <li className={selected === I ? css.selected : css.li} key={'li_' + V.id}>
      <button className={css.list} onClick={onSelect('group', I)}>
        {V.nameCht ? V.nameCht : V.name}
        <span className={css.count}>{(V.registrations ? V.registrations.length : 0) + '/' + V.racerNumberAllowed}</span>
      </button>
    </li>,
    race: (V, I, selected, onSelect) => <li className={selected === I ? css.selected : css.li} key={'li_' + V.id}>
      <button className={css.list} onClick={onSelect('race', I)}>
        {V.nameCht ? V.nameCht : V.name}
        <ul className={css.lights}>
          <li className={V.requirePacer ? css.on : css.off}>前導</li>
          <li className={V.isEntryRace ? css.on : css.off}>初賽</li>
          {V.isFinalRace ? <li className={css.on}>決賽</li> : <li className={V.advancingRules.length > 0 ? css.on : css.off}>晉級</li>}
        </ul>
        <span className={css.count}>{(V.registrations ? V.registrations.length : 0) + '/' + V.racerNumberAllowed}</span>
      </button>
    </li>,
    reg: (V, I, selected, onSelect) => {
      return <li className={selected === I ? css.selected : css.li} key={'li_' + I}>
      <button className={css.list} onClick={onSelect('reg', I)}>
        <span className={css.raceNumber}>{V.raceNumber}</span>
        {(V.name) ? V.name : V.id}
        <span className={css.toRight}>
          <ul className={css.lights}>
            <li className={V.epc ? css.on : css.off}>RFID</li>
          </ul>
        </span>
      </button>
        </li>}
  },
  hd: {
    group: ({groupSelected, array, handleStartEdit}) => <span className={css.right}>
      {groupSelected !== -1 && <span>
        <Button style='short' text='編輯' onClick={handleStartEdit('group', array[groupSelected])} />
      </span>}
      <Button style='short' text='新增' onClick={handleStartEdit('group', {})} />
    </span>,
    race: ({groupSelected, raceSelected, array, handleStartEdit}) => <span className={css.right}>
      {groupSelected !== -1 && array && <span>
        {raceSelected !== -1 && <Button style='short' text='編輯' onClick={handleStartEdit('race', array[raceSelected])} /> }
        <Button style='short' text='新增' onClick={handleStartEdit('race', {})} />
        <Button style='short' text='晉級規則' onClick={handleStartEdit('advRules', array)} />
      </span>}
    </span>,
    reg: ({groupSelected, regSelected, array, handleStartEdit}) => <span className={css.right}>
      {groupSelected !== -1 && array && <span>
        {regSelected !== -1 && <Button style='short' text='編輯' onClick={handleStartEdit('reg', array[regSelected])} />}
        <Button style='short' text='新增' onClick={handleStartEdit('reg', {})} />
        <Button style='short' text='選手分組' onClick={handleStartEdit('assignReg', array)} />
      </span>}
    </span>
  },
  list: ({model, array, state, onSelect}) => <div key={'list' + model}>
    <ul className={css.ul}>{array && array.map((V, I) => (render.li[model](V, I, state[model + 'Selected'], onSelect)))}</ul>
  </div>,
  event: ({event, onEdit}) => <div className={css.info}>
    <h2>{event.nameCht} <span className={css.btn}><Button style='short' text='編輯' onClick={onEdit} /></span>
    </h2>
    <h3>{event.name} <span className={css.time}>{event.startTime && returnDateTime(event.startTime, true)}{event.endTime && ' - ' + returnDateTime(event.endTime, true)}</span></h3>
    <ul className={css.lights}>
      <li className={event.isPublic ? css.on : css.off}>公開活動</li>
      <li className={event.isTeamRegistrationOpen ? css.on : css.off}>隊伍報名</li>
      <li className={event.isRegistrationOpen ? css.on : css.off}>個人報名</li>
      <li className={event.isIndieEvent ? css.on : css.off}>地下活動</li>
      <li className={event.pacerEpc ? css.on : css.off}>前導車RFID</li>
    </ul>
  </div>,
  infoForm: ({editModel, editValue, original, modified, onChange, onSubmit, onCancel, onDelete, rfidForm}) => <div className={css.form}>
    <h3>{editValue.id ? '編輯' : '新增'}{title[editModel]}</h3>
    <ul>{ returnInputs[editModel](editValue, original).map((V, I) => <li key={'in_' + I}><label>{V.label}</label>{ renderInput[V.type]({ onChange: onChange(V.field, V.type), value: ((V.value) ? V.value : valueFunc(editValue, original, V.field)), disabled: V.disabled }) }</li>) }</ul>
    {rfidForm}
    <div className={css.boxFt}>
      {modified ? <Button text='儲存' onClick={onSubmit(editModel)} /> : <Button style='disabled' text='儲存' />}
      {original && original.id && <Button style='alert' onClick={onDelete(editModel)} text='刪除' />}
      <Button style='grey' onClick={onCancel} text='關閉' />
    </div>
  </div>,
  rfidForm: {
    event: ({original, modified, handleInputRfid, rfidMessage}) => {
      const pacerEpc = valueFunc(modified, original, 'pacerEpc')
      return <div>{rfidMessage && <h4 className={css.forbidden}>{rfidMessage}</h4>}<ul>
        <li>
          <label>前導車ID</label>
          <input type='text' defaultValue={pacerEpc} onChange={handleInputRfid('pacerEpc')} />
        </li>
      </ul></div>
    },
    reg: ({original, modified, handleInputRfid, rfidMessage}) => {
      const epc = valueFunc(modified, original, 'epc')
      return <div>{rfidMessage && <h4 className={css.forbidden}>{rfidMessage}</h4>}
        <label>RFID</label>
        <input type='text' defaultValue={epc} onChange={handleInputRfid('epc')} />
      </div>
    }
  }
}
let isRfidReader = false
export class EventManager extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      racesFiltered: [],
      regsFiltered: [],
      groupSelected: -1,
      raceSelected: -1,
      regSelected: -1,
      rfidMessage: undefined,
      editModel: undefined,
      editValue: undefined,
      modified: false
    }
    this.dispatch = this.props.dispatch
    this._bind('handleStartEdit', 'handleKeypress', 'handleKeyup', 'handleCancelEdit', 'handleDelete', 'handleSubmit', 'handleInput', 'handleInputRfid', 'handleSelect', 'updateListArrays')
  }
  componentDidMount () {
    const onSuccess = () => {
      if (this.props.match.params.uniqueName === 'new') { this.setState({ editModel: 'event', editValue: {} }) }
    }
    if (window.navigator.userAgent.indexOf('Android') > -1) {
      window.addEventListener('keypress', this.handleKeypress)
      window.addEventListener('keyup', this.handleKeyup)
    }
    this.dispatch(eventActions.getEvent(this.props.match.params.uniqueName, onSuccess))
  }
  componentWillUnmount () {
    window.removeEventListener('keypress', this.handleKeypress)
    window.removeEventListener('keyup', this.handleKeyup)
  }
  handleKeypress () { isRfidReader = true }
  handleKeyup () { isRfidReader = false }
  handleStartEdit (model, object) {
    return (e) => {
      let editValue = {}
      switch (model) {
      case 'event':
        if (object.id) { editValue.id = this.props.event.id }
        break
      case 'group':
        editValue.event = this.props.event.id
        if (object.id) { editValue.id = object.id }
        break
      case 'race':
        editValue.event = this.props.event.id
        if (this.state.groupSelected !== -1) { editValue.group = this.props.groups[this.state.groupSelected].id }
        if (object.id) { editValue.id = object.id }
        break
      case 'reg':
        editValue.event = this.props.event.id
        editValue.group = this.props.groups[this.state.groupSelected].id
        if (object.id) { editValue.id = object.id }
      }
      this.setState({ editModel: model, editValue: editValue })
    }
  }
  handleCancelEdit () {
    if (this.props.match.params.uniqueName === 'new') { window.location = '/console' }
    let stateObj = { editModel: undefined, editValue: undefined, modified: false }
    this.updateListArrays(stateObj)
  }
  handleDelete (model) {
    return (e) => {
      const onSuccess = () => {
        if (model === 'event') { return window.location = '/console' }
        if (model === 'race') {
          stateObj.groupSelected = this.state.groupSelected
          stateObj.raceSelected = -1
          stateObj.regSelected = -1
        }
        this.updateListArrays(stateObj)
      }
      let stateObj = {editModel: undefined, editValue: undefined}
      stateObj[model + 'Selected'] = -1
      this.dispatch(eventActions.delete(model, this.state.editValue.id, onSuccess))
    }
  }
  handleInput (field, type) {
    return (e) => {
      let editValue = {...this.state.editValue, [field]: e.target.value}
      if (!isRfidReader) {
        if (type === 'checkbox') { editValue[field] = (e.target.value === 'true') ? false : true }
        this.setState({ editValue: editValue, modified: true })
      }
    }
  }
  handleInputRfid (field) {
    return (e) => {
      let value = e.target.value
      this.setState({ editValue: {...this.state.editValue, [field]: e.target.value }, modified: true })
    }
  }
  handleSubmit (model) {
    return (e) => {
      let stateObj = { editModel: undefined, editValue: undefined, rfidMessage: undefined, modified: false }
      let onSuccess = () => this.updateListArrays(stateObj)
      let validateResult = true
      if (model === 'event' && this.state.editValue.pacerEpc) {
        if (!validateRfid({input: state.editValue.pacerEpc, regs: this.props.registrations})) {
          return this.setState({rfidMessage: '重複的RFID: ' + this.state.editValue.pacerEpc})
        }
      } else if (model === 'reg') {
        if (!validateRfid({input: this.state.editValue.epc, regs: this.props.registrations, pacerEpc: this.props.event.pacerEpc})) {
          return this.setState({rfidMessage: '重複的RFID: ' + this.state.editValue.epc})
        }
      }
      if (!this.state.editValue.id) {
        switch (model) {
          case 'group':
            stateObj.groupSelected = -1
            break
          case 'race':
            stateObj.groupSelected = this.state.groupSelected
            stateObj.raceSelected = -1
            break
          case 'reg':
            stateObj.groupSelected = this.state.groupSelected
            stateObj.raceSelected = -1
            stateObj.regSelected = -1
            break
        }
        this.dispatch(eventActions.submit(model, this.state.editValue, onSuccess))
      } else {
        stateObj.editModel = this.state.editModel
        stateObj.editValue = { id: this.state.editValue.id }
        this.dispatch(eventActions.update(model, this.state.editValue, onSuccess))
      }
    }
  }
  updateListArrays (stateObjRaw) {
    let stateObj = {...stateObjRaw}
    if (stateObj.groupSelected === undefined) { stateObj.groupSelected = this.state.groupSelected }
    if (stateObj.raceSelected === undefined) { stateObj.raceSelected = this.state.raceSelected }
    if (stateObj.regSelected === undefined) { stateObj.regSelected = this.state.regSelected }
    // case 1: 選了race, case 2: 選了group,  case 3: 都沒選
    if (stateObj.raceSelected !== -1) {
      stateObj.racesFiltered = this.props.races.filter(V => (V.group === this.props.groups[stateObj.groupSelected].id))
      stateObj.regsFiltered = []
      this.state.racesFiltered[stateObj.raceSelected].registrationIds.map(regId => {
        this.props.registrations.map(reg => {if (regId === reg.id) { stateObj.regsFiltered.push(reg) }})
      })
    } else if (stateObj.groupSelected !== -1) {
      stateObj.racesFiltered = this.props.races.filter(V => (V.group === this.props.groups[stateObj.groupSelected].id))
      stateObj.regsFiltered = this.props.registrations.filter(V => (V.group === this.props.groups[stateObj.groupSelected].id))
    } else {
      stateObj.racesFiltered = []
      stateObj.regsFiltered = []
    }
    this.setState(stateObj)
  }
  handleSelect (model, index) {
    return (e) => {
      let stateObj = {}
      if (model === 'group') {
        stateObj.groupSelected = (this.state.groupSelected === index) ? -1 : index
        stateObj.raceSelected = -1
        stateObj.regSelected = -1
      } else if (model === 'race') {
        stateObj.groupSelected = this.state.groupSelected
        stateObj.raceSelected = (this.state.raceSelected === index) ? -1 : index
        stateObj.regSelected = -1
      } else if (model === 'reg') {
        stateObj.groupSelected = this.state.groupSelected
        stateObj.raceSelected = this.state.raceSelected
        stateObj.regSelected = (this.state.regSelected === index) ? -1 : index
      }
      this.updateListArrays(stateObj)
    }
  }
  render () {
    const { event, groups, location, match, nameTables, races, registrations } = this.props
    const { editModel, editValue, groupSelected, racesFiltered, raceSelected, regSelected, regsFiltered, modified, rfidMessage } = this.state
    if (!match.params.uniqueName) {
      return <Redirect to={{pathname: '/console'}} />
    } else if (!event) {
      return <div><Header location={location} nav='event' match={match} /><div className={css.loading}>Loading...</div></div>
    }

    let arraylist = { group: groups, race: racesFiltered, reg: regsFiltered }
    let original
    let overlay
    if (editModel === 'advRules') {
      overlay = <AdvRule groupId={groups[groupSelected].id} handleCancelEdit={this.handleCancelEdit} />
    } else if (editModel === 'assignReg') {
      overlay = <AssignReg groupId={groups[groupSelected].id} group={groups[groupSelected]} handleCancelEdit={this.handleCancelEdit} />
    } else if (editModel !== undefined) {
      if (editValue.id) {
        switch (editModel) {
        case 'event':
          original = event
          break
        case 'group':
          original = groups[groupSelected]
          break
        case 'race':
          original = {...racesFiltered[raceSelected]}
          break
        case 'reg':
          original = regsFiltered[regSelected]
          break
        }
      }
      overlay = render.infoForm({ editModel, editValue, original, modified, onChange: this.handleInput, onSubmit: this.handleSubmit, onCancel: this.handleCancelEdit, onDelete: this.handleDelete, rfidForm: (render.rfidForm[editModel]) ? render.rfidForm[editModel]({ editValue, original, rfidMessage, handleInputRfid: this.handleInputRfid }) : '' })
    }
    return (<div className={editModel ? css.fixed : css.wrap}><Header location={location} nav='event' match={match} />
      <div className={css.mainBody}>
        {render.event({event, onEdit: this.handleStartEdit('event', event)})}
        <div className={css.listHds}>
          <div className={css.hd}>
            <span>組別</span>{render.hd.group({ groupSelected, raceSelected, regSelected, array: arraylist.group, handleStartEdit: this.handleStartEdit })}
          </div>
          <div className={css.hd}>
            <span>賽事</span>{render.hd.race({ groupSelected, raceSelected, regSelected, array: arraylist.race, handleStartEdit: this.handleStartEdit })}
          </div>
          <div className={css.hd}>
            <span>選手</span>{render.hd.reg({ groupSelected, raceSelected, regSelected, array: arraylist.reg, handleStartEdit: this.handleStartEdit })}
          </div>
        </div>
        <div className={css.managerList}>
          {render.list({model: 'group', array: arraylist.group, state: this.state, onSelect: this.handleSelect, handleStartEdit: this.handleStartEdit})}
          {render.list({model: 'race', array: arraylist.race, state: this.state, onSelect: this.handleSelect, handleStartEdit: this.handleStartEdit})}
          {render.list({model: 'reg', array: arraylist.reg, state: this.state, onSelect: this.handleSelect, handleStartEdit: this.handleStartEdit})}
        </div>
      </div>
        <Dialogue content={overlay} />
    </div>)
  }
}
