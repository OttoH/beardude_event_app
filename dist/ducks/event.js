'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */

// types
var ACTION_ERR = 'event/ACTION_ERR';
var DELETE_EVENT = 'event/DELETE_EVENT';
var DELETE_GROUP = 'event/DELETE_GROUP';
var DELETE_RACE = 'event/DELETE_RACE';
var DELETE_REG = 'event/DELETE_REG';
var EVENT_ERR = 'event/EVENT_ERR';
var GET_EVENT = 'event/GET_EVENT';
var GET_EVENTS = 'event/GET_EVENTS';
var GET_GROUP = 'event/GET_GROUP';
var GET_RACE = 'event/GET_RACE';
var CONTROL_RACE = 'event/CONTROL_RACE';
var SUBMIT_EVENT = 'event/SUBMIT_EVENT';
var SUBMIT_GROUP = 'event/SUBMIT_GROUP';
var SUBMIT_RACE = 'event/SUBMIT_RACE';
var SUBMIT_REG = 'event/SUBMIT_REG';

var returnPostHeader = function returnPostHeader(obj) {
  return { method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
};
// actions
var actionCreators = exports.actionCreators = {
  delete: function _delete(state, successCallback) {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch) {
        var types, response, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                types = { event: DELETE_EVENT, group: DELETE_GROUP, race: DELETE_RACE, reg: DELETE_REG };
                _context.prev = 1;
                _context.next = 4;
                return fetch('/api/' + state.model + '/delete/' + state.original.id, { credentials: 'same-origin' });

              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.json();

              case 7:
                res = _context.sent;

                if (response.status === 200) {
                  dispatch({ type: types[state.model], payload: _extends({}, res, { state: state }) });
                  if (state.model !== 'event') {
                    successCallback();
                  }
                }
                throw res.message;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](1);

                dispatch({ type: ACTION_ERR, payload: { error: _context.t0 } });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[1, 12]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  },
  getEvents: function getEvents() {
    return function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return fetch('/api/event/getEvents', { credentials: 'same-origin' });

              case 3:
                response = _context2.sent;
                _context2.next = 6;
                return response.json();

              case 6:
                res = _context2.sent;

                if (!(response.status === 200)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return', dispatch({ type: GET_EVENTS, payload: res }));

              case 9:
                throw res.message;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](0);

                dispatch({ type: EVENT_ERR, payload: { error: '取得活動失敗' } });

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[0, 12]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();
  },
  getEvent: function getEvent(id, successCallback) {
    return function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(dispatch) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(id === 'new')) {
                  _context3.next = 3;
                  break;
                }

                dispatch({ type: GET_EVENT, payload: { event: { groups: [] } } });
                return _context3.abrupt('return', successCallback());

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return fetch('/api/event/mgmtInfo/' + id, { credentials: 'same-origin' });

              case 6:
                response = _context3.sent;
                _context3.next = 9;
                return response.json();

              case 9:
                res = _context3.sent;

                if (!(response.status === 200)) {
                  _context3.next = 14;
                  break;
                }

                dispatch({ type: GET_EVENT, payload: _extends({}, res) });
                if (successCallback !== undefined) {
                  successCallback();
                }
                return _context3.abrupt('return');

              case 14:
                throw res.message;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3['catch'](3);

                dispatch({ type: EVENT_ERR, payload: { error: '取得活動內容失敗' } });

              case 20:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[3, 17]]);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }();
  },
  getRace: function getRace(id) {
    return function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(dispatch) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return fetch('/api/race/mgmtInfo/' + id, { credentials: 'same-origin' });

              case 3:
                response = _context4.sent;
                _context4.next = 6;
                return response.json();

              case 6:
                res = _context4.sent;

                if (!(response.status === 200)) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt('return', dispatch({ type: GET_RACE, payload: _extends({}, res) }));

              case 9:
                throw res.message;

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4['catch'](0);

                dispatch({ type: EVENT_ERR, payload: { error: '取得比賽內容失敗' } });

              case 15:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[0, 12]]);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }();
  },
  controlRace: function controlRace(action, object, successCallback) {
    return function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(dispatch) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return fetch('/api/race/' + action, returnPostHeader(object));

              case 3:
                response = _context5.sent;
                _context5.next = 6;
                return response.json();

              case 6:
                res = _context5.sent;

                if (!(response.status === 200)) {
                  _context5.next = 17;
                  break;
                }

                _context5.next = 10;
                return fetch('/api/race/mgmtInfo/' + object.id, { credentials: 'same-origin' });

              case 10:
                response = _context5.sent;
                _context5.next = 13;
                return response.json();

              case 13:
                res = _context5.sent;

                dispatch({ type: CONTROL_RACE, payload: _extends({}, res, { raceId: object.id, action: action }) });
                if (successCallback !== undefined) {
                  successCallback();
                }
                return _context5.abrupt('return');

              case 17:
                throw res.message;

              case 20:
                _context5.prev = 20;
                _context5.t0 = _context5['catch'](0);

                dispatch({ type: EVENT_ERR, payload: { error: '開始比賽失敗: ' + _context5.t0 } });

              case 23:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[0, 20]]);
      }));

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }();
  },
  submit: function submit(state, successCallback) {
    return function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(dispatch) {
        var types, pathname, response, res;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                types = { event: SUBMIT_EVENT, group: SUBMIT_GROUP, race: SUBMIT_RACE, reg: SUBMIT_REG };
                pathname = state.original.id ? 'update' : 'create';
                _context6.prev = 2;
                _context6.next = 5;
                return fetch('/api/' + state.model + '/' + pathname, returnPostHeader(_extends({}, state.modified, { id: state.original.id })));

              case 5:
                response = _context6.sent;
                _context6.next = 8;
                return response.json();

              case 8:
                res = _context6.sent;

                if (!(response.status === 200)) {
                  _context6.next = 12;
                  break;
                }

                dispatch({ type: types[state.model], payload: _extends({}, res, { state: state }) });
                return _context6.abrupt('return', successCallback());

              case 12:
                throw res.message;

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](2);

                dispatch({ type: ACTION_ERR, payload: { error: _context6.t0 } });

              case 18:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, undefined, [[2, 15]]);
      }));

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    }();
  },
  submitRaceResult: function submitRaceResult(raceObj, successCallback) {
    return function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(dispatch) {
        var returnRegsToRaces, response, res;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // {races: [{id: ID, toAdd: [ID, ID, ID], toRemove: ID, ID, ID}, {}, {}]}
                returnRegsToRaces = function returnRegsToRaces(race) {
                  return race.advancingRules.map(function (rule) {
                    var obj = { id: rule.toRace, toAdd: [], toRemove: [] };
                    race.result.map(function (V) {
                      return obj[V.advanceTo === rule.toRace ? 'toAdd' : 'toRemove'].push(V.registration);
                    });
                    return obj;
                  });
                };

                _context7.prev = 1;
                _context7.next = 4;
                return fetch('/api/race/submitResult', returnPostHeader({ id: raceObj.id, result: raceObj.result, advance: returnRegsToRaces(raceObj) }));

              case 4:
                response = _context7.sent;
                _context7.next = 7;
                return response.json();

              case 7:
                res = _context7.sent;

                if (!(response.status === 200)) {
                  _context7.next = 17;
                  break;
                }

                _context7.next = 11;
                return fetch('/api/group/mgmtInfo/' + raceObj.group, { credentials: 'same-origin' });

              case 11:
                response = _context7.sent;
                _context7.next = 14;
                return response.json();

              case 14:
                res = _context7.sent;

                dispatch({ type: GET_GROUP, payload: _extends({}, res, { id: raceObj.group }) });
                return _context7.abrupt('return', successCallback());

              case 17:
                throw res.message;

              case 20:
                _context7.prev = 20;
                _context7.t0 = _context7['catch'](1);

                dispatch({ type: EVENT_ERR, payload: { error: '送出比賽結果失敗: ' + _context7.t0 } });

              case 23:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, undefined, [[1, 20]]);
      }));

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }();
  },
  submitAdvancingRules: function submitAdvancingRules(state, successCallback) {
    return function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(dispatch) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return fetch('/api/race/update', returnPostHeader({ id: state.raceId, advancingRules: state.modified }));

              case 3:
                response = _context8.sent;
                _context8.next = 6;
                return response.json();

              case 6:
                res = _context8.sent;

                if (!(response.status === 200)) {
                  _context8.next = 10;
                  break;
                }

                dispatch({ type: GET_RACE, payload: _extends({}, res, { state: state }) });
                return _context8.abrupt('return', successCallback());

              case 10:
                throw res.message;

              case 13:
                _context8.prev = 13;
                _context8.t0 = _context8['catch'](0);

                dispatch({ type: ACTION_ERR, payload: { error: _context8.t0 } });

              case 16:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, undefined, [[0, 13]]);
      }));

      return function (_x8) {
        return _ref8.apply(this, arguments);
      };
    }();
  },
  submitRegsToRaces: function submitRegsToRaces(groupId, groupIndex, obj, successCallback) {
    return function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(dispatch, getState) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return fetch('/api/race/assignRegsToRaces', returnPostHeader({ races: obj }));

              case 3:
                response = _context9.sent;
                _context9.next = 6;
                return response.json();

              case 6:
                res = _context9.sent;

                if (!(response.status === 200)) {
                  _context9.next = 17;
                  break;
                }

                _context9.next = 10;
                return fetch('/api/group/mgmtInfo/' + groupId, { credentials: 'same-origin' });

              case 10:
                response = _context9.sent;
                _context9.next = 13;
                return response.json();

              case 13:
                res = _context9.sent;

                if (!(response.status === 200)) {
                  _context9.next = 17;
                  break;
                }

                dispatch({ type: GET_GROUP, payload: _extends({}, res, { index: groupIndex }) });
                return _context9.abrupt('return', successCallback(res.group));

              case 17:
                throw res.message;

              case 20:
                _context9.prev = 20;
                _context9.t0 = _context9['catch'](0);

                dispatch({ type: ACTION_ERR, payload: { error: _context9.t0 } });

              case 23:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, undefined, [[0, 20]]);
      }));

      return function (_x9, _x10) {
        return _ref9.apply(this, arguments);
      };
    }();
  }

  // reducers
};var initialState = {
  event: undefined,
  events: []
};
var reducer = exports.reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload;


  switch (type) {
    case ACTION_ERR:
      {
        return _extends({}, state, { error: payload.error });
      }
    case DELETE_EVENT:
      {
        return _extends({}, state, { event: -1 });
      }
    case DELETE_GROUP:
      {
        var nextState = _extends({}, state);
        nextState.event.groups.splice(payload.state.groupSelected, 1);
        return nextState;
      }
    case DELETE_RACE:
      {
        var _nextState = _extends({}, state);
        _nextState.event.groups[payload.state.groupSelected].races.splice(payload.state.raceSelected, 1);
        return _nextState;
      }
    case DELETE_REG:
      {
        var _nextState2 = _extends({}, state);
        _nextState2.event.groups[payload.state.groupSelected].registrations.splice(payload.state.regSelected, 1);
        return _nextState2;
      }
    case GET_EVENTS:
      {
        return _extends({}, state, { events: payload.events });
      }
    case GET_EVENT:
      {
        return _extends({}, state, { event: payload.event });
      }
    case GET_RACE:
      {
        var _nextState3 = _extends({}, state);
        _nextState3.event.groups.map(function (group, gIndex) {
          group.races.map(function (race, rIndex) {
            if (race.id === payload.race.id) {
              _nextState3.event.groups[gIndex].races[rIndex] = _extends({}, payload.race);
            }
          });
        });
        return _nextState3;
      }
    case GET_GROUP:
      {
        var _nextState4 = _extends({}, state);
        if (payload.index) {
          _nextState4.event.groups[payload.index] = payload.group;
        } else if (payload.id) {
          _nextState4.event.groups.map(function (V, I) {
            if (V.id === payload.id) {
              _nextState4.event.groups[I] = payload.group;
            }
          });
        }
        return _nextState4;
      }
    case CONTROL_RACE:
      {
        var _nextState5 = _extends({}, state);
        _nextState5.event.groups.map(function (group, gIndex) {
          group.races.map(function (race, rIndex) {
            if (race.id === payload.raceId) {
              _nextState5.event.groups[gIndex].races[rIndex] = _extends({}, payload.race);
            }
          });
        });
        if (payload.action === 'start') {
          _nextState5.event.ongoingRace = payload.raceId;
        } else if (payload.action === 'reset') {
          _nextState5.event.ongoingRace = -1;
        }
        return _nextState5;
      }
    case SUBMIT_EVENT:
      {
        return _extends({}, state, { event: _extends({}, payload.event, { groups: [].concat(_toConsumableArray(state.event.groups)) }) });
      }
    case SUBMIT_GROUP:
      {
        var _nextState6 = _extends({}, state);
        var group = state.event.groups[payload.state.groupSelected] || _extends({}, payload.group, { races: [], registrations: [] });
        if (state.event.groups.length === payload.state.groupSelected) {
          _nextState6.event.groups.push(group);
        } else {
          _nextState6.event.groups[payload.state.groupSelected] = _extends({}, payload.group, { races: group.races, registrations: group.registrations });
        }
        return _nextState6;
      }
    case SUBMIT_RACE:
      {
        var _nextState7 = _extends({}, state);
        if (state.event.groups[payload.state.groupSelected].races.length === payload.state.raceSelected) {
          _nextState7.event.groups[payload.state.groupSelected].races.push(_extends({}, payload.race, { registrations: [] }));
        } else {
          _nextState7.event.groups[payload.state.groupSelected].races[payload.state.raceSelected] = payload.race;
        }
        return _nextState7;
      }
    case SUBMIT_REG:
      {
        var _nextState8 = _extends({}, state);

        // group's reg
        if (state.event.groups[payload.state.groupSelected].registrations.length === payload.state.regSelected) {
          _nextState8.event.groups[payload.state.groupSelected].registrations.push(_extends({}, payload.registration));
        } else {
          _nextState8.event.groups[payload.state.groupSelected].registrations[payload.state.regSelected] = payload.registration;
        }
        return _nextState8;
      }
    case EVENT_ERR:
      {
        return _extends({}, state, { event: -1 });
      }
  }
  return state;
};

exports.default = reducer;