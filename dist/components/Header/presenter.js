'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _reactRouterDom = require('react-router-dom');

var _account = require('../../ducks/account');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var returnNavs = {
  base: function base() {
    return [{ name: '活動', url: '/console', exact: true }, { name: '選手', url: '/console/racer' }, { name: '隊伍', url: '/console/team' }, { name: '管理員', url: '/console/manager' }];
  },
  event: function event(match) {
    return [{ name: '賽制', url: '/console/event/' + match.params.id }, { name: '賽程管理', url: '/console/eventMatch/' + match.params.id }];
  }
};

var renderAccountInfo = function renderAccountInfo(that) {
  return _react2.default.createElement(
    'div',
    { className: _style2.default.account },
    _react2.default.createElement(
      'a',
      { className: _style2.default.accountLink, onClick: that.handleToggleAccountMenu },
      that.props.account.manager.email
    ),
    that.state.showAccountMenu && _react2.default.createElement(
      'ul',
      { className: _style2.default.accountMenu },
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          _reactRouterDom.Link,
          { className: _style2.default.aMenuItem, to: '/console/account' },
          '\u5E33\u865F\u8A2D\u5B9A'
        )
      ),
      _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          'a',
          { className: _style2.default.aMenuItem, href: '#', onClick: that.handleLogout },
          '\u767B\u51FA'
        )
      )
    )
  );
};

var renderNav = function renderNav(navs, matchParams) {
  return _react2.default.createElement(
    'ul',
    { className: _style2.default.navContainer },
    navs.map(function (nav) {
      return _react2.default.createElement(
        'li',
        { key: nav.name },
        _react2.default.createElement(
          _reactRouterDom.NavLink,
          { activeClassName: _style2.default.navActive, className: _style2.default.nav, to: nav.url, exact: nav.exact },
          nav.name
        )
      );
    })
  );
};

var Header = function (_BaseComponent) {
  _inherits(Header, _BaseComponent);

  function Header(props) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

    _this.state = {
      showAccountMenu: false
    };
    _this._bind('handleLogout', 'handleToggleAccountMenu');
    return _this;
  }

  _createClass(Header, [{
    key: 'handleLogout',
    value: function handleLogout(e) {
      e.preventDefault();
      this.props.dispatch(_account.actionCreators.logout());
    }
  }, {
    key: 'handleToggleAccountMenu',
    value: function handleToggleAccountMenu() {
      this.setState({ showAccountMenu: !this.state.showAccountMenu });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          account = _props.account,
          location = _props.location,
          match = _props.match,
          isPublic = _props.isPublic;

      if (!isPublic && account.isAuthenticated !== undefined && !account.isAuthenticated) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: { pathname: '/console/login', state: { from: location } } });
      }
      return _react2.default.createElement(
        'div',
        { className: _style2.default.mainHeader },
        _react2.default.createElement(
          'div',
          { className: _style2.default.heading },
          _react2.default.createElement(
            'h1',
            { className: _style2.default.bdlogo },
            _react2.default.createElement(
              _reactRouterDom.Link,
              { to: isPublic ? '/' : '/console' },
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
          )
        ),
        this.props.account && this.props.account.manager && renderAccountInfo(this),
        this.props.nav && renderNav(returnNavs[this.props.nav](match))
      );
    }
  }]);

  return Header;
}(_BaseComponent3.default);

exports.default = Header;