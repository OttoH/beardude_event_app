import { connect } from 'react-redux'
import { EventManager } from './presenter'

const mapStateToProps = (state) => ({
  event: state.event.event,
  racer: state.racer.racers
})

export default connect(mapStateToProps)(EventManager)
