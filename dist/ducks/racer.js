'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */

// types
var CANCEL_EDIT = 'racer/CANCEL_EDIT';
var CREATE_RACER = 'racer/CREATE_RACER';
var GET_RACERS = 'racer/GET_RACERS';
var EDIT_RACER = 'racer/EDIT_RACER';
var SELECT_RACERS = 'racer/SELECT_RACERS';
var RACER_ERR = 'racer/RACER_ERR';
var SUBMIT_RACER = 'racer/SUBMIT_RACER';

// actions
var actionCreators = exports.actionCreators = {
  cancelEdit: function cancelEdit() {
    return function (dispatch) {
      dispatch({ type: CANCEL_EDIT });
    };
  },
  create: function create() {
    return function (dispatch) {
      dispatch({ type: CREATE_RACER });
    };
  },
  getRacers: function getRacers() {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch, getState) {
        var response, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch('/api/racer/getRacers', { credentials: 'same-origin' });

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

                return _context.abrupt('return', dispatch({ type: GET_RACERS, payload: res }));

              case 9:
                throw res.message;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                dispatch({ type: RACER_ERR, payload: { error: _context.t0 } });

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
      dispatch({ type: EDIT_RACER, payload: { field: field, value: value } });
    };
  },
  selectRacer: function selectRacer(index) {
    return function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch, getState) {
        var racerStore, response, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                racerStore = getState().racer;

                if (!racerStore.racers[index].upToDate) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', dispatch({ type: SELECT_RACERS, payload: { selectedIndex: index } }));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return fetch('/api/racer/mgmtInfo/' + racerStore.racers[index].id, { credentials: 'same-origin' });

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

                return _context2.abrupt('return', dispatch({ type: SELECT_RACERS, payload: _extends({}, res, { selectedIndex: index }) }));

              case 12:
                throw res.message;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](3);

                dispatch({ type: RACER_ERR, payload: { error: _context2.t0 } });

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
        var store, racerId, response, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                store = getState().racer;
                racerId = store.racers[store.selectedIndex].id;
                _context3.prev = 2;
                _context3.next = 5;
                return fetch(racerId ? '/api/racer/update' : '/api/racer/create', {
                  method: 'post',
                  credentials: 'same-origin',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(_extends({}, store.inEdit, { id: racerId }))
                });

              case 5:
                response = _context3.sent;
                _context3.next = 8;
                return response.json();

              case 8:
                res = _context3.sent;

                if (!(response.status === 200)) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt('return', dispatch({ type: SUBMIT_RACER, payload: _extends({}, res, { selectedIndex: store.selectedIndex }) }));

              case 11:
                throw res.message;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](2);

                dispatch({ type: RACER_ERR, payload: { error: _context3.t0 } });

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[2, 14]]);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }();
  }

  // reducers
};var initialState = {
  selectedIndex: -1,
  inEdit: undefined, // keep new and modified racer info
  racers: undefined
};
var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload;


  switch (type) {
    case CANCEL_EDIT:
      {
        var nextState = _extends({}, state, { inEdit: undefined });
        if (!nextState.racers[nextState.racers.length - 1].id) {
          nextState.selectedIndex = -1;
          nextState.racers.pop();
        }
        return nextState;
      }
    case CREATE_RACER:
      {
        var _nextState = _extends({}, state, { selectedIndex: state.racers.length });
        _nextState.racers.push({});
        return _nextState;
      }
    case EDIT_RACER:
      {
        var _nextState2 = _extends({}, state, { inEdit: state.inEdit || {} });
        _nextState2.inEdit[payload.field] = payload.value;
        return _nextState2;
      }
    case GET_RACERS:
      {
        return _extends({}, state, { racers: payload.racers });
      }
    case SELECT_RACERS:
      {
        var _nextState3 = _extends({}, state, { selectedIndex: payload.selectedIndex, inEdit: undefined });
        if (payload.racer) {
          _nextState3.racers[payload.selectedIndex] = _extends({}, payload.racer, { upToDate: true });
        }
        return _nextState3;
      }
    case SUBMIT_RACER:
      {
        var _nextState4 = _extends({}, state, { inEdit: undefined });
        if (payload.racer) {
          _nextState4.racers[payload.selectedIndex] = _extends({}, payload.racer, { upToDate: true });
        }
        return _nextState4;
      }
    case RACER_ERR:
      {
        return _extends({}, state, { error: payload.error });
      }
  }
  return state;
};

exports.default = reducer;