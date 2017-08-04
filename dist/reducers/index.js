'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _account = require('../ducks/account');

var _account2 = _interopRequireDefault(_account);

var _event = require('../ducks/event');

var _event2 = _interopRequireDefault(_event);

var _manager = require('../ducks/manager');

var _manager2 = _interopRequireDefault(_manager);

var _racer = require('../ducks/racer');

var _racer2 = _interopRequireDefault(_racer);

var _team = require('../ducks/team');

var _team2 = _interopRequireDefault(_team);

var _posts = require('../ducks/posts');

var _posts2 = _interopRequireDefault(_posts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  account: _account2.default,
  event: _event2.default,
  manager: _manager2.default,
  posts: _posts2.default,
  racer: _racer2.default,
  team: _team2.default
});