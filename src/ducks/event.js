/* global fetch, SERVICE_URL */

// types
const ACTION_ERR = 'action/ERR'

const DELETE_EVENT = 'event/DELETE'
const DELETE_GROUP = 'group/DELETE'
const DELETE_RACE = 'race/DELETE'
const DELETE_REG = 'registration/DELETE'

const GET_EVENT = 'event/GET_EVENT'
const GET_EVENTS = 'event/GET_EVENTS'
const CONTROL_RACE = 'event/CONTROL_RACE'

const SUBMIT_EVENT = 'event/SUBMIT_EVENT'
const SUBMIT_GROUP = 'event/SUBMIT_GROUP'
const SUBMIT_RACE = 'event/SUBMIT_RACE'
const SUBMIT_REG = 'event/SUBMIT_REG'

const UPDATE_EVENT_LATENCY = 'event/UPDATE_EVENT_LATENCY'
const UPDATE_GROUP = 'event/UPDATE_GROUP'
const UPDATE_RACE = 'event/UPDATE_RACE'
const UPDATE_RACES = 'event/UPDATE_RACES'
const UPDATE_REG = 'event/UPDATE_REG'

const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
const returnRacesByOrder = (races, order) => {
  let result = []
  order.map(raceId => { races.map(race => { if (race.id === raceId) { result.push(race) } }) })
  return result
}
const returnIdNameMap = (objs) => {
  let result = {}
  if (objs && objs.length > 0) { objs.map(obj => { result[obj.id] = obj.nameCht }) }
  return result
}
const returnRegMap = (objs) => {
  let result = {}
  if (objs && objs.length > 0) { objs.map(obj => { result[obj.id] = obj }) }
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
        output.push(returnFormattedTime(result[i] - lastRecord))
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
const returnRaceResult = (race, regs) => {
  let sortTable = []
  let incomplete = []
  let notStarted = []
  const lastRecordIndex = race.laps

  race.registrationIds.map(regId => {
    const reg = regs.filter(V => (V.id === regId))[0]
    if (reg) {
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
    }
  })
  sortTable.sort((a, b) => a[3] - b[3]) // sort completed racer by last lap record
  incomplete.sort((a, b) => b[4] - a[4]) // sort incompleted by laps
  incomplete.sort((a, b) => (a[4] === b[4]) ? a[3] - b[3] : 0) // sort incompleted same-lap by time
  notStarted.sort((a, b) => a[2] - b[2]) // sort notStart by raceNumber
  sortTable = sortTable.concat(incomplete).concat(notStarted)
  // sortTable: [epc, name, raceNumber, timestamp, laps, record]
  return sortTable.map((item, index) => ({ epc: item[0], registration: item[1], sum: (item[3]) ? returnFormattedTime(item[3] - race.startTime) : '-', laps: item[4], lapRecords: returnLapRecord(item[5], race.laps, race.startTime, race.raceStatus), advanceTo: returnAdvanceToId(index, race.advancingRules) }))
}
// {races: [{id: ID, toAdd: [ID, ID, ID], toRemove: ID, ID, ID}, {}, {}]}
const returnRegsToRaces = (race) => race.advancingRules.map(rule => {
  let obj = { id: rule.toRace, toAdd: [], toRemove: [] }
  race.result.map(V => obj[(V.advanceTo === rule.toRace) ? 'toAdd' : 'toRemove'].push(V.registration))
  return obj
})
const returnTrimmedResult = (result, laps) => {
  const lastRecordIndex = laps - 1
  result.map(V => {
    if (V.lapRecords.length > (lastRecordIndex + 1)) {
      // 只取 lastRecordIndex + 1筆資料
      V.lapRecords.splice(lastRecordIndex + 1, (V.lapRecords.length - (lastRecordIndex + 1)))
    }
  })
  return result
}
const returnDeferredHashTable = (hashTable, latency) => {
  const now = Date.now()
  let output = {}
  for (var i in hashTable) {
    let result = []
    hashTable[i].map(V => { if ((V + latency) <= now) { result.push(V) } })
    output[i] = result
  }
  return output
}
const returnDeferredTimeArray = (orgHashTable, trimmedHashTable, latency) => {
  const now = Date.now()
  let deferredTimes = []
  for (let i in orgHashTable) {
    let updateCount = orgHashTable[i].length - trimmedHashTable[i].length
    for (let j = 0; j < updateCount; j += 1) {
      deferredTimes.push((latency + now) - orgHashTable[i][orgHashTable[i].length - 1 - j])
    }
  }
  return deferredTimes
}
const returnDeferredRaceStatus = (raceStatus, latency, endTime) => {
  let output = raceStatus
  if (output === 'ended' || output === 'submitted') {
    if (endTime + latency > Date.now()) { output = 'started' }
  }
  return output
}
export const actionCreators = {
  delete: (model, id, successCallback) => async (dispatch) => {
    const types = { event: DELETE_EVENT, group: DELETE_GROUP, race: DELETE_RACE, reg: DELETE_REG }
    try {
      const response = await fetch(`${SERVICE_URL}/api/${model}/delete/${id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: types[model], payload: {...res}})
        return successCallback()
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
      dispatch({type: ACTION_ERR, payload: {error: '取得活動失敗'}})
    }
  },
  getEvent: (uniqueName, successCallback) => async (dispatch) => {
    if (uniqueName === 'new') {
      dispatch({type: GET_EVENT, payload: { event: {} }})
      return successCallback()
    }
    try {
      const response = await fetch(`${SERVICE_URL}/api/event/info/${uniqueName}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        let races = returnRacesByOrder(res.races, res.event.raceOrder)
        races = races.map(V => {
          let output = {...V}
          if (output.result.length === 0) {
            output.result = returnRaceResult(output, res.registrations)
          }
          return output
        })
        dispatch({type: GET_EVENT, payload: {...res, races: races}})
        if (successCallback !== undefined) {
          successCallback()
        }
        return
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  getEventPublic: (uniqueName, successCallback) => async (dispatch, getState) => {
    if (uniqueName === 'new') {
      dispatch({type: GET_EVENT, payload: { event: {} }})
      return successCallback()
    }
    try {
      const response = await fetch(`${SERVICE_URL}/api/event/info/${uniqueName}`, {credentials: 'same-origin'})
      const res = await response.json()
      const updateRacesLater = (deferredTimes, races, latency, regs) => {
        const allowance = 3000
        if (deferredTimes.length > 0) {
          deferredTimes.map(time => {
            setTimeout(function () {
              let newRaces = races.map(race => {
                let output = {...race, recordsHashTable: returnDeferredHashTable(race.recordsHashTable, time)}
                if (output.result.length === 0) { output.result = returnRaceResult(output, regs) }
                output.raceStatus = returnDeferredRaceStatus(output.raceStatus, latency, output.endTime)
                return output
              })
              dispatch({type: UPDATE_RACES, payload: {races: newRaces}})
              successCallback()
            }, time + allowance)
          })
        }
      }
      if (response.status === 200) {
        let orderedRaces = returnRacesByOrder(res.races, res.event.raceOrder)
        let deferredTimes = []
        let races = orderedRaces.map((V, I) => {
          let output = {...V}
          let defer = []
          output.recordsHashTable = returnDeferredHashTable(output.recordsHashTable, res.event.resultLatency)
          output.raceStatus = returnDeferredRaceStatus(output.raceStatus, res.event.resultLatency, output.endTime)
          if (output.result.length === 0) { output.result = returnRaceResult(output, res.registrations) }
          defer = returnDeferredTimeArray(V.recordsHashTable, output.recordsHashTable, res.event.resultLatency)
          deferredTimes = deferredTimes.concat(defer)
          return output
        })
        dispatch({type: GET_EVENT, payload: {...res, races: races}})
        successCallback()
        updateRacesLater(deferredTimes, orderedRaces, res.event.resultLatency, res.registrations)
        return
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  controlRace: (action, object, successCallback) => async (dispatch, getState) => {
    // start, end, reset
    try {
      let response = await fetch(`${SERVICE_URL}/api/race/${action}`, returnPostHeader(object))
      let res = await response.json()
      if (response.status === 200) {
        if (res.race.result.length === 0) {
          res.race.result = returnRaceResult(res.race, getState().event.registrations)
        }
        dispatch({type: CONTROL_RACE, payload: {...res, action: action}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: '開始比賽失敗: ' + e}})
    }
  },
  submit: (model, object, successCallback) => async (dispatch, getState) => {
    const types = { event: SUBMIT_EVENT, group: SUBMIT_GROUP, race: SUBMIT_RACE, reg: SUBMIT_REG }
    try {
      const response = await fetch(`${SERVICE_URL}/api/${model}/create`, returnPostHeader(object))
      let res = await response.json()
      if (response.status === 200) {
        if (model === 'race' && res.race.result.length === 0) {
          res.race.result = returnRaceResult(res.race, getState().event.registrations)
        }
        dispatch({type: types[model], payload: {...res}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  update: (model, object, successCallback) => async (dispatch, getState) => {
    const types = { event: SUBMIT_EVENT, group: UPDATE_GROUP, race: UPDATE_RACE, reg: UPDATE_REG }
    try {
      const response = await fetch(`${SERVICE_URL}/api/${model}/update`, returnPostHeader(object))
      let res = await response.json()
      if (response.status === 200) {
        if (model === 'race' && res.race.result.length === 0) {
          res.race.result = returnRaceResult(res.race, getState().event.registrations)
        }
        dispatch({type: types[model], payload: {...res}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  updateEventLatency: (obj) => async (dispatch) => {
    dispatch({type: UPDATE_EVENT_LATENCY, payload: obj})
  },
  updateRaceOnTheFly: (raceObjRaw) => (dispatch, getState) => {
    let raceObj = {...raceObjRaw}
    if (raceObj.race.result.length === 0) {
      raceObj.race.result = returnRaceResult(raceObj.race, getState().event.registrations)
    }
    dispatch({type: UPDATE_RACE, payload: raceObj})
  },
  updateRaceResultOnTheFly: (racesObjRaw) => (dispatch, getState) => {
    let racesObj = {...racesObjRaw}
    const regs = getState().event.registrations
    // racesObj.races = returnRacesByOrder(racesObj.races, getState().event.event.raceOrder)
    racesObj.races = racesObj.races.map(V => {
      let output = {...V}
      if (output.result.length === 0) {
        output.result = returnRaceResult(output, regs)
      }
      return output
    })
    dispatch({type: UPDATE_RACES, payload: racesObj})
  },
  submitRaceResult: (raceObj, successCallback) => async (dispatch, getState) => {
    const result = returnTrimmedResult(raceObj.result, raceObj.laps)
    const advance = returnRegsToRaces(raceObj)
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/submitResult`, returnPostHeader({ id: raceObj.id, result: result, advance: advance }))
      const res = await response.json()
      if (response.status === 200) {
        let racesNew = {...res.races}
        const regs = getState().event.registrations
        // racesObj.races = returnRacesByOrder(racesObj.races, getState().event.event.raceOrder)
        racesNew = racesNew.map(V => {
          let output = {...V}
          if (output.result.length === 0) {
            output.result = returnRaceResult(output, regs)
          }
          return output
        })
        dispatch({type: UPDATE_RACES, payload: { races: racesNew }})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: '送出比賽結果失敗: ' + e}})
    }
  },
  submitAdvancingRules: (state, successCallback) => async (dispatch, getState) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/update`, returnPostHeader({id: state.raceId, advancingRules: state.modified}))
      let res = await response.json()
      if (response.status === 200) {
        if (res.race.result.length === 0) {
          res.race.result = returnRaceResult(res.race, getState().event.registrations)
        }
        dispatch({type: UPDATE_RACE, payload: {...res}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  submitRegsToRaces: (obj, successCallback) => async (dispatch, getState) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/assignRegsToRaces`, returnPostHeader({races: obj}))
      let res = await response.json()
      if (response.status === 200) {
        let races = returnRacesByOrder(res.races, getState().event.event.raceOrder)
        const regs = getState().event.registrations
        races = races.map(V => {
          var output = {...V}
          if (output.result.length === 0) { output.result = returnRaceResult(V, regs) }
          return output
        })
        dispatch({type: UPDATE_RACES, payload: { races: races }})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  }
}

// reducers
const initialState = {
  event: undefined,
  groups: [],
  races: [],
  registrations: [],
  events: [],
  nameTables: { group: {}, race: {}, reg: {} }
}
export const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case ACTION_ERR: {
      return {...state, error: payload.error}
    }
    case DELETE_EVENT: {
      return {...state, event: undefined}
    }
    case DELETE_GROUP: {
      let nextState = {...state}
      state.groups.map((V, I) => { if (V.id === payload.group.id) { nextState.groups.splice(I, 1) } })
      return nextState
    }
    case DELETE_RACE: {
      let nextState = {...state}
      state.races.map((V, I) => { if (V.id === payload.race.id) { nextState.races.splice(I, 1) } })
      return nextState
    }
    case DELETE_REG: {
      let nextState = {...state}
      nextState.registrations.map((V, I) => { if (V.id === payload.registration.id) { nextState.registrations.splice(I, 1) } })
      if (payload.races && payload.races.length > 0) {
        nextState.races = nextState.races.map(race => {
          let result = race
          payload.races.map(V => { if (V.id === race.id) { result = V } })
          return result
        })
      }
      return nextState
    }
    case GET_EVENTS: {
      return {...state, events: payload.events}
    }
    case GET_EVENT: {
      if (payload.event.id) { return {...state, event: payload.event, groups: payload.groups, races: payload.races, registrations: payload.registrations, nameTables: { group: returnIdNameMap(payload.groups), race: returnIdNameMap(payload.races), reg: returnRegMap(payload.registrations) }} }
      return {...state, event: payload.event}
    }
    case CONTROL_RACE: {
      let nextState = {...state}
      nextState.races = nextState.races.map(V => (V.id === payload.race.id) ? payload.race : V)
      nextState.event.ongoingRace = (payload.action === 'start') ? payload.race.id : -1
      return nextState
    }
    case SUBMIT_EVENT: {
      return {...state, event: {...payload.event}}
    }
    case SUBMIT_GROUP: {
      return {...state, groups: [...state.groups, payload.group]}
    }
    case SUBMIT_RACE: {
      return {...state, races: [...state.races, payload.race]}
    }
    case SUBMIT_REG: {
      return {...state, registrations: [...state.registrations, payload.registration]}
    }
    case UPDATE_EVENT_LATENCY: {
      return {...state, event: {...state.event, resultLatency: payload.event.resultLatency}}
    }
    case UPDATE_GROUP: {
      let nextState = {...state}
      nextState.groups = nextState.groups.map((V, I) => (V.id === payload.group.id) ? payload.group : V)
      return nextState
    }
    case UPDATE_RACE: {
      let nextState = {...state}
      nextState.races = nextState.races.map(V => (V.id === payload.race.id) ? payload.race : V)
      return nextState
    }
    case UPDATE_RACES: {
      let nextState = {...state}
      nextState.races = nextState.races.map(race => {
        let result = race
        payload.races.map(V => { if (V.id === race.id) { result = V } })
        return result
      })
      return nextState
    }
    case UPDATE_REG: {
      let nextState = {...state}
      nextState.registrations = nextState.registrations.map((V, I) => (V.id === payload.registration.id) ? payload.registration : V)
      return nextState
    }
  }
  return state
}

export default reducer
