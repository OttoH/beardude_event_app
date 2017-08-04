'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _reactRouterDom = require('react-router-dom');

var _event = require('../../ducks/event');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _presenter = require('../Dialogue/presenter');

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('../Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _processData = require('../MatchManager/processData');

var _processData2 = _interopRequireDefault(_processData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _render = {
  raceList: function raceList(_ref) {
    var race = _ref.race,
        raceSelected = _ref.raceSelected,
        index = _ref.index,
        handleSelect = _ref.handleSelect,
        groupNames = _ref.groupNames;

    return _react2.default.createElement(
      'li',
      { className: index === raceSelected ? _style2.default.selected : _style2.default.li, key: 'race' + race.id },
      _react2.default.createElement(
        'button',
        { className: _style2.default.list, onClick: handleSelect(index) },
        _react2.default.createElement(
          'span',
          null,
          groupNames[race.group.toString()]
        ),
        _react2.default.createElement(
          'span',
          null,
          ':'
        ),
        _react2.default.createElement(
          'span',
          null,
          race.nameCht ? race.nameCht : race.name
        )
      ),
      _react2.default.createElement('div', { className: _style2.default[race.raceStatus] })
    );
  },
  dashboard: {
    labels: function labels(race) {
      return _react2.default.createElement(
        'div',
        { className: _style2.default.dashId },
        _react2.default.createElement(
          'table',
          { className: _style2.default.dashTable },
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'th',
                { className: _style2.default.no },
                '\u540D\u6B21'
              ),
              _react2.default.createElement(
                'th',
                { className: _style2.default.name },
                '\u9078\u624B'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            race.result.map(function (record, index) {
              var reg = race.registrations.filter(function (V) {
                return V.id === record.registration;
              })[0];
              return reg ? _react2.default.createElement(
                'tr',
                { className: _style2.default.dashItem, key: 'rec' + index },
                _react2.default.createElement(
                  'td',
                  { className: _style2.default.no },
                  index + 1
                ),
                _react2.default.createElement(
                  'td',
                  { className: _style2.default.name },
                  _react2.default.createElement(
                    'span',
                    { className: _style2.default.raceNumber },
                    reg.raceNumber
                  ),
                  ' ',
                  _react2.default.createElement(
                    'span',
                    null,
                    reg.name
                  )
                )
              ) : _react2.default.createElement('tr', null);
            })
          )
        )
      );
    },
    results: function results(race) {
      return _react2.default.createElement(
        'table',
        { className: _style2.default.dashTable },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _processData2.default.returnLapLabels(race.laps).map(function (V, I) {
              return _react2.default.createElement(
                'th',
                { key: 'th-' + I },
                V
              );
            })
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          race.result.map(function (record, index) {
            return _react2.default.createElement(
              'tr',
              { key: 'tr' + record.registration, className: _style2.default.dashItem },
              record.lapRecords.map(function (time, index) {
                return _react2.default.createElement(
                  'td',
                  { key: 'record-' + index, className: _style2.default.lap },
                  time
                );
              })
            );
          })
        )
      );
    },
    summary: function summary(race) {
      return _react2.default.createElement(
        'table',
        { className: _style2.default.dashTable },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              null,
              '\u52A0\u7E3D'
            )
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          race.result.map(function (record, index) {
            return _react2.default.createElement(
              'tr',
              { className: _style2.default.dashItem, key: 'lap' + index },
              _react2.default.createElement(
                'td',
                { className: _style2.default.lap },
                record.sum
              )
            );
          })
        )
      );
    },
    advance: function advance(_ref2) {
      var race = _ref2.race,
          raceNames = _ref2.raceNames;
      return _react2.default.createElement(
        'table',
        { className: _style2.default.dashTable },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              null,
              _react2.default.createElement(
                'span',
                null,
                race.isFinalRace ? '總排名' : '晉級資格'
              )
            )
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          race.result.map(function (record, index) {
            return _react2.default.createElement(
              'tr',
              { key: 'adv' + index, className: _style2.default.dashItem },
              _react2.default.createElement(
                'td',
                { className: _style2.default.center },
                race.isFinalRace ? index + 1 : raceNames[record.advanceTo]
              )
            );
          })
        )
      );
    }
  }
};

