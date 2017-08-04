'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */

var types = exports.types = {
  FETCH_POSTS_REQUEST: 'FETCH_POSTS_REQUEST',
  FETCH_POSTS_RESPONSE: 'FETCH_POSTS_RESPONSE',
  CLEAR_POSTS: 'CLEAR_POSTS'

  // actions
};var actionCreators = exports.actionCreators = {
  fetchPosts: function fetchPosts() {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch, getState) {
        var response, posts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch({ type: types.FETCH_POSTS_REQUEST });

                _context.prev = 1;
                _context.next = 4;
                return fetch('https://jsonplaceholder.typicode.com/posts');

              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.json();

              case 7:
                posts = _context.sent;


                dispatch({ type: types.FETCH_POSTS_RESPONSE, payload: posts });
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](1);

                dispatch({ type: types.FETCH_POSTS_RESPONSE, payload: _context.t0, error: true });

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[1, 11]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  },

  // It's common for action creators to return a promise for easy chaining,
  // which is why this is declared async (async functions always return promises).
  clearPosts: function clearPosts() {
    return function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch, getState) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (getState().posts.length > 0) {
                  dispatch({ type: types.CLEAR_POSTS });
                }

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();
  }
};

var initialState = {
  loading: true,
  error: false,
  posts: []

  // reducers
};var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error;


  switch (type) {
    case types.FETCH_POSTS_REQUEST:
      {
        return _extends({}, state, { loading: true, error: false });
      }
    case types.FETCH_POSTS_RESPONSE:
      {
        if (error) {
          return _extends({}, state, { loading: false, error: true });
        }

        return _extends({}, state, { loading: false, posts: payload });
      }
  }

  return state;
};

exports.default = reducer;