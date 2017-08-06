import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './stores/configureStore'
import { actionCreators } from './ducks/account'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import EventList from './components/EventList'
import EventManager from './components/EventManager'
import MatchManager from './components/MatchManager'
import Account from './components/Account'
import Racer from './components/Racer'
import Team from './components/Team'
import NotFound from './components/NotFound'
import Manager from './components/Manager'
import PublicEventList from './components/PublicEventList'
import PublicEvent from './components/PublicEvent'

import css from './style/index.css'

const store = configureStore()

store.dispatch(actionCreators.accountInfo())

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className={css.container}>
        <Switch>
          <Route exact path='/' component={PublicEventList} />
          <Route exact path='/event/:id' component={PublicEvent} />
          <Route exact path='/console' component={EventList} />
          <Route path='/console/event/:id' component={EventManager} />
          <Route path='/console/eventMatch/:id' component={MatchManager} />
          <Route path='/console/racer' component={Racer} />
          <Route path='/console/team' component={Team} />
          <Route path='/console/manager' component={Manager} />
          <Route path='/login' component={Account} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById('main-container')
)

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept()
}
