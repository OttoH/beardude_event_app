'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
  var counter = _ref.counter,
      onClick = _ref.onClick,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? 'regular' : _ref$style,
      text = _ref.text,
      url = _ref.url,
      body = _ref.body;

  var counterHtml = counter !== undefined ? _react2.default.createElement(
    'span',
    { className: _style2.default.count },
    counter
  ) : '';
  return url ? _react2.default.createElement(
    _reactRouterDom.Link,
    { className: _style2.default[style], to: url },
    text,
    counterHtml
  ) : _react2.default.createElement(
    'button',
    { className: _style2.default[style], onClick: onClick },
    text,
    counterHtml
  );
};
exports.default = Button;