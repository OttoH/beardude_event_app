/* global fetch, SERVICE_URL */

// types
const ACTION_ERR = 'event/ACTION_ERR'
const DELETE_EVENT = 'event/DELETE_EVENT'
const DELETE_GROUP = 'event/DELETE_GROUP'
const DELETE_RACE = 'event/DELETE_RACE'
const DELETE_REG = 'event/DELETE_REG'
const EVENT_ERR = 'event/EVENT_ERR'
const GET_EVENT = 'event/GET_EVENT'
const GET_EVENT_NEW = 'event/GET_EVENT_NEW'
const GET_EVENTS = 'event/GET_EVENTS'
const GET_GROUP = 'event/GET_GROUP'
const GET_RACE = 'event/GET_RACE'
const UPDATE_ONGOING_RACE = 'event/UPDATE_ONGOING_RACE'
const CONTROL_RACE = 'event/CONTROL_RACE'
const SUBMIT_EVENT = 'event/SUBMIT_EVENT'
const SUBMIT_GROUP = 'event/SUBMIT_GROUP'
const SUBMIT_RACE = 'event/SUBMIT_RACE'
const SUBMIT_REG = 'event/SUBMIT_REG'

const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
// actions
const returnRacesByOrder = (races, order) => {
  let result = []
  order.map(raceId => { races.map(race => { if (race.id === raceId) { result.push(race) } }) })
  return result
}
const returnFormattedTime = (milS) => {
  const sec = ((milS % 60000) / 1000).toFixed(2)
  const min = Math.floor(milS / 60000)
  return min + ':' + (sec < 10 ? '0' : '') + sec
}
const returnLapRecord = (result, laps, startTime, raceStatus) => {
  let output = []
  let lastRecord = startTime
  let lapsLeft = laps
  let i

  if (result.length > 0) {
    for (i = 1; i <= result.length; i += 1) {
      if (result[i]) {
        output.push(processData.returnFormattedTime(result[i] - lastRecord))
        lastRecord = result[i]
        lapsLeft -= 1
      } else if (lapsLeft > 0 && raceStatus === 'started') {
        output.push('🕒')
        lapsLeft -= 1
      }
    }
  }
  for (i = 0; i < lapsLeft; i += 1) { output.push('-') }
  return output
}
const returnAdvanceToId = (index, advancingRules) => {
  for (var i = 0; i < advancingRules.length; i += 1) {
    if (index >= advancingRules[i].rankFrom && index <= advancingRules[i].rankTo) { return advancingRules[i].toRace }
  }
  return undefined
}
const returnRaceResult = (race) => {
  let sortTable = []
  let incomplete = []
  let notStarted = []
  const lastRecordIndex = race.laps

  race.registrations.map(reg => {
    const record = race.recordsHashTable[reg.epc]
    if (record) {
      if (record[lastRecordIndex]) {
        sortTable.push([reg.epc, reg.id, reg.raceNumber, record[lastRecordIndex], record.length - 1, record])
      } else {
        incomplete.push([reg.epc, reg.id, reg.raceNumber, record[record.length - 1], record.length - 1, record])
      }
    } else {
      notStarted.push([reg.epc, reg.id, reg.raceNumber, 0, 0, [], reg.id])
    }
  })
  sortTable.sort((a, b) => a[3] - b[3]) // sort completed racer by last lap record
  incomplete.sort((a, b) => b[4] - a[4]) // sort incompleted by laps
  incomplete.sort((a, b) => (a[4] === b[4]) ? a[3] - b[3] : 0) // sort incompleted same-lap by time
  notStarted.sort((a, b) => a[2] - b[2]) // sort notStart by raceNumber
  sortTable = sortTable.concat(incomplete).concat(notStarted)
  // sortTable: [epc, name, raceNumber, timestamp, laps, record]
  return sortTable.map((item, index) => ({ epc: item[0], registration: item[1], sum: (item[3]) ? processData.returnFormattedTime(item[3] - race.startTime) : '-', laps: item[4], lapRecords: processData.returnLapRecord(item[5], race.laps, race.startTime, race.raceStatus), advanceTo: returnAdvanceToId(index, race.advancingRules) }))
}
const returnTrimmedResult = (result, laps) => {
  let output = []
  const lastRecordIndex = laps - 1
  result.map(V => {
    let final = V
    if (V.lapRecords.length > (lastRecordIndex + 1)) {
      // 只取 lastRecordIndex + 1筆資料
      V.lapRecords.splice(lastRecordIndex + 1, (V.lapRecords.length - (lastRecordIndex + 1)))
    }
  })
  return result
}
export const actionCreators = {
  delete: (state, successCallback) => async (dispatch) => {
    const types = { event: DELETE_EVENT, group: DELETE_GROUP, race: DELETE_RACE, reg: DELETE_REG }
    try {
      const response = await fetch(`${SERVICE_URL}/api/${state.model}/delete/${state.original.id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: types[state.model], payload: {...res, state: state}})
        if (state.model !== 'event') { successCallback() }
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  getEvents: () => async (dispatch) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/event/getEvents`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        return dispatch({type: GET_EVENTS, payload: res})
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得活動失敗'}})
    }
  },
  getEvent: (id, successCallback) => async (dispatch) => {
    if (id === 'new') {
      dispatch({type: GET_EVENT, payload: { event: { groups: [] } }})
      return successCallback()
    }
    try {
      const response = await fetch(`${SERVICE_URL}/api/event/mgmtInfo/${id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: GET_EVENT, payload: {...res}})
        if (successCallback !== undefined) {
          successCallback()
        }
        return
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得活動內容失敗'}})
    }
  },
  getEventNew: (uniqueName, successCallback) => async (dispatch) => {
    if (uniqueName === 'new') {
      dispatch({type: GET_EVENT, payload: { event: { groups: [] } }})
      return successCallback()
    }
    try {
      const response = await fetch(`${SERVICE_URL}/api/event/info/${uniqueName}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        let races = returnRacesByOrder(res.races, res.event.raceOrder).map(V => {
          var output = {...V}
          if (output.raceStatus !== 'init' && output.result.length === 0) { output.result = returnRaceResult(V) }
          return output
        })
        dispatch({type: GET_EVENT_NEW, payload: {...res, races: races}})
        if (successCallback !== undefined) {
          successCallback()
        }
        return
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: e}})
    }
  },
  ///api/event/info/:uniqueName
  getRace: (id) => async (dispatch) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/mgmtInfo/${id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        return dispatch({type: GET_RACE, payload: {...res}})
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得比賽內容失敗'}})
    }
  },
  controlRace: (action, object, successCallback) => async (dispatch) => {
    try {
      let response = await fetch(`${SERVICE_URL}/api/race/${action}`, returnPostHeader(object))
      let res = await response.json()
      if (response.status === 200) {
        response = await fetch(`${SERVICE_URL}/api/race/mgmtInfo/${object.id}`, {credentials: 'same-origin'})
        res = await response.json()
        dispatch({type: CONTROL_RACE, payload: {...res, raceId: object.id, action: action}})
        if (successCallback !== undefined) {
          successCallback()
        }
        return
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '開始比賽失敗: ' + e}})
    }
  },
  submit: (state, successCallback) => async (dispatch) => {
    const types = { event: SUBMIT_EVENT, group: SUBMIT_GROUP, race: SUBMIT_RACE, reg: SUBMIT_REG }
    const pathname = (state.original.id) ? 'update' : 'create'
    try {
      const response = await fetch(`${SERVICE_URL}/api/${state.model}/${pathname}`, returnPostHeader({...state.modified, id: state.original.id}))
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: types[state.model], payload: {...res, state: state}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  submitRaceResult: (raceObj, successCallback) => async (dispatch) => {
    // {races: [{id: ID, toAdd: [ID, ID, ID], toRemove: ID, ID, ID}, {}, {}]}
    const returnRegsToRaces = (race) => race.advancingRules.map(rule => {
      let obj = { id: rule.toRace, toAdd: [], toRemove: [] }
      race.result.map(V => obj[(V.advanceTo === rule.toRace) ? 'toAdd' : 'toRemove'].push(V.registration))
      return obj
    })
    try {
      let response = await fetch(`${SERVICE_URL}/api/race/submitResult`, returnPostHeader({ id: raceObj.id, result: returnTrimmedResult(raceObj.result. raceobj.laps), advance: returnRegsToRaces(raceObj) }))
      let res = await response.json()
      if (response.status === 200) {
        response = await fetch(`${SERVICE_URL}/api/group/mgmtInfo/${raceObj.group}`, {credentials: 'same-origin'})
        res = await response.json()
        dispatch({type: GET_GROUP, payload: {...res, id: raceObj.group}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '送出比賽結果失敗: ' + e}})
    }
  },
  submitAdvancingRules: (state, successCallback) => async (dispatch) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/update`, returnPostHeader({id: state.raceId, advancingRules: state.modified}))
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: GET_RACE, payload: {...res, state: state}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  submitRegsToRaces: (groupId, groupIndex, obj, successCallback) => async (dispatch, getState) => {
    try {
      let response = await fetch(`${SERVICE_URL}/api/race/assignRegsToRaces`, returnPostHeader({races: obj}))
      let res = await response.json()
      if (response.status === 200) {
        response = await fetch(`${SERVICE_URL}/api/group/mgmtInfo/${groupId}`, {credentials: 'same-origin'})
        res = await response.json()
        if (response.status === 200) {
          dispatch({type: GET_GROUP, payload: {...res, index: groupIndex}})
          return successCallback(res.group)
        }
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  updateOngoingRace: (raceObj) => (dispatch) => {
    dispatch({ type: UPDATE_ONGOING_RACE, payload: { race: raceObj } })
  }
}

// reducers
const initialState = {
  event: undefined,
  groups: [],
  races: [],
  registrations: [],
  events: []
}
export const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case ACTION_ERR: {
      return {...state, error: payload.error}
    }
    case DELETE_EVENT: {
      return {...state, event: -1}
    }
    case DELETE_GROUP: {
      let nextState = {...state}
      nextState.event.groups.splice(payload.state.groupSelected, 1)
      return nextState
    }
    case DELETE_RACE: {
      let nextState = {...state}
      nextState.event.groups[payload.state.groupSelected].races.splice(payload.state.raceSelected, 1)
      return nextState
    }
    case DELETE_REG: {
      let nextState = {...state}
      nextState.event.groups[payload.state.groupSelected].registrations.splice(payload.state.regSelected, 1)
      return nextState
    }
    case GET_EVENTS: {
      return {...state, events: payload.events}
    }
    case GET_EVENT: {
      return {...state, event: payload.event}
    }
    case GET_EVENT_NEW: {
      return {...state, event: payload.event, groups: payload.groups, races: payload.races, registrations: payload.registrations}
    }
    case GET_RACE: {
      let nextState = {...state}
      nextState.event.groups.map((group, gIndex) => {
        group.races.map((race, rIndex) => {
          if (race.id === payload.race.id) {
            nextState.event.groups[gIndex].races[rIndex] = {...payload.race}
          }
        })
      })
      return nextState
    }
    case GET_GROUP: {
      let nextState = {...state}
      if (payload.index) {
        nextState.event.groups[payload.index] = payload.group
      } else if (payload.id) {
        nextState.event.groups.map((V, I) => {
          if (V.id === payload.id) { nextState.event.groups[I] = payload.group }
        })
      }
      return nextState
    }
    case CONTROL_RACE: {
      let nextState = {...state}
      nextState.event.groups.map((group, gIndex) => {
        group.races.map((race, rIndex) => {
          if (race.id === payload.raceId) {
            nextState.event.groups[gIndex].races[rIndex] = {...payload.race}
          }
        })
      })
      if (payload.action === 'start') {
        nextState.event.ongoingRace = payload.raceId
      } else if (payload.action === 'reset') {
        nextState.event.ongoingRace = -1
      }
      return nextState
    }
    case SUBMIT_EVENT: {
      return {...state, event: {...payload.event, groups: [...state.event.groups]}}
    }
    case SUBMIT_GROUP: {
      let nextState = {...state}
      const group = state.event.groups[payload.state.groupSelected] || {...payload.group, races: [], registrations: []}
      if (state.event.groups.length === payload.state.groupSelected) {
        nextState.event.groups.push(group)
      } else {
        nextState.event.groups[payload.state.groupSelected] = {...payload.group, races: group.races, registrations: group.registrations}
      }
      return nextState
    }
    case SUBMIT_RACE: {
      let nextState = {...state}
      if (state.event.groups[payload.state.groupSelected].races.length === payload.state.raceSelected) {
        nextState.event.groups[payload.state.groupSelected].races.push({...payload.race, registrations: []})
      } else {
        nextState.event.groups[payload.state.groupSelected].races[payload.state.raceSelected] = payload.race
      }
      return nextState
    }
    case SUBMIT_REG: {
      let nextState = {...state}

      // group's reg
      if (state.event.groups[payload.state.groupSelected].registrations.length === payload.state.regSelected) {
        nextState.event.groups[payload.state.groupSelected].registrations.push({...payload.registration})
      } else {
        nextState.event.groups[payload.state.groupSelected].registrations[payload.state.regSelected] = payload.registration
      }
      return nextState
    }
    case EVENT_ERR: {
      return {...state, event: -1}
    }
    case UPDATE_ONGOING_RACE: {
      let nextState = {...state}
      nextState.races = nextState.races.map(V => {
        let output = {...V}
        if (V.id === payload.race.id) {
          output.recordsHashTable = payload.recordsHashTable
          output.result = returnRaceResult(output)
        }
        return output
      })
      return nextState
    }
  }
  return state
}

export default reducer
