import React from 'react'
import { StandardComponent } from '../BaseComponent'
import Button from '../Button'
import { actionCreators as eventActions } from '../../ducks/event'

import css from './style.css'

const returnInitStateObj = (racesRaw, regsRaw, groupId) => {
  const races = racesRaw.filter(V => (V.group === groupId && V.isEntryRace))
  const regs = regsRaw.filter(V => (V.group === groupId))
  let stateObj = { entrysRegs: [...races], unassignedRegs: [{ regs: [] }] }
  stateObj.entrysRegs = stateObj.entrysRegs.map(V => ({...V, regs: []}))
  regs.map(regV => {
    let found
    const regObj = { id: regV.id, name: regV.name, raceNumber: regV.raceNumber }
    stateObj.entrysRegs.map((V, I) => {
      if (V.registrationIds.indexOf(regV.id) > -1) {
        stateObj.entrysRegs[I].regs.push(regObj)
        found = true
      }
    })
    if (!found) { stateObj.unassignedRegs[0].regs.push(regObj) }
  })
  return stateObj
}

class AssignReg extends StandardComponent {
  constructor (props) {
    super(props)
    this.groupId = props.groupId
    const stateObj = returnInitStateObj(this.props.races, this.props.registrations, this.groupId)
    this.state = {
      entrysRegs: stateObj.entrysRegs,
      unassignedRegs: stateObj.unassignedRegs,
      autoAssign: false,
      modified: false
    }
    // {id: ID, regs: []}
    this.dispatch = this.props.dispatch
    this._bind('handleAutoAssign', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleSubmit', 'initializeState')
  }
  handleAutoAssign () {
//    const shuffleArray = (arr) => arr.sort(() => (Math.random() - 0.5))
    let stateObj = {autoAssign: true, entrysRegs: [...this.state.entrysRegs], unassignedRegs: [...this.state.unassignedRegs], modified: true}
    const groupRegs = this.props.registrations.filter(V => (V.group === this.props.group.id))
    const slots = Math.floor(groupRegs.length / stateObj.entrysRegs.length)
    stateObj.entrysRegs.map((race, i) => {
      const availableSlots = slots - race.regs.length
      let newRegs = stateObj.unassignedRegs[0].regs.splice(0, availableSlots)
      newRegs = newRegs.map(reg => ({...reg, toAdd: true}))
      stateObj.entrysRegs[i].regs = stateObj.entrysRegs[i].regs.concat(newRegs)
    })
    if (stateObj.unassignedRegs[0].regs.length > 0) {
      stateObj.unassignedRegs[0].regs.map((reg, index) => {
        stateObj.entrysRegs[index].regs.push({...reg, toAdd: true})
      })
      stateObj.unassignedRegs[0].regs = []
    }
    this.setState(stateObj)
  }
  handleSubmit () {
    const onSuccess = () => {
      const stateObj = returnInitStateObj(this.props.races, this.props.registrations, this.groupId)
      this.setState({...stateObj, autoAssign: false, modified: false })
    }
    let submitObject = []
    this.state.entrysRegs.map(race => {
      let obj = {id: race.id, registrationIds: []}
      let toSubmit
      race.regs.map(reg => {
        if (reg.toAdd || reg.toRemove) { toSubmit = true }
        if (!reg.toRemove) { obj.registrationIds.push(reg.id) }
      })
      if (toSubmit) { submitObject.push(obj) }
    })
    if (submitObject.length > 0) {
      this.dispatch(eventActions.submitRaces(submitObject, onSuccess))
    } else {
      this.setState({modified: false})
    }
  }
  handleDragStart (fromState, itemIndex, fromIndex) {
    return (e) => {
      this.itemIndex = itemIndex
      this.fromState = fromState
      this.fromIndex = fromIndex
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
    const returnExistingReg = (reg, toRegs) => {
      let result
      toRegs.map(V => { if (reg.id === V.id) { result = V }})
      return result
    }
    let stateObj = {
      unassignedRegs: this.state.unassignedRegs,
      entrysRegs: this.state.entrysRegs,
      modified: true
    }
    const { itemIndex, fromState, fromIndex, toState, toIndex } = this
    if (fromState === toState && fromIndex === toIndex) { return }
    // 處理 toState
    const reg = stateObj[fromState][fromIndex].regs[itemIndex]
    let existingReg = returnExistingReg(reg, stateObj[toState][toIndex].regs)
    if (existingReg && existingReg.toRemove) {
      delete existingReg.toRemove
    } else {
      stateObj[toState][toIndex].regs.push({...reg, toAdd: true})
    }
    // 處理 fromState
    if (reg.toAdd) {
      stateObj[fromState][fromIndex].regs.splice(itemIndex, 1)
    } else {
      stateObj[fromState][fromIndex].regs[itemIndex].toRemove = true
    }
    this.setState(stateObj)
  }
  render () {
    const { modified, unassignedRegs, entrysRegs } = this.state
    const renderMoveBit = ({stateName, reg, regIndex, raceIndex}) => <li className={(reg.toAdd || reg.toRemove) ? css.modifiedMoveBit : css.moveBit} draggable='true' key={'move' + reg.id} onDragStart={this.handleDragStart(stateName, regIndex, raceIndex)} onDragEnd={this.handleDragEnd}>{reg.raceNumber} {(reg.nameCht) ? reg.nameCht : reg.name}</li>

    return (<div className={css.assignReg}>
      <h3>選手分組</h3>
      <h4>{this.state.signal}</h4>
      <div>
        <div className={css.unassign} onDragOver={this.handleDragOver('unassignedRegs', 0)}>
          {(unassignedRegs[0].regs.length > 0) &&
            <div className={css.auto}><Button style='shortGrey' text='自動分配選手' onClick={this.handleAutoAssign} /></div>
          }
          <h5 className={css.inlineB}>尚未分組</h5>
          <ul>{unassignedRegs[0].regs.map((reg, regIndex) => (!reg.toRemove) && (renderMoveBit({ stateName: 'unassignedRegs', reg, regIndex, raceIndex: 0 })))}</ul>
        </div>
        <label className={css.inlineB}>初賽</label>
        <ul className={css.races}>{entrysRegs.map((race, raceIndex) => <li key={`race${race.id}`} onDragOver={this.handleDragOver('entrysRegs', raceIndex)}>
          <h5>{(race.nameCht) ? race.nameCht : race.name} <span className={css.count}>{race.regs.length > 0 && race.regs.filter(reg => !reg.toRemove).length} / {race.racerNumberAllowed}</span></h5>
          <ul>{race.regs.map((reg, regIndex) => (!reg.toRemove) && (renderMoveBit({stateName: 'entrysRegs', reg, regIndex, raceIndex})))}</ul>
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
