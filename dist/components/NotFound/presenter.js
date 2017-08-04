'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('../Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotFound = function NotFound(_ref) {
  var location = _ref.location;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_Header2.default, { location: location }),
    _react2.default.createElement(
      'div',
      { className: _style2.default.mainBody },
      'Not Found'
    ),
    _react2.default.createElement(_Footer2.default, null)
  );
};
exports.default = NotFound;