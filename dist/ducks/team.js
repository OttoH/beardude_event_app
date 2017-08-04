'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionCreators = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _racer = require('./racer');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global fetch */

// types
var CREATE_TEAM = 'team/CREATE_TEAM';
var CANCEL_EDIT = 'team/CANCEL_EDIT';
var GET_TEAMS = 'team/GET_TEAMS';
var EDIT_TEAM = 'team/EDIT_TEAM';
var SELECT_TEAM = 'team/SELECT_TEAM';
var SUBMIT_TEAM = 'team/SUBMIT_TEAM';
var ADD_RACER = 'team/ADD_RACER';
var REMOVE_RACER = 'team/REMOVE_RACER';
var TEAM_ERR = 'team/TEAM_ERR';

// actions
var actionCreators = exports.actionCreators = {
  addRacer: function addRacer(racer) {
    return function (dispatch) {
      dispatch({ type: ADD_RACER, payload: { racer: racer } });
    };
  },
  removeRacer: function removeRacer(id, toRestore) {
    return function (dispatch) {
      dispatch({ type: REMOVE_RACER, payload: { id: id, toRestore: toRestore } });
    };
  },
  create: function create() {
    return function (dispatch) {
      dispatch({ type: CREATE_TEAM });
    };
  },
  cancelEdit: function cancelEdit() {
    return function (dispatch) {
      dispatch({ type: CANCEL_EDIT });
    };
  },
  getTeams: function getTeams() {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch, getState) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch('/api/team/getTeams', { credentials: 'same-origin' });

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

                return _context.abrupt('return', dispatch({ type: GET_TEAMS, payload: res }));

              case 9:
                throw res.message;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                dispatch({ type: TEAM_ERR, payload: { error: _context.t0 } });

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
      dispatch({ type: EDIT_TEAM, payload: { field: field, value: value } });
    };
  },
  selectTeam: function selectTeam(index) {
    return function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch, getState) {
        var teamStore, response, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                teamStore = getState().team;

                if (!teamStore.teams[index].upToDate) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', dispatch({ type: SELECT_TEAM, payload: { selectedIndex: index } }));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return fetch('/api/team/getInfo/' + teamStore.teams[index].id, { credentials: 'same-origin' });

              case 6:
                response = _context2.sent;
                _context2.next = 9;
                return response.json();

              case 9:
                res = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt('return', dispatch({ type: SELECT_TEAM, payload: _extends({}, res, { selectedIndex: index }) }));

              case 12:
                throw res.message;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](3);

                dispatch({ type: TEAM_ERR, payload: { error: _context2.t0 } });

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[3, 15]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();
  },
  submit: function submit() {
    return function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(dispatch, getState) {
        var store, teamId, response, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                store = getState().team;
                teamId = store.teams[store.selectedIndex].id;
                _context3.prev = 2;
                _context3.next = 5;
                return fetch(teamId ? '/api/team/update' : '/api/team/create', {
                  method: 'post',
                  credentials: 'same-origin',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(_extends({}, store.inEdit, { id: teamId }))
                });

              case 5:
                response = _context3.sent;
                _context3.next = 8;
                return response.json();

              case 8:
                res = _context3.sent;

                if (!(response.status === 200)) {
                  _context3.next = 12;
                  break;
                }

                dispatch({ type: SUBMIT_TEAM, payload: _extends({}, res, { selectedIndex: store.selectedIndex }) });
                return _context3.abrupt('return', dispatch(_racer.actionCreators.getRacers()));

              case 12:
                throw res.message;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3['catch'](2);

                dispatch({ type: TEAM_ERR, payload: { error: _context3.t0 } });

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[2, 15]]);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }();
  }

  // reducers
};var initialState = {
  selectedIndex: -1,
  inEdit: undefined, // keep new and modified team info
  teams: undefined
};
var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload;


  switch (type) {
    case ADD_RACER:
      {
        var nextState = _extends({}, state, { inEdit: state.inEdit || { racers: state.teams[state.selectedIndex].racers } });
        nextState.inEdit.racers.push(_extends({}, payload.racer, { toAdd: true }));
        return nextState;
      }
    case REMOVE_RACER:
      {
        var _nextState = _extends({}, state, { inEdit: state.inEdit || { racers: state.teams[state.selectedIndex].racers } });
        _nextState.inEdit.racers.forEach(function (racer, index) {
          if (racer.id === payload.id) {
            if (racer.toAdd) {
              _nextState.inEdit.racers.splice(index, 1);
            } else {
              racer.toRemove = !payload.toRestore;
            }
          }
        });
        return _nextState;
      }
    case CANCEL_EDIT:
      {
        var _nextState2 = _extends({}, state, { inEdit: undefined });
        if (!_nextState2.teams[_nextState2.teams.length - 1].id) {
          _nextState2.selectedIndex = -1;
          _nextState2.teams.pop();
        }
        return _nextState2;
      }
    case CREATE_TEAM:
      {
        var _nextState3 = _extends({}, state, { selectedIndex: state.teams.length });
        _nextState3.teams.push({});
        return _nextState3;
      }
    case EDIT_TEAM:
      {
        var _nextState4 = _extends({}, state, { inEdit: state.inEdit || { racers: state.teams[state.selectedIndex].racers } });
        _nextState4.inEdit[payload.field] = payload.value;
        return _nextState4;
      }
    case GET_TEAMS:
      {
        return _extends({}, state, { teams: payload.teams });
      }
    case SELECT_TEAM:
      {
        var _nextState5 = _extends({}, state, { selectedIndex: payload.selectedIndex, inEdit: undefined });
        if (payload.team) {
          _nextState5.teams[payload.selectedIndex] = _extends({}, payload.team, { upToDate: true });
        }
        return _nextState5;
      }
    case SUBMIT_TEAM:
      {
        var _nextState6 = _extends({}, state, { inEdit: undefined });
        if (payload.team) {
          _nextState6.teams[payload.selectedIndex] = _extends({}, payload.team, { upToDate: true });
        }
        return _nextState6;
      }
    case TEAM_ERR:
      {
        return _extends({}, state, { error: payload.error });
      }
  }
  return state;
};

exports.default = reducer;