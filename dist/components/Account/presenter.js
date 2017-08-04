'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _account = require('../../ducks/account');

var _reactRouterDom = require('react-router-dom');

var _Footer = require('../Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Account = function (_BaseComponent) {
  _inherits(Account, _BaseComponent);

  function Account(props) {
    _classCallCheck(this, Account);

    var _this = _possibleConstructorReturn(this, (Account.__proto__ || Object.getPrototypeOf(Account)).call(this, props));

    _this.dispatch = _this.props.dispatch;

    if (_this.props.account.isAuthenticated === undefined) {
      _this.props.dispatch(_account.actionCreators.accountInfo());
    }
    _this._bind('handleSubmit', 'handleInput');
    return _this;
  }

  _createClass(Account, [{
    key: 'handleInput',
    value: function handleInput(field) {
      var _this2 = this;

      return function (e) {
        _this2.dispatch(_account.actionCreators.input(field, e.currentTarget.value));
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _props$account$creden = this.props.account.credentials,
          email = _props$account$creden.email,
          password = _props$account$creden.password;

      if (email && password) {
        this.dispatch(_account.actionCreators.login());
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$account = this.props.account,
          credentials = _props$account.credentials,
          isAuthenticated = _props$account.isAuthenticated; // isAuthenticated === undefined just means store is not ready yet

      var _ref = this.props.location.state || { from: { pathname: '/console' } },
          from = _ref.from;

      var err = credentials.error === '' ? '' : _react2.default.createElement(
        'div',
        { className: _style2.default.errMsg },
        credentials.error
      );

      console.log('account ----');
      console.log(this.props.location.state);
      console.log(isAuthenticated);

      if (isAuthenticated) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: from });
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: _style2.default.heading },
          _react2.default.createElement(
            'h1',
            { className: _style2.default.bdlogo },
            _react2.default.createElement(
              'span',
              { className: _style2.default.logoB },
              'Beardude'
            ),
            _react2.default.createElement(
              'span',
              { className: _style2.default.logoE },
              'Event'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _react2.default.createElement(
            'div',
            { className: _style2.default.body },
            !this.props.location.state || isAuthenticated !== undefined ? _react2.default.createElement(
              'div',
              null,
              err,
              _react2.default.createElement(
                'ul',
                null,
                _react2.default.createElement(
                  'li',
                  { className: _style2.default.li },
                  _react2.default.createElement('input', { type: 'text', className: _style2.default.text1, onChange: this.handleInput('email'), placeholder: '\u96FB\u5B50\u4FE1\u7BB1' })
                ),
                _react2.default.createElement(
                  'li',
                  { className: _style2.default.li },
                  _react2.default.createElement('input', { type: 'password', className: _style2.default.text2, onChange: this.handleInput('password'), placeholder: '\u5BC6\u78BC' })
                )
              ),
              _react2.default.createElement(
                'div',
                { className: _style2.default.ft },
                _react2.default.createElement(_Button2.default, { onClick: this.handleSubmit, text: '\u767B\u5165' })
              )
            ) : _react2.default.createElement(
              'div',
              { className: _style2.default.loading },
              'Loading...'
            )
          )
        ),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return Account;
}(_BaseComponent3.default);

exports.default = Account;