'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */

// types
var LOGIN = 'manager/LOGIN';
var LOGOUT = 'manager/LOGOUT';
var ACCOUNT_INFO = 'manager/ACCOUNT_INFO';
var ENTER_CREDENTIALS = 'manager/ENTER_CREDENTIALS';
var LOGIN_ERR = 'manager/LOGIN_ERR';

// actions
var actionCreators = exports.actionCreators = {
  accountInfo: function accountInfo() {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch, getState) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch('/api/manager/account', { credentials: 'same-origin' });

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                res = _context.sent;

                if (!(response.status === 200)) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', dispatch({ type: ACCOUNT_INFO, payload: res }));

              case 9:
                throw res.message;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                dispatch({ type: LOGIN_ERR, payload: { error: _context.t0 } });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 12]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  },
  input: function input(field, value) {
    return function (dispatch) {
      dispatch({ type: ENTER_CREDENTIALS, payload: { field: field, value: value } });
    };
  },
  login: function login() {
    return function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch, getState) {
        var credentials, fetchObject, response, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                credentials = getState().account.credentials;
                fetchObject = {
                  method: 'post',
                  credentials: 'same-origin',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                };

                delete credentials.error;
                fetchObject.body = JSON.stringify(credentials);
                _context2.prev = 4;
                _context2.next = 7;
                return fetch('/api/manager/login', fetchObject);

              case 7:
                response = _context2.sent;
                _context2.next = 10;
                return response.json();

              case 10:
                res = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt('return', dispatch({ type: LOGIN, payload: res }));

              case 13:
                throw res.message;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2['catch'](4);

                dispatch({ type: LOGIN_ERR, payload: { error: _context2.t0 } });

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[4, 16]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();
  },
  logout: function logout() {
    return function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(dispatch, getState) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return fetch('/api/manager/logout', { credentials: 'same-origin' });

              case 3:
                response = _context3.sent;
                _context3.next = 6;
                return response.json();

              case 6:
                res = _context3.sent;

                if (!(response.status === 200)) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt('return', dispatch({ type: LOGOUT }));

              case 9:
                throw res.message;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3['catch'](0);

                dispatch({ type: LOGIN_ERR, payload: { error: _context3.t0 } });

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 12]]);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }();
  }

  // reducers
};var initialState = {
  credentials: {
    email: '',
    password: '',
    error: ''
  }
};
var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload;


  switch (type) {
    case ACCOUNT_INFO:
      {
        return payload.manager ? _extends({}, state, { manager: payload.manager, isAuthenticated: true }) : _extends({}, state, { isAuthenticated: false });
      }
    case LOGIN:
      {
        return _extends({}, state, { manager: payload.manager, isAuthenticated: 1 });
      }
    case LOGOUT:
      {
        return _extends({}, state, { isAuthenticated: false, manager: undefined });
      }
    case LOGIN_ERR:
      {
        var nextState = _extends({}, state);
        nextState.credentials.error = payload.error;
        return nextState;
      }
    case ENTER_CREDENTIALS:
      {
        var _nextState = _extends({}, state);
        _nextState.credentials[payload.field] = payload.value;
        return _nextState;
      }
  }
  return state;
};

exports.default = reducer;