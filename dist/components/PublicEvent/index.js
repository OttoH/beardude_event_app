'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _presenter = require('./presenter');

var mapStateToProps = function mapStateToProps(state) {
  return {
    event: state.event.event
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_presenter.PublicEvent);