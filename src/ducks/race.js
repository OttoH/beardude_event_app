/* global fetch, SERVICE_URL */

// types
const ACTION_ERR = 'race/ACTION_ERR'
const DELETE_RACE = 'event/DELETE_RACE'
const GET_RACES = 'race/GET_RACES'
const CONTROL_RACE = 'event/CONTROL_RACE'
const SUBMIT_RACE = 'event/SUBMIT_RACE'

const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
// actions
export const actionCreators = {
  getRaces: (eventId) => async (dispatch) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/races`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        return dispatch({type: GET_RACE, payload: {...res}})
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得比賽內容失敗'}})
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
      let response = await fetch(`${SERVICE_URL}/api/race/submitResult`, returnPostHeader({ id: raceObj.id, result: raceObj.result, advance: returnRegsToRaces(raceObj) }))
      let res = await response.json()
      if (response.status === 200) {
        response = await fetch(`${SERVICE_URL}/api/group/mgmtInfo/${raceObj.group}`, {credentials: 'same-origin'})
        res = await response.json()
        dispatch({type: GET_RACE, payload: {...res}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '送出比賽結果失敗: ' + e}})
    }
  }
}

// reducers
const initialState = {
  race: undefined
}
export const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
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
  }
  return state
}

export default reducer
