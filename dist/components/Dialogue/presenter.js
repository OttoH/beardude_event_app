'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dialogue = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dialogue = exports.Dialogue = function Dialogue(_ref) {
  var content = _ref.content;
  return _react2.default.createElement(
    'span',
    null,
    content && _react2.default.createElement(
      'div',
      { className: _style2.default.box },
      _react2.default.createElement(
        'div',
        { className: _style2.default.wrap },
        _react2.default.createElement(
          'div',
          { className: _style2.default.content },
          content
        )
      )
    )
  );
};