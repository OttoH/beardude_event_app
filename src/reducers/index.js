
import { combineReducers } from 'redux'
import account from '../ducks/account'
import event from '../ducks/event'
import manager from '../ducks/manager'
import racer from '../ducks/racer'
import team from '../ducks/team'

export default combineReducers({
  account,
  event,
  manager,
  racer,
  team
})
