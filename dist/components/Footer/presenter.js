'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = function Footer() {
  return _react2.default.createElement(
    'div',
    { className: _style2.default.footer },
    _react2.default.createElement(
      'ul',
      null,
      _react2.default.createElement(
        'li',
        { className: _style2.default.copyRight },
        _react2.default.createElement(
          'span',
          null,
          'Copyright \xA9 '
        ),
        _react2.default.createElement(
          'span',
          null,
          ' Beardude Inc. All Rights Reserved'
        )
      )
    )
  );
};

exports.default = Footer;