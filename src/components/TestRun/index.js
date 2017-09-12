import { connect } from 'react-redux'
import { TestRun } from './presenter'

const mapStateToProps = (state) => ({
  event: state.event.event,
  groups: state.event.groups,
  races: state.event.races,
  registrations: state.event.registrations,
  nameTables: state.event.nameTables
})

export default connect(mapStateToProps)(TestRun)
