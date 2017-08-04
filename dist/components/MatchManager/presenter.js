'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MatchManager = undefined;

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

var _processData = require('./processData');

var _processData2 = _interopRequireDefault(_processData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _render = {
  advanceMenu: function advanceMenu(_ref) {
    var advancingRules = _ref.advancingRules,
        raceNames = _ref.raceNames,
        value = _ref.value,
        handleEditAdvnace = _ref.handleEditAdvnace,
        index = _ref.index;
    return _react2.default.createElement(
      'select',
      { defaultValue: value, onChange: handleEditAdvnace(index) },
      _react2.default.createElement(
        'option',
        { value: '-1' },
        '\u7121'
      ),
      advancingRules.map(function (rule) {
        return _react2.default.createElement(
          'option',
          { key: 'rule' + rule.toRace, value: rule.toRace },
          raceNames[rule.toRace]
        );
      })
    );
  },

  raceList: function raceList(_ref2) {
    var race = _ref2.race,
        raceSelected = _ref2.raceSelected,
        index = _ref2.index,
        handleSelect = _ref2.handleSelect,
        groupNames = _ref2.groupNames;

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
  raceListDraggable: function raceListDraggable(_ref3) {
    var race = _ref3.race,
        raceSelected = _ref3.raceSelected,
        index = _ref3.index,
        handleSelect = _ref3.handleSelect,
        groupNames = _ref3.groupNames,
        handleDragStart = _ref3.handleDragStart,
        handleDragOver = _ref3.handleDragOver,
        handleDragEnd = _ref3.handleDragEnd;

    return _react2.default.createElement(
      'li',
      { className: index === raceSelected ? _style2.default.selected : _style2.default.li, key: 'race' + race.id, draggable: 'true', onDragStart: handleDragStart(index), onDragOver: handleDragOver(index), onDragEnd: handleDragEnd },
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
      _react2.default.createElement('div', { className: _style2.default.dragHandle })
    );
  },
  raceCtrl: function raceCtrl(_ref4) {
    var race = _ref4.race,
        readerStatus = _ref4.readerStatus,
        editField = _ref4.editField,
        ongoingRace = _ref4.ongoingRace,
        handleEndRace = _ref4.handleEndRace,
        handleUpdateDialog = _ref4.handleUpdateDialog,
        handleToggleEdit = _ref4.handleToggleEdit,
        modified = _ref4.modified;

    switch (race.raceStatus) {
      case 'init':
        {
          return _react2.default.createElement(
            'span',
            { className: _style2.default.raceCtrl },
            ongoingRace === undefined ? _react2.default.createElement(_Button2.default, { style: 'short', text: '\u958B\u8CFD\u5012\u6578', onClick: handleUpdateDialog('startCountdown') }) : _react2.default.createElement(_Button2.default, { text: '\u958B\u8CFD\u5012\u6578', style: 'shortDisabled' }),
            _react2.default.createElement(_Button2.default, { style: 'shortRed', text: '\u91CD\u8A2D\u6BD4\u8CFD', onClick: handleUpdateDialog('cancelRace') })
          );
        }
      case 'started':
        {
          return _react2.default.createElement(
            'span',
            { className: _style2.default.raceCtrl },
            race.result.laps === race.laps ? _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7D50\u675F\u6BD4\u8CFD', onClick: handleEndRace }) : _react2.default.createElement(_Button2.default, { style: 'shortRed', text: '\u7D50\u675F\u6BD4\u8CFD', onClick: handleUpdateDialog('endRace') }),
            _react2.default.createElement(_Button2.default, { style: 'shortRed', text: '\u91CD\u8A2D\u6BD4\u8CFD', onClick: handleUpdateDialog('cancelRace') })
          );
        }
      case 'ended':
        {
          return _react2.default.createElement(
            'span',
            { className: _style2.default.raceCtrl },
            _react2.default.createElement(_Button2.default, { style: 'short', text: '\u9001\u51FA\u7D50\u679C', onClick: handleUpdateDialog('submitResult') }),
            editField === 'raceResult' ? _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(_Button2.default, { style: 'shortGrey', text: '\u53D6\u6D88', onClick: handleToggleEdit('raceResult') }),
              _react2.default.createElement(_Button2.default, { style: 'shortDisabled', text: '\u91CD\u8A2D\u6BD4\u8CFD' })
            ) : _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: handleToggleEdit('raceResult') }),
              _react2.default.createElement(_Button2.default, { style: 'shortRed', text: '\u91CD\u8A2D\u6BD4\u8CFD', onClick: handleUpdateDialog('cancelRace') })
            )
          );
        }
      case 'submitted':
        {
          return _react2.default.createElement(
            'span',
            { className: _style2.default.raceCtrl },
            editField === 'raceResult' ? _react2.default.createElement(
              'span',
              null,
              modified ? _react2.default.createElement(_Button2.default, { style: 'short', text: '\u9001\u51FA\u7D50\u679C', onClick: handleUpdateDialog('submitResult') }) : _react2.default.createElement(_Button2.default, { style: 'shortDisabled', text: '\u9001\u51FA\u7D50\u679C' }),
              _react2.default.createElement(_Button2.default, { style: 'shortGrey', text: '\u53D6\u6D88', onClick: handleToggleEdit('raceResult') }),
              _react2.default.createElement(_Button2.default, { style: 'shortDisabled', text: '\u91CD\u8A2D\u6BD4\u8CFD' })
            ) : _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: handleToggleEdit('raceResult') }),
              _react2.default.createElement(_Button2.default, { style: 'shortRed', text: '\u91CD\u8A2D\u6BD4\u8CFD', onClick: handleUpdateDialog('cancelRace') })
            )
          );
        }
    }
  },
  dialog: {
    startCountdown: function startCountdown(_ref5) {
      var handleStartRace = _ref5.handleStartRace,
          handleUpdateDialog = _ref5.handleUpdateDialog,
          countdown = _ref5.countdown,
          handleChangeCountdown = _ref5.handleChangeCountdown;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u958B\u8CFD\u5012\u6578'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', { className: _style2.default.countDown, type: 'number', value: countdown, onChange: handleChangeCountdown(), placeholder: '\u79D2' })
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { onClick: handleStartRace, text: '\u958B\u59CB' }),
          _react2.default.createElement(_Button2.default, { style: 'grey', onClick: handleUpdateDialog(), text: '\u53D6\u6D88' })
        )
      );
    },
    countdown: function countdown(_ref6) {
      var counter = _ref6.counter,
          handleUpdateDialog = _ref6.handleUpdateDialog;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u958B\u8CFD\u5012\u6578'
        ),
        counter && _react2.default.createElement(
          'div',
          { className: _style2.default.timer },
          counter
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { style: 'alert', onClick: handleUpdateDialog('cancelRace'), text: '\u91CD\u8A2D\u6BD4\u8CFD' })
        )
      );
    },
    cancelRace: function cancelRace(_ref7) {
      var handleResetRace = _ref7.handleResetRace,
          handleUpdateDialog = _ref7.handleUpdateDialog,
          counter = _ref7.counter;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u91CD\u8A2D\u6BD4\u8CFD'
        ),
        _react2.default.createElement(
          'h4',
          null,
          '\u60A8\u78BA\u5B9A\u8981\u53D6\u6D88\u9019\u5834\u6BD4\u8CFD\u7684\u6240\u6709\u6210\u7E3E\uFF0C\u4E26\u5C07\u6BD4\u8CFD\u72C0\u614B\u9084\u539F\u55CE\uFF1F'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { style: 'alert', onClick: handleResetRace, text: '\u78BA\u5B9A\u91CD\u8A2D' }),
          counter ? _react2.default.createElement(_Button2.default, { style: 'grey', onClick: handleUpdateDialog('countdown'), text: '\u53D6\u6D88' }) : _react2.default.createElement(_Button2.default, { style: 'grey', onClick: handleUpdateDialog(), text: '\u53D6\u6D88' })
        )
      );
    },
    endRace: function endRace(_ref8) {
      var handleEndRace = _ref8.handleEndRace,
          handleUpdateDialog = _ref8.handleUpdateDialog;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u7D50\u675F\u6BD4\u8CFD'
        ),
        _react2.default.createElement(
          'h4',
          null,
          '\u60A8\u78BA\u5B9A\u8981\u7D50\u675F\u9019\u5834\u6BD4\u8CFD\uFF0C\u4F7F\u7528\u9019\u5834\u6BD4\u8CFD\u8A18\u9304\u7684\u8CC7\u6599\u8A08\u7B97\u6210\u7E3E\uFF1F'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { style: 'alert', onClick: handleEndRace, text: '\u78BA\u5B9A\u7D50\u675F' }),
          _react2.default.createElement(_Button2.default, { style: 'grey', onClick: handleUpdateDialog(), text: '\u53D6\u6D88' })
        )
      );
    },
    submitResult: function submitResult(_ref9) {
      var handleSubmitResult = _ref9.handleSubmitResult,
          handleUpdateDialog = _ref9.handleUpdateDialog;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u9001\u51FA\u6BD4\u8CFD\u7D50\u679C'
        ),
        _react2.default.createElement(
          'h4',
          null,
          '\u78BA\u8A8D\u4E26\u9001\u51FA\u6BD4\u8CFD\u7D50\u679C'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { style: 'alert', onClick: handleSubmitResult, text: '\u9001\u51FA' }),
          _react2.default.createElement(_Button2.default, { style: 'grey', onClick: handleUpdateDialog(), text: '\u53D6\u6D88' })
        )
      );
    },
    readerNotStarted: function readerNotStarted(_ref10) {
      var handleUpdateDialog = _ref10.handleUpdateDialog;
      return _react2.default.createElement(
        'div',
        { className: _style2.default.form },
        _react2.default.createElement(
          'h3',
          null,
          '\u9023\u7DDA\u7570\u5E38'
        ),
        _react2.default.createElement(
          'h4',
          null,
          '\u7121\u6CD5\u9023\u63A5\u5230RFID\u9598\u9580\u7CFB\u7D71\uFF0C\u8ACB\u78BA\u5B9A\u9598\u9580\u7CFB\u7D71\u5DF2\u6B63\u78BA\u555F\u52D5\uFF0C\u4E26\u5177\u5099\u7DB2\u8DEF\u9023\u7DDA'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { onClick: handleUpdateDialog(), text: '\u95DC\u9589' })
        )
      );
    }
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
    advance: function advance(_ref11) {
      var race = _ref11.race,
          raceNames = _ref11.raceNames;
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
    },
    edit: function edit(_ref12) {
      var race = _ref12.race,
          raceNames = _ref12.raceNames,
          handleDragStart = _ref12.handleDragStart,
          handleDragOver = _ref12.handleDragOver,
          handleDragEnd = _ref12.handleDragEnd,
          handleEditAdvnace = _ref12.handleEditAdvnace;
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
                '\u6821\u6B63\u6210\u7E3E'
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
                !race.isFinalRace && _render.advanceMenu({ advancingRules: race.advancingRules, raceNames: raceNames, index: index, value: record.advanceTo, handleEditAdvnace: handleEditAdvnace }),
                _react2.default.createElement('div', { className: _style2.default.dragHandle, draggable: 'true', onDragStart: handleDragStart(index), onDragOver: handleDragOver(index), onDragEnd: handleDragEnd })
              )
            );
          })
        )
      );
    }
  }
};

