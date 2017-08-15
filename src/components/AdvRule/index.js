import { connect } from 'react-redux'
import AdvRule from './presenter'

const mapStateToProps = (state) => {
  return {
    races: state.event.races
  }
}

export default connect(mapStateToProps)(AdvRule)
