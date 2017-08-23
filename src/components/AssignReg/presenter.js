import React from 'react'
import { StandardComponent } from '../BaseComponent'
import Button from '../Button'
import { actionCreators as eventActions } from '../../ducks/event'
import css from './style.css'

const arraysAreEqual = (arrOrg, arrNew) => {
  if (arrOrg.length !== arrNew.length) { return false }
  if (arrNew.length === 0) { return true }
  let different
  if (arrNew.length > 0) { arrNew.map(V => { if (arrOrg.indexOf(V) === -1) { different = true } }) }
  return !different
}
const returnUnassignedRegIds = (races, regs) => {
  let regsInRaces = []
  let result = []
  races.map(race => (regsInRaces = regsInRaces.concat(race.registrationIds)))
  regs.map(reg => { if (regsInRaces.indexOf(reg.id) === -1) { result.push(reg.id) } })
  return result
}
const returnRaceById = (races, id) => races.filter(race => race.id === id)[0]
class AssignReg extends StandardComponent {
  constructor (props) {
    super(props)
    this.groupId = props.groupId
    this.regs = this.props.registrations.filter(V => (V.group === this.groupId))
    this.races = this.props.races.filter(V => (V.group === this.groupId && V.isEntryRace))
    this.unassigned = returnUnassignedRegIds(this.races, this.regs)
    this.state = {
      races: JSON.parse(JSON.stringify(this.races)),
      unassigned: [{ registrationIds: [...this.unassigned] }],
      modified: false
    }
    this.dispatch = this.props.dispatch
    this._bind('handleAutoAssign', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleSubmit', 'initializeState')
  }
  handleAutoAssign () {
    let stateObj = { races: this.state.races, unassigned: this.state.unassigned, modified: true }
    const slots = Math.floor(this.regs.length / this.races.length)
    stateObj.races.map((race, i) => {
      const availableSlots = slots - race.registrationIds.length
      let newRegs = stateObj.unassigned[0].registrationIds.splice(0, availableSlots)
      stateObj.races[i].registrationIds = stateObj.races[i].registrationIds.concat(newRegs)
    })
    if (stateObj.unassigned[0].registrationIds.length > 0) {
      stateObj.unassigned[0].registrationIds.map((reg, index) => {
        stateObj.races[index].registrationIds.push(reg)
      })
      stateObj.unassigned[0].registrationIds = []
    }
    this.setState(stateObj)
  }
  handleSubmit () {
    const onSuccess = () => {
      this.races = this.props.races.filter(V => (V.group === this.groupId && V.isEntryRace))
      this.unassigned = returnUnassignedRegIds(this.races, this.regs)
      this.setState({
        races: JSON.parse(JSON.stringify(this.races)),
        unassigned: [{ registrationIds: [...this.unassigned] }],
        modified: false
      })
    }
    let submitObject = []
    this.state.races.map((V, I) => {
      if (!arraysAreEqual(this.races[I].registrationIds, V.registrationIds)) { submitObject.push({ id: V.id, registrationIds: V.registrationIds }) }
    })
    if (submitObject.length > 0) { return this.dispatch(eventActions.submitRaces(submitObject, onSuccess)) }
    onSuccess()
  }
  handleDragStart (fromState, itemIndex, fromIndex) {
    return (e) => {
      this.fromState = fromState
      this.fromIndex = fromIndex
      this.itemIndex = itemIndex
    }
  }
  handleDragOver (toState, toIndex) {
    return (e) => {
      e.preventDefault()
      this.toState = toState
      this.toIndex = toIndex
    }
  }
  handleDragEnd (e) {
    const { itemIndex, fromState, fromIndex, toState, toIndex } = this
    if (fromState === toState && fromIndex === toIndex) { return }
    let stateObj = { unassigned: this.state.unassigned, races: this.state.races, modified: true }
    const regId = stateObj[fromState][fromIndex].registrationIds[itemIndex]
    stateObj[toState][toIndex].registrationIds.push(regId)
    stateObj[fromState][fromIndex].registrationIds.splice(itemIndex, 1)
    this.setState(stateObj)
  }
  render () {
    const { modified, races, unassigned } = this.state
    const { nameTables } = this.props
    const renderMoveBit = ({stateName, regId, regIndex, raceIndex, arrOrg}) => <li className={(arrOrg.indexOf(regId) === -1) ? css.modifiedMoveBit : css.moveBit} draggable='true' key={'move' + regId} onDragStart={this.handleDragStart(stateName, regIndex, raceIndex)} onDragEnd={this.handleDragEnd}>{nameTables.reg[regId].raceNumber} {(nameTables.reg[regId].nameCht) ? nameTables.reg[regId].nameCht : nameTables.reg[regId].name}</li>

    return (<div className={css.assignReg}>
      <h3>選手分組</h3>
      <h4>{this.state.signal}</h4>
      <div>
        <div className={css.unassign} onDragOver={this.handleDragOver('unassigned', 0)}>
          {(unassigned[0].registrationIds.length > 0) &&
            <div className={css.auto}><Button style='shortGrey' text='自動分配選手' onClick={this.handleAutoAssign} /></div>
          }
          <h5 className={css.inlineB}>尚未分組</h5>
          <ul>{unassigned[0].registrationIds.map((regId, regIndex) => (renderMoveBit({ stateName: 'unassigned', regId, regIndex, raceIndex: 0, arrOrg: this.unassigned })))}</ul>
        </div>
        <label className={css.inlineB}>初賽</label>
        <ul className={css.races}>{races.map((race, raceIndex) => <li key={`race${race.id}`} onDragOver={this.handleDragOver('races', raceIndex)}>
          <h5>{(race.nameCht) ? race.nameCht : race.name} <span className={css.count}>{race.registrationIds.length} / {race.racerNumberAllowed}</span></h5>
          <ul>{race.registrationIds.map((regId, regIndex) => (renderMoveBit({stateName: 'races', regId, regIndex, raceIndex, arrOrg: this.races[raceIndex].registrationIds})))}</ul>
        </li>)}</ul>
      </div>
      <div className={css.boxFt}>
        {modified ? <Button onClick={this.handleSubmit} text='儲存' /> : <Button style='disabled' text='儲存' />}
        <Button style='grey' onClick={this.props.handleCancelEdit} text='關閉' />
      </div>
    </div>)
  }
}

export default AssignReg
