import {createStore, applyMiddleware, compose} from 'redux'
import reducers from '../reducers/index'

// fetch api need link to store
import thunk from 'redux-thunk'

let composeEnhancers
const middleWares = [thunk]

if (process.env.NODE_ENV === 'development') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
} else {
  composeEnhancers = compose
}

export const configureStore = (initialState) => {
  const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(...middleWares)))

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers/index'))
    })
  }

  return store
}