var PublicEvent = exports.PublicEvent = function (_BaseComponent) {
  _inherits(PublicEvent, _BaseComponent);

  function PublicEvent(props) {
    _classCallCheck(this, PublicEvent);

    // io.sails.autoConnect = false
    // io.sails.url = 'http://localhost:1337'
    var _this = _possibleConstructorReturn(this, (PublicEvent.__proto__ || Object.getPrototypeOf(PublicEvent)).call(this, props));

    _this.sConnection = (0, _socket2.default)('http://localhost:1337');
    _this.timer = 0;
    _this.groupNames = {};
    _this.raceNames = {};
    _this.state = {
      races: [],
      raceSelected: -1,
      ongoingRace: -1
    };
    _this.dispatch = _this.props.dispatch;
    _this._bind('socketIoEvents', 'handleRefreshRace', 'handleSelect', 'updateRecords', 'updateRaces');
    return _this;
  }

  _createClass(PublicEvent, [{
    key: 'updateRaces',
    value: function updateRaces() {
      var orderedRaces = _processData2.default.returnRacesByOrder(_processData2.default.returnRaces(this.props.event.groups), this.props.event.raceOrder);
      var ongoingRace = this.state.ongoingRace === -1 ? this.props.event.ongoingRace === -1 ? undefined : _processData2.default.returnOngoingRace(this.props.event.ongoingRace, orderedRaces) : this.state.ongoingRace;
      var stateObj = { races: orderedRaces, raceSelected: this.state.raceSelected, ongoingRace: ongoingRace, dialog: undefined, editField: undefined };
      var race = void 0;
      if (ongoingRace === undefined) {
        clearInterval(this.timer);
        if (stateObj.raceSelected === -1) {
          stateObj.raceSelected = _processData2.default.returnSelectedRace(orderedRaces);
        }
      } else {
        stateObj.raceSelected = ongoingRace;
      }
      this.setState(stateObj, function () {
        if (this.state.races[this.state.raceSelected].result.length === 0) {
          this.updateResult(this.state.raceSelected);
        }
      });
    }
  }, {
    key: 'updateResult',
    value: function updateResult(index) {
      var races = this.state.races;
      var race = races[index];
      race.result = _processData2.default.returnRaceResult(race);
      this.setState({ races: races });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var onSuccess = function onSuccess() {
        var races = _processData2.default.returnRaces(_this2.props.event.groups);
        _this2.groupNames = _processData2.default.returnIdNameMap(_this2.props.event.groups);
        _this2.raceNames = _processData2.default.returnIdNameMap(races);
        return _this2.updateRaces();
      };
      this.socketIoEvents();
      if (!this.props.event) {
        return this.dispatch(_event.actionCreators.getEvent(this.props.match.params.id, onSuccess));
      }
      if (this.props.event !== -1) {
        return onSuccess();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // this.sConnection.off('raceupdate')
    }
  }, {
    key: 'socketIoEvents',
    value: function socketIoEvents(callback) {
      this.sConnection.on('raceupdate', function (data) {
        var races = this.state.races;
        var race = races[this.state.ongoingRace];

        race.recordsHashTable = data.result.recordsHashTable;
        race.result = _processData2.default.returnRaceResult(race);
        this.setState({ races: races });
      }.bind(this));
    }
  }, {
    key: 'handleRefreshRace',
    value: function handleRefreshRace(raceid) {
      var _this3 = this;

      return function (e) {
        _this3.dispatch(_event.actionCreators.getRace(raceid));
      };
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(index) {
      var _this4 = this;

      return function (e) {
        _this4.setState({ raceSelected: index }, function () {
          if (this.state.races[index].result.length === 0) {
            this.updateResult(index);
          }
        });
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          location = _props.location,
          event = _props.event,
          match = _props.match;
      var _state = this.state,
          races = _state.races,
          raceSelected = _state.raceSelected,
          ongoingRace = _state.ongoingRace;
      var groupNames = this.groupNames,
          handleSelect = this.handleSelect,
          raceNames = this.raceNames;

      var dbLabels = '';
      var dbResults = '';
      var dbSummary = '';
      var dbAdvance = '';
      var race = void 0;

      if (event === -1 || !match.params.id) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: { pathname: '/' } });
      } else if (!event) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_Header2.default, { location: location, match: match, isPublic: '1' }),
          _react2.default.createElement(
            'div',
            { className: _style2.default.loading },
            'Loading...'
          )
        );
      }

      if (raceSelected !== -1) {
        race = races[raceSelected];
        dbLabels = _render.dashboard.labels(race);
        dbResults = _react2.default.createElement(
          'div',
          { className: _style2.default.scrollBox },
          _render.dashboard.results(race)
        );
        dbSummary = _react2.default.createElement(
          'div',
          { className: _style2.default.summary },
          _render.dashboard.summary(race)
        );
        dbAdvance = _react2.default.createElement(
          'div',
          { className: _style2.default.advTable },
          _render.dashboard.advance({ race: race, raceNames: raceNames })
        );
      }
      return _react2.default.createElement(
        'div',
        { className: _style2.default.wrap },
        _react2.default.createElement(_Header2.default, { isPublic: '1', location: location, match: match }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _react2.default.createElement(
            'div',
            { className: _style2.default.info },
            _react2.default.createElement(
              'h2',
              null,
              event.nameCht
            )
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.managerList },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'div',
                { className: _style2.default.hd },
                _react2.default.createElement(
                  'span',
                  null,
                  '\u8CFD\u7A0B'
                )
              ),
              _react2.default.createElement(
                'ul',
                { className: _style2.default.ul },
                races.map(function (race, index) {
                  return _render.raceList({ race: race, index: index, raceSelected: raceSelected, groupNames: groupNames, handleSelect: handleSelect });
                })
              )
            ),
            dbLabels,
            dbResults,
            dbSummary,
            dbAdvance
          )
        ),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return PublicEvent;
}(_BaseComponent3.default);