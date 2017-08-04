'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureStore = undefined;

var _redux = require('redux');

var _index = require('../reducers/index');

var _index2 = _interopRequireDefault(_index);

var _reduxLogger = require('redux-logger');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStoreWithMiddleware = void 0;

// fetch api need link to store

if (process.env.NODE_ENV === 'development') {
  createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reduxLogger.createLogger)())(_redux.createStore);
} else {
  createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default)(_redux.createStore);
}

// adding thunk later
var configureStore = exports.configureStore = function configureStore(initialState) {
  return createStoreWithMiddleware(_index2.default, initialState);
};