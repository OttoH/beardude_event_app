/* global fetch, SERVICE_URL */

import processData from 'processData'

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
        dispatch({type: GET_EVENT, payload: {...res}})
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
                let output = {...race, recordsHashTable: processData.returnDeferredHashTable(race.recordsHashTable, time)}
                output.raceStatus = processData.returnDeferredRaceStatus(output.raceStatus, latency, output.endTime)
                return output
              })
              dispatch({type: UPDATE_RACES, payload: {races: newRaces}})
              successCallback()
            }, time + allowance)
          })
        }
      }
      if (response.status === 200) {
        let deferredTimes = []
        const races = res.races.map((V, I) => {
          let output = {...V}
          let defer = []
          output.recordsHashTable = processData.returnDeferredHashTable(output.recordsHashTable, res.event.resultLatency)
          output.raceStatus = processData.returnDeferredRaceStatus(output.raceStatus, res.event.resultLatency, output.endTime)
          defer = processData.returnDeferredTimeArray(V.recordsHashTable, output.recordsHashTable, res.event.resultLatency)
          deferredTimes = deferredTimes.concat(defer)
          return output
        })
        dispatch({type: GET_EVENT, payload: {...res, races: races}})
        successCallback()
        updateRacesLater(deferredTimes, races, res.event.resultLatency, res.registrations)
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
        dispatch({type: CONTROL_RACE, payload: {...res, action: action, registrations: getState().event.registrations}})
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
        dispatch({type: types[model], payload: {...res, registrations: getState().event.registrations}})
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
        dispatch({type: types[model], payload: {...res, registrations: getState().event.registrations}})
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
  updateRaceOnTheFly: (raceObj) => (dispatch, getState) => {
    dispatch({type: UPDATE_RACE, payload: raceObj})
  },
  updateRaceResultOnTheFly: (racesObj) => (dispatch, getState) => {
    dispatch({type: UPDATE_RACES, payload: {...racesObj, registrations: getState().event.registrations}})
  },
  submitRaceResult: (raceObj, successCallback) => async (dispatch, getState) => {
    const result = processData.returnTrimmedResult(raceObj.result, raceObj.laps)
    const advance = processData.returnRegsToRaces(raceObj)
    try {
      const response = await fetch(`${SERVICE_URL}/api/race/submitResult`, returnPostHeader({ id: raceObj.id, result: result, advance: advance }))
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: UPDATE_RACES, payload: {...res, registrations: getState().event.registrations}})
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
        dispatch({type: UPDATE_RACE, payload: {...res, registrations: getState().event.registrations}})
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
        dispatch({type: UPDATE_RACES, payload: {...res, registrations: getState().event.registrations}})
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
      if (payload.event.id) {
        const races = payload.races.map(V => ({...V, result: processData.returnRaceResult(V, payload.registrations)}))
        return {...state, event: payload.event, groups: payload.groups, races: races, registrations: payload.registrations, nameTables: { group: processData.returnIdNameMap(payload.groups), race: processData.returnIdNameMap(payload.races), reg: processData.returnRegMap(payload.registrations) }}
      }
      return {...state, event: payload.event}
    }
    case CONTROL_RACE: {
      let nextState = {...state}
      nextState.races = nextState.races.map(V => {
        if (V.id !== payload.race.id) { return V }
        return {...payload.race, result: processData.returnRaceResult(payload.race, payload.registrations)}
      })
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
      let race = {...payload.race, result: processData.returnRaceResult(payload.race, payload.registrations)}
      return {...state, races: [...state.races, race]}
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
      nextState.races = nextState.races.map(V => {
        if (V.id !== payload.race.id) { return V }
        return {...payload.race, result: processData.returnRaceResult(payload.race, payload.registrations)}
      })
      return nextState
    }
    case UPDATE_RACES: {
      let nextState = {...state}
      nextState.races = nextState.races.map(race => {
        let output = race
        payload.races.map(V => { if (V.id === race.id) { output = V } })
        output.result = processData.returnRaceResult(output, payload.registrations)
        return output
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
