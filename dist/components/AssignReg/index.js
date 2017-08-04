'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _presenter = require('./presenter');

var _presenter2 = _interopRequireDefault(_presenter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    event: state.event
  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_presenter2.default);