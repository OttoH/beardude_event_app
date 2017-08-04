'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _configureStore = require('./stores/configureStore');

var _account = require('./ducks/account');

var _reactRouterDom = require('react-router-dom');

var _EventList = require('./components/EventList');

var _EventList2 = _interopRequireDefault(_EventList);

var _EventManager = require('./components/EventManager');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _MatchManager = require('./components/MatchManager');

var _MatchManager2 = _interopRequireDefault(_MatchManager);

var _Account = require('./components/Account');

var _Account2 = _interopRequireDefault(_Account);

var _Racer = require('./components/Racer');

var _Racer2 = _interopRequireDefault(_Racer);

var _Team = require('./components/Team');

var _Team2 = _interopRequireDefault(_Team);

var _NotFound = require('./components/NotFound');

var _NotFound2 = _interopRequireDefault(_NotFound);

var _Manager = require('./components/Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _PublicEventList = require('./components/PublicEventList');

var _PublicEventList2 = _interopRequireDefault(_PublicEventList);

var _PublicEvent = require('./components/PublicEvent');

var _PublicEvent2 = _interopRequireDefault(_PublicEvent);

var _index = require('./style/index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _configureStore.configureStore)();

store.dispatch(_account.actionCreators.accountInfo());

_reactDom2.default.render(_react2.default.createElement(
  _reactRedux.Provider,
  { store: store },
  _react2.default.createElement(
    _reactRouterDom.BrowserRouter,
    null,
    _react2.default.createElement(
      'div',
      { className: _index2.default.container },
      _react2.default.createElement(
        _reactRouterDom.Switch,
        null,
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', component: _PublicEventList2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/event/:id', component: _PublicEvent2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/console', component: _EventList2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/login', component: _Account2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/event/:id', component: _EventManager2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/eventMatch/:id', component: _MatchManager2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/racer', component: _Racer2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/team', component: _Team2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/console/manager', component: _Manager2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { component: _NotFound2.default })
      )
    )
  )
), document.getElementById('main-container'));

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept();
}