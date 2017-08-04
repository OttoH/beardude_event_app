import {createStore, applyMiddleware} from 'redux'
import reducers from '../reducers/index'
import {createLogger} from 'redux-logger'

// fetch api need link to store
import thunk from 'redux-thunk'

let createStoreWithMiddleware
if (process.env.NODE_ENV === 'development') {
  createStoreWithMiddleware = applyMiddleware(thunk, createLogger())(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
}

// adding thunk later
export const configureStore = (initialState) => {
  return createStoreWithMiddleware(reducers, initialState)
}