var MatchManager = exports.MatchManager = function (_BaseComponent) {
  _inherits(MatchManager, _BaseComponent);

  function MatchManager(props) {
    _classCallCheck(this, MatchManager);

    /*
    io.sails.autoConnect = false
    io.sails.url = 'http://localhost:1337'
    */
    var _this = _possibleConstructorReturn(this, (MatchManager.__proto__ || Object.getPrototypeOf(MatchManager)).call(this, props));

    _this.sConnection = (0, _socket2.default)('http://localhost:1337');
    _this.timer = 0;
    _this.rfidTimeout = 0;
    _this.groupNames = {};
    _this.raceNames = {};
    _this.originalData = {};
    _this.modified = false;
    _this.state = {
      races: [],
      raceSelected: -1,
      readerStatus: undefined, // didmount的時候打一次api先init狀態
      ongoingRace: -1,
      dialog: undefined,
      countdown: 60,
      counter: undefined,
      editField: undefined
    };
    _this.dispatch = _this.props.dispatch;
    _this._bind('socketIoEvents', 'getReaderStatus', 'countdown', 'handleChangeCountdown', 'handleControlReader', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleEditAdvnace', 'handleEndRace', 'handleRefreshRace', 'handleResize', 'handleSelect', 'handleStartRace', 'handleSubmitRaceOrder', 'handleSubmitResult', 'handleToggleEdit', 'handleUpdateDialog', 'handleResetRace', 'updateRecords', 'updateRaces');
    return _this;
  }

  _createClass(MatchManager, [{
    key: 'updateRaces',
    value: function updateRaces() {
      var orderedRaces = _processData2.default.returnRacesByOrder(_processData2.default.returnRaces(this.props.event.groups), this.props.event.raceOrder);
      var ongoingRace = this.state.ongoingRace === -1 ? this.props.event.ongoingRace === -1 ? undefined : _processData2.default.returnOngoingRace(this.props.event.ongoingRace, orderedRaces) : this.state.ongoingRace;
      var stateObj = { races: orderedRaces, raceSelected: this.state.raceSelected, ongoingRace: ongoingRace, dialog: undefined, editField: undefined };
      var race = void 0;
      this.originalData = orderedRaces;
      this.modified = false;
      if (ongoingRace === undefined) {
        clearInterval(this.timer);
        if (stateObj.raceSelected === -1) {
          stateObj.raceSelected = _processData2.default.returnSelectedRace(orderedRaces);
        }
      } else {
        stateObj.raceSelected = ongoingRace;
        if (orderedRaces[ongoingRace].startTime && orderedRaces[ongoingRace].startTime > Date.now()) {
          stateObj.dialog = 'countdown';
          this.timer = setInterval(this.countdown, 100);
        }
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
        if (_this2.props.event.raceOrder.length === 0 || _this2.props.event.raceOrder.length < races.length) {
          var eventStateObj = { model: 'event', original: { id: _this2.props.event.id }, modified: { raceOrder: races.map(function (race) {
                return race.id;
              }) } };
          return _this2.dispatch(_event.actionCreators.submit(eventStateObj));
        }
        return _this2.updateRaces();
      };
      this.socketIoEvents(this.getReaderStatus);
      if (!this.props.event) {
        return this.dispatch(_event.actionCreators.getEvent(this.props.match.params.id, onSuccess));
      }
      return onSuccess();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      /*
      this.sConnection.off('connect')
      this.sConnection.off('readerstatus')
      this.sConnection.off('raceupdate')
      */
    }
  }, {
    key: 'countdown',
    value: function countdown() {
      var _this3 = this;

      var reset = function reset() {
        clearInterval(_this3.timer);
        return _this3.setState({ counter: undefined, dialog: undefined });
      };
      if (this.state.ongoingRace === undefined) {
        return reset();
      }
      var startTime = this.state.races[this.state.ongoingRace].startTime;
      var timeLeft = startTime - Date.now();
      if (timeLeft <= 0) {
        return reset();
      }
      var result = parseFloat(Math.floor(timeLeft / 100) / 10).toFixed(1);
      this.setState({ counter: result });
    }
  }, {
    key: 'socketIoEvents',
    value: function socketIoEvents(callback) {
      this.sConnection.on('connect', function onConnect() {
        this.sConnection.get('/api/race/joinReaderRoom', function res() {
          if (callback !== undefined) {
            callback();
          }
        });
      }.bind(this));
      this.sConnection.on('readerstatus', function (data) {
        this.setState({ readerStatus: data.result && data.result.isSingulating ? 'started' : 'idle' });
      }.bind(this));
      this.sConnection.on('raceupdate', function (data) {
        var races = this.state.races;
        var race = races[this.state.ongoingRace];

        race.recordsHashTable = data.result.recordsHashTable;
        race.result = _processData2.default.returnRaceResult(race);
        this.setState({ races: races });
      }.bind(this));
    }
  }, {
    key: 'getReaderStatus',
    value: function getReaderStatus() {
      this.sConnection.post(_socket2.default.sails.url + '/api/race/readerRoom', { type: 'getreaderstatus' });
    }
  }, {
    key: 'handleToggleEdit',
    value: function handleToggleEdit(field) {
      var _this4 = this;

      return function (e) {
        if (_this4.state.editField === field) {
          _this4.modified = false;
          return _this4.setState({ editField: undefined, races: _this4.originalData });
        }
        _this4.setState({ editField: field });
      };
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart(fromIndex) {
      var _this5 = this;

      return function (e) {
        _this5.dragFromIndex = fromIndex;
        _this5.dragOverIndex = fromIndex;
      };
    }
  }, {
    key: 'handleDragOver',
    value: function handleDragOver(overIndex) {
      var _this6 = this;

      return function (e) {
        _this6.dragOverIndex = overIndex;
      };
    }
  }, {
    key: 'handleDragEnd',
    value: function handleDragEnd() {
      if (this.dragFromIndex !== this.dragOverIndex) {
        this.modified = true;
        if (this.state.editField === 'raceOrder') {
          this.setState({ races: _processData2.default.returnMovedArray([].concat(_toConsumableArray(this.state.races)), this.dragFromIndex, this.dragOverIndex), raceSelected: this.dragOverIndex });
        } else if (this.state.editField === 'raceResult') {
          var races = this.state.races;
          var race = races[this.state.raceSelected];
          race.result = _processData2.default.returnMovedArray([].concat(_toConsumableArray(race.result)), this.dragFromIndex, this.dragOverIndex);
          this.setState({ races: races });
        }
      }
    }
  }, {
    key: 'handleEditAdvnace',
    value: function handleEditAdvnace(index) {
      var _this7 = this;

      return function (e) {
        var stateObj = { races: _this7.state.races };
        var race = stateObj.races[_this7.state.raceSelected];
        _this7.modified = true;
        race.result[index].advanceTo = e.target.value === '-1' ? undefined : parseInt(e.target.value);
        _this7.setState(stateObj);
      };
    }
  }, {
    key: 'handleSubmitRaceOrder',
    value: function handleSubmitRaceOrder() {
      var _this8 = this;

      var onSuccess = function onSuccess() {
        return _this8.setState({ editField: undefined });
      };
      var eventStateObj = { model: 'event', original: { id: this.props.event.id }, modified: { raceOrder: this.state.races.map(function (V) {
            return V.id;
          }) } };
      return this.dispatch(_event.actionCreators.submit(eventStateObj, onSuccess));
    }
  }, {
    key: 'handleUpdateDialog',
    value: function handleUpdateDialog(value) {
      var _this9 = this;

      return function (e) {
        _this9.setState({ dialog: value });
      };
    }
  }, {
    key: 'handleRefreshRace',
    value: function handleRefreshRace(raceid) {
      var _this10 = this;

      return function (e) {
        _this10.dispatch(_event.actionCreators.getRace(raceid));
      };
    }
  }, {
    key: 'handleChangeCountdown',
    value: function handleChangeCountdown() {
      var _this11 = this;

      return function (e) {
        _this11.setState({ countdown: e.target.value });
      };
    }
  }, {
    key: 'handleControlReader',
    value: function handleControlReader(type) {
      this.sConnection.post(_socket2.default.sails.url + '/api/race/readerRoom', { type: type, payload: { eventId: this.props.event.id } });
    }
  }, {
    key: 'handleStartRace',
    value: function handleStartRace() {
      var obj = { id: this.state.races[this.state.raceSelected].id, startTime: Date.now() + this.state.countdown * 1000 };
      if (this.state.races[this.state.raceSelected].raceStatus === 'init' && this.state.ongoingRace === undefined) {
        this.handleControlReader('startreader');
        this.rfidTimeout = setInterval(function () {
          if (this.state.readerStatus === 'started') {
            clearInterval(this.rfidTimeout);
            this.setState({ ongoingRace: this.state.raceSelected }, function () {
              this.dispatch(_event.actionCreators.controlRace('start', obj, this.updateRaces));
            }.bind(this));
          }
        }.bind(this), 300);
        setTimeout(function () {
          if (this.state.readerStatus !== 'started') {
            clearInterval(this.rfidTimeout);
            this.setState({ dialog: 'readerNotStarted' });
          }
        }.bind(this), 5000);
      }
    }
  }, {
    key: 'handleResetRace',
    value: function handleResetRace() {
      var _this12 = this;

      var onSuccess = function onSuccess() {
        _this12.handleControlReader('terminatereader');
        _this12.setState({ ongoingRace: undefined }, function () {
          this.updateRaces();
        }.bind(_this12));
      };
      this.dispatch(_event.actionCreators.controlRace('reset', { id: this.state.races[this.state.raceSelected].id }, onSuccess));
    }
  }, {
    key: 'handleEndRace',
    value: function handleEndRace() {
      var _this13 = this;

      var onSuccess = function onSuccess() {
        _this13.handleControlReader('terminatereader');
        _this13.setState({ ongoingRace: undefined }, function () {
          this.updateRaces();
        }.bind(_this13));
      };
      this.dispatch(_event.actionCreators.controlRace('end', { id: this.state.races[this.state.raceSelected].id }, onSuccess));
    }
  }, {
    key: 'handleSubmitResult',
    value: function handleSubmitResult() {
      this.dispatch(_event.actionCreators.submitRaceResult(this.state.races[this.state.raceSelected], this.updateRaces));
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(index) {
      var _this14 = this;

      return function (e) {
        if (_this14.state.editField === undefined) {
          _this14.setState({ raceSelected: index }, function () {
            if (this.state.races[index].result.length === 0) {
              this.updateResult(index);
            }
          });
        }
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
          counter = _state.counter,
          races = _state.races,
          raceSelected = _state.raceSelected,
          readerStatus = _state.readerStatus,
          dialog = _state.dialog,
          ongoingRace = _state.ongoingRace,
          countdown = _state.countdown,
          editField = _state.editField;
      var getReaderStatus = this.getReaderStatus,
          groupNames = this.groupNames,
          handleChangeCountdown = this.handleChangeCountdown,
          handleDragStart = this.handleDragStart,
          handleDragOver = this.handleDragOver,
          handleDragEnd = this.handleDragEnd,
          handleEditAdvnace = this.handleEditAdvnace,
          handleEndRace = this.handleEndRace,
          handleResetRace = this.handleResetRace,
          handleToggleEdit = this.handleToggleEdit,
          handleSelect = this.handleSelect,
          handleStartRace = this.handleStartRace,
          handleSubmitResult = this.handleSubmitResult,
          handleUpdateDialog = this.handleUpdateDialog,
          modified = this.modified,
          raceNames = this.raceNames;

      var dbLabels = '';
      var dbResults = '';
      var dbSummary = '';
      var dbAdvance = '';
      var raceCtrl = '';
      var race = void 0;

      if (event === -1 || !match.params.id) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: { pathname: '/console' } });
      } else if (!event) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_Header2.default, { location: location, nav: 'event', match: match }),
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
        if (editField === 'raceResult') {
          dbAdvance = _react2.default.createElement(
            'div',
            { className: _style2.default.editRank },
            _render.dashboard.edit({ race: race, raceNames: raceNames, handleDragStart: handleDragStart, handleDragOver: handleDragOver, handleDragEnd: handleDragEnd, handleEditAdvnace: handleEditAdvnace })
          );
        } else {
          dbAdvance = _react2.default.createElement(
            'div',
            { className: _style2.default.advTable },
            _render.dashboard.advance({ race: race, raceNames: raceNames })
          );
        }
        raceCtrl = _render.raceCtrl({ race: race, readerStatus: readerStatus, editField: editField, ongoingRace: ongoingRace, modified: modified, handleUpdateDialog: handleUpdateDialog, handleEndRace: handleEndRace, handleToggleEdit: handleToggleEdit });
      }
      return _react2.default.createElement(
        'div',
        { className: _style2.default.wrap },
        _react2.default.createElement(_Header2.default, { location: location, nav: 'event', match: match }),
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
            ),
            raceCtrl
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
                editField === 'raceOrder' ? _react2.default.createElement(
                  'span',
                  null,
                  modified === false ? _react2.default.createElement(_Button2.default, { style: 'shortDisabled', text: '\u5132\u5B58' }) : _react2.default.createElement(_Button2.default, { style: 'short', onClick: this.handleSubmitRaceOrder, text: '\u5132\u5B58' }),
                  _react2.default.createElement(_Button2.default, { style: 'shortGrey', onClick: this.handleToggleEdit('raceOrder'), text: '\u53D6\u6D88' })
                ) : _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F\u8CFD\u7A0B', onClick: this.handleToggleEdit('raceOrder') })
              ),
              _react2.default.createElement(
                'ul',
                { className: _style2.default.ul },
                races.map(function (race, index) {
                  return editField === 'raceOrder' ? _render.raceListDraggable({ race: race, index: index, raceSelected: raceSelected, groupNames: groupNames, handleSelect: handleSelect, handleDragStart: handleDragStart, handleDragOver: handleDragOver, handleDragEnd: handleDragEnd }) : _render.raceList({ race: race, index: index, raceSelected: raceSelected, groupNames: groupNames, handleSelect: handleSelect });
                })
              )
            ),
            dbLabels,
            dbResults,
            dbSummary,
            dbAdvance
          )
        ),
        dialog && _react2.default.createElement(_presenter.Dialogue, { content: _render.dialog[dialog]({ countdown: countdown, counter: counter, handleStartRace: handleStartRace, handleUpdateDialog: handleUpdateDialog, handleChangeCountdown: handleChangeCountdown, handleResetRace: handleResetRace, handleEndRace: handleEndRace, handleSubmitResult: handleSubmitResult }) })
      );
    }
  }]);

  return MatchManager;
}(_BaseComponent3.default);