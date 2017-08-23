import { connect } from 'react-redux'
import AssignReg from './presenter'

const mapStateToProps = (state) => {
  return {
    races: state.event.races,
    registrations: state.event.registrations,
    nameTables: state.event.nameTables
  }
}

export default connect(mapStateToProps)(AssignReg)
