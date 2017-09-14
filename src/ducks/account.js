import { AuthManager } from '../lib/auth'

const authManager = new AuthManager()

// types
const LOGIN = 'manager/LOGIN'
const LOGOUT = 'manager/LOGOUT'
const ACCOUNT_LOADING = 'manager/ACCOUNT_LOADING'
const ACCOUNT_INFO = 'manager/ACCOUNT_INFO'
const LOGIN_ERR = 'manager/LOGIN_ERR'

// actions
export const actionCreators = {
  accountLoading: () => (dispatch) => {
    dispatch({type: ACCOUNT_LOADING})
  },
  accountInfo: (user) => (dispatch) => {
    if (user) {
      dispatch({type: ACCOUNT_INFO, payload: user})
    }
  },
  login: (email, password) => (dispatch) => {
    authManager.loginWithEmail(email, password)
    .then((res) => {
      console.log('login success', res)
      dispatch({type: LOGIN, payload: res})
    }).catch((error) => {
      dispatch({type: LOGIN_ERR, payload: {errorCode: error.code, errorMessage: error.message}})
    })
  },
  logout: () => (dispatch, getState) => {
    authManager.logout()
    .then((res) => {
      console.log('logout success')
      dispatch({type: LOGOUT})
    })
    .catch((res) => {
      console.log('logout error', res)
      dispatch({type: LOGIN_ERR, payload: { errorCode: res.code, errorMessage: res.message }})
    })
  }
}

// reducers
const initialState = {
  isAccountLoading: false,
  isAuthenticated: false,
  manager: {},
  error: {}
}
const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case ACCOUNT_LOADING: {
      return ({...state, isAccountLoading: true})
    }
    case ACCOUNT_INFO: {
      return ({...state, manager: payload.providerData[0], isAuthenticated: true, isAccountLoading: false})
    }
    case LOGIN: {
      return {...state, manager: payload.providerData[0], isAuthenticated: true, isAccountLoading: false}
    }
    case LOGOUT: {
      return {...state, isAuthenticated: false, manager: {}, error: {}, isAccountLoading: false}
    }
    case LOGIN_ERR: {
      return {...state, isAuthenticated: false, manager: {}, error: payload.error, isAccountLoading: false}
    }
  }
  return state
}

export default reducer
