'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _presenter = require('./presenter');

var mapStateToProps = function mapStateToProps(state) {
  return {
    event: state.event.event,
    loading: state.posts.loading,
    error: state.posts.error,
    racer: state.racer.racers
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_presenter.EventManager);