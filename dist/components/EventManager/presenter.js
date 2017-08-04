'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManager = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _reactRouterDom = require('react-router-dom');

var _event2 = require('../../ducks/event');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _presenter = require('../Dialogue/presenter');

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _AdvRule = require('../AdvRule');

var _AdvRule2 = _interopRequireDefault(_AdvRule);

var _AssignReg = require('../AssignReg');

var _AssignReg2 = _interopRequireDefault(_AssignReg);

var _presenter2 = require('../Table/presenter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import { actionCreators as racerActions } from '../../ducks/racer'

var valueFunc = function valueFunc(modified, original, field) {
  return modified && modified[field] !== undefined ? modified[field] : original[field];
};
var returnDateTime = function returnDateTime(timestamp, forDisplay) {
  var t = new Date(timestamp + 28800000); // taipei diff
  return t.getUTCFullYear() + '-' + ('0' + (t.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + t.getUTCDate()).slice(-2) + (forDisplay ? ' ' : 'T') + ('0' + t.getUTCHours()).slice(-2) + ':' + ('0' + t.getUTCMinutes()).slice(-2); //yyyy-mm-ddThh:mm
};
var returnListArray = {
  group: function group(groups, state) {
    return groups;
  },
  race: function race(groups, state) {
    return state.groupSelected === -1 ? undefined : groups[state.groupSelected].races;
  },
  reg: function reg(groups, state) {
    return state.groupSelected === -1 ? undefined : state.raceSelected === -1 ? groups[state.groupSelected].registrations : groups[state.groupSelected].races[state.raceSelected].registrations;
  }
};
var validateRfid = function validateRfid(_ref) {
  var input = _ref.input,
      event = _ref.event,
      pacerEpc = _ref.pacerEpc;

  if (pacerEpc && input === pacerEpc) {
    return false;
  }
  for (var i = 0; i < event.groups.length; i += 1) {
    for (var j = 0; j < event.groups[i].registrations.length; j += 1) {
      if (event.groups[i].registrations[j].epc === input) {
        return false;
      }
    }
  }
  return true;
};
var returnInputs = {
  event: function event(modified, original) {
    return [{ label: '中文名稱', field: 'nameCht', type: 'text' }, { label: '英文名稱', field: 'name', type: 'text' }, { label: '地點', field: 'location', type: 'text' }, { label: '跑道長度(公尺)', field: 'lapDistance', type: 'number' }, { label: '開始時間', field: 'startTime', type: 'datetime', value: modified && modified.startTime ? modified.startTime : returnDateTime(original.startTime) }, { label: '結束時間', field: 'endTime', type: 'datetime', value: modified && modified.endTime ? modified.endTime : returnDateTime(original.endTime) }, { label: '公開活動', field: 'isPublic', type: 'checkbox' }, { label: '隊伍報名', field: 'isTeamRegistrationOpen', type: 'checkbox' }, { label: '個人報名', field: 'isRegistrationOpen', type: 'checkbox' }, { label: '地下活動', field: 'isIndieEvent', type: 'checkbox', value: true }];
  },
  group: function group() {
    return [{ label: '中文名稱', field: 'nameCht', type: 'text' }, { label: '英文名稱', field: 'name', type: 'text' }, { label: '名額', field: 'racerNumberAllowed', type: 'number' }];
  },
  race: function race() {
    return [{ label: '中文名稱', field: 'nameCht', type: 'text' }, { label: '英文名稱', field: 'name', type: 'text' }, { label: '名額', field: 'racerNumberAllowed', type: 'number' }, { label: '圈數', field: 'laps', type: 'number' }, { label: '組別初賽', field: 'isEntryRace', type: 'checkbox' }, { label: '組別決賽', field: 'isFinalRace', type: 'checkbox' }, { label: '需前導車', field: 'requirePacer', type: 'checkbox' }];
  },
  reg: function reg() {
    return [
    //    {label: '選手 ID', field: 'racer', type: 'number', disabled: true},
    { label: '稱呼方式', field: 'name', type: 'text' }, { label: '選手號碼', field: 'raceNumber', type: 'number' }];
  }
};
var title = { event: '活動', group: '組別', race: '賽事', reg: '選手' };
var lists = ['group', 'race', 'reg'];
var _render = {
  delete: function _delete(model, original, onDelete) {
    return model === 'event' && original.groups.length === 0 || model === 'group' && original.races.length === 0 && original.registrations.length === 0 || model === 'race' && original.registrations.length === 0 || model === 'reg' ? _react2.default.createElement(_Button2.default, { style: 'alert', onClick: onDelete(model), text: '\u522A\u9664' }) : _react2.default.createElement(_Button2.default, { style: 'disabled', text: '\u522A\u9664' });
  },
  li: {
    group: function group(V, I, selected, onSelect) {
      return _react2.default.createElement(
        'li',
        { className: selected === I ? _style2.default.selected : _style2.default.li, key: 'li_' + V.id },
        _react2.default.createElement(
          'button',
          { className: _style2.default.list, onClick: onSelect('group', I) },
          V.nameCht ? V.nameCht : V.name,
          _react2.default.createElement(
            'span',
            { className: _style2.default.count },
            (V.registrations ? V.registrations.length : 0) + '/' + V.racerNumberAllowed
          )
        )
      );
    },
    race: function race(V, I, selected, onSelect) {
      return _react2.default.createElement(
        'li',
        { className: selected === I ? _style2.default.selected : _style2.default.li, key: 'li_' + V.id },
        _react2.default.createElement(
          'button',
          { className: _style2.default.list, onClick: onSelect('race', I) },
          V.nameCht ? V.nameCht : V.name,
          _react2.default.createElement(
            'ul',
            { className: _style2.default.lights },
            _react2.default.createElement(
              'li',
              { className: V.requirePacer ? _style2.default.on : _style2.default.off },
              '\u524D\u5C0E'
            ),
            _react2.default.createElement(
              'li',
              { className: V.isEntryRace ? _style2.default.on : _style2.default.off },
              '\u521D\u8CFD'
            ),
            V.isFinalRace ? _react2.default.createElement(
              'li',
              { className: _style2.default.on },
              '\u6C7A\u8CFD'
            ) : _react2.default.createElement(
              'li',
              { className: V.advancingRules.length > 0 ? _style2.default.on : _style2.default.off },
              '\u6649\u7D1A'
            )
          ),
          _react2.default.createElement(
            'span',
            { className: _style2.default.count },
            (V.registrations ? V.registrations.length : 0) + '/' + V.racerNumberAllowed
          )
        )
      );
    },
    reg: function reg(V, I, selected, onSelect) {
      return _react2.default.createElement(
        'li',
        { className: selected === I ? _style2.default.selected : _style2.default.li, key: 'li_' + V.id },
        _react2.default.createElement(
          'button',
          { className: _style2.default.list, onClick: onSelect('reg', I) },
          _react2.default.createElement(
            'span',
            { className: _style2.default.raceNumber },
            V.raceNumber
          ),
          V.name ? V.name : V.id,
          _react2.default.createElement(
            'span',
            { className: _style2.default.toRight },
            _react2.default.createElement(
              'ul',
              { className: _style2.default.lights },
              _react2.default.createElement(
                'li',
                { className: V.epc ? _style2.default.on : _style2.default.off },
                'RFID'
              )
            )
          )
        )
      );
    }
  },
  ctrl: {
    group: function group(selected, array, handleStartEdit) {
      return _react2.default.createElement(
        'span',
        { className: _style2.default.right },
        selected !== -1 && _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: handleStartEdit('group', array[selected]) })
        ),
        _react2.default.createElement(_Button2.default, { style: 'short', text: '\u65B0\u589E', onClick: handleStartEdit('group', {}) })
      );
    },
    race: function race(selected, array, handleStartEdit) {
      return _react2.default.createElement(
        'span',
        { className: _style2.default.right },
        array && _react2.default.createElement(
          'span',
          null,
          selected !== -1 && _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: handleStartEdit('race', array[selected]) }),
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u65B0\u589E', onClick: handleStartEdit('race', {}) }),
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u6649\u7D1A\u898F\u5247', onClick: handleStartEdit('advRules', array) })
        )
      );
    },
    reg: function reg(selected, array, handleStartEdit) {
      return _react2.default.createElement(
        'span',
        { className: _style2.default.right },
        array && _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u65B0\u589E', onClick: handleStartEdit('reg', {}) }),
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u9078\u624B\u5206\u7D44', onClick: handleStartEdit('assignReg', array) }),
          selected !== -1 && _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: handleStartEdit('reg', array[selected]) })
        )
      );
    }
  },
  listHd: function listHd(_ref2) {
    var model = _ref2.model,
        state = _ref2.state,
        array = _ref2.array,
        handleStartEdit = _ref2.handleStartEdit;
    return _react2.default.createElement(
      'div',
      { className: _style2.default.hd, key: 'listHd' + model },
      _react2.default.createElement(
        'span',
        null,
        title[model]
      ),
      _render.ctrl[model](state[model + 'Selected'], array, handleStartEdit)
    );
  },
  list: function list(_ref3) {
    var model = _ref3.model,
        array = _ref3.array,
        state = _ref3.state,
        onSelect = _ref3.onSelect;
    return _react2.default.createElement(
      'div',
      { key: 'list' + model },
      _react2.default.createElement(
        'ul',
        { className: _style2.default.ul },
        array && array.map(function (V, I) {
          return _render.li[model](V, I, state[model + 'Selected'], onSelect);
        })
      )
    );
  },
  event: function event(_ref4) {
    var _event = _ref4.event,
        onEdit = _ref4.onEdit;
    return _react2.default.createElement(
      'div',
      { className: _style2.default.info },
      _react2.default.createElement(
        'h2',
        null,
        _event.nameCht,
        ' ',
        _react2.default.createElement(
          'span',
          { className: _style2.default.btn },
          _react2.default.createElement(_Button2.default, { style: 'short', text: '\u7DE8\u8F2F', onClick: onEdit })
        )
      ),
      _react2.default.createElement(
        'h3',
        null,
        _event.name,
        ' ',
        _react2.default.createElement(
          'span',
          { className: _style2.default.time },
          _event.startTime && returnDateTime(_event.startTime, true),
          _event.endTime && ' - ' + returnDateTime(_event.endTime, true)
        )
      ),
      _react2.default.createElement(
        'ul',
        { className: _style2.default.lights },
        _react2.default.createElement(
          'li',
          { className: _event.isPublic ? _style2.default.on : _style2.default.off },
          '\u516C\u958B\u6D3B\u52D5'
        ),
        _react2.default.createElement(
          'li',
          { className: _event.isTeamRegistrationOpen ? _style2.default.on : _style2.default.off },
          '\u968A\u4F0D\u5831\u540D'
        ),
        _react2.default.createElement(
          'li',
          { className: _event.isRegistrationOpen ? _style2.default.on : _style2.default.off },
          '\u500B\u4EBA\u5831\u540D'
        ),
        _react2.default.createElement(
          'li',
          { className: _event.isIndieEvent ? _style2.default.on : _style2.default.off },
          '\u5730\u4E0B\u6D3B\u52D5'
        ),
        _react2.default.createElement(
          'li',
          { className: _event.pacerEpc ? _style2.default.on : _style2.default.off },
          '\u524D\u5C0E\u8ECARFID'
        )
      )
    );
  },
  infoForm: function infoForm(_ref5) {
    var model = _ref5.model,
        modified = _ref5.modified,
        original = _ref5.original,
        onChange = _ref5.onChange,
        onSubmit = _ref5.onSubmit,
        onCancel = _ref5.onCancel,
        onDelete = _ref5.onDelete,
        rfidForm = _ref5.rfidForm;
    return _react2.default.createElement(
      'div',
      { className: _style2.default.form },
      _react2.default.createElement(
        'h3',
        null,
        original.id ? '編輯' : '新增',
        title[model]
      ),
      _react2.default.createElement(
        'ul',
        null,
        returnInputs[model](modified, original).map(function (V, I) {
          return _react2.default.createElement(
            'li',
            { key: 'in_' + I },
            _react2.default.createElement(
              'label',
              null,
              V.label
            ),
            _presenter2.renderInput[V.type]({ onChange: onChange(V.field), value: V.value ? V.value : valueFunc(modified, original, V.field), disabled: V.disabled })
          );
        })
      ),
      rfidForm,
      _react2.default.createElement(
        'div',
        { className: _style2.default.boxFt },
        modified ? _react2.default.createElement(_Button2.default, { text: '\u5132\u5B58', onClick: onSubmit(model) }) : _react2.default.createElement(_Button2.default, { style: 'disabled', text: '\u5132\u5B58' }),
        original.id && _render.delete(model, original, onDelete),
        _react2.default.createElement(_Button2.default, { style: 'grey', onClick: onCancel, text: '\u53D6\u6D88' })
      )
    );
  },
  rfidForm: {
    event: function event(_ref6) {
      var original = _ref6.original,
          modified = _ref6.modified,
          handleInputRfid = _ref6.handleInputRfid,
          rfidMessage = _ref6.rfidMessage;

      var testerEpc = modified && modified.testerEpc !== undefined ? modified.testerEpc : original.testerEpc;
      var pacerEpc = modified && modified.pacerEpc !== undefined ? modified.pacerEpc : original.pacerEpc;
      return _react2.default.createElement(
        'div',
        null,
        rfidMessage && _react2.default.createElement(
          'h4',
          { className: _style2.default.forbidden },
          rfidMessage
        ),
        _react2.default.createElement(
          'ul',
          null,
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'label',
              null,
              '\u524D\u5C0E\u8ECAID'
            ),
            _react2.default.createElement('input', { type: 'text', value: pacerEpc, onChange: handleInputRfid('pacerEpc') })
          )
        )
      );
    },
    reg: function reg(_ref7) {
      var original = _ref7.original,
          modified = _ref7.modified,
          handleInputRfid = _ref7.handleInputRfid,
          rfidMessage = _ref7.rfidMessage;

      var epc = modified && modified.epc !== undefined ? modified.epc : original.epc;
      return _react2.default.createElement(
        'div',
        null,
        rfidMessage && _react2.default.createElement(
          'h4',
          { className: _style2.default.forbidden },
          rfidMessage
        ),
        _react2.default.createElement(
          'label',
          null,
          'RFID'
        ),
        _react2.default.createElement('input', { type: 'text', value: epc, onChange: handleInputRfid('epc') })
      );
    }
  }
};
var isRfidReader = false;

var EventManager = exports.EventManager = function (_BaseComponent) {
  _inherits(EventManager, _BaseComponent);

  function EventManager(props) {
    _classCallCheck(this, EventManager);

    var _this = _possibleConstructorReturn(this, (EventManager.__proto__ || Object.getPrototypeOf(EventManager)).call(this, props));

    _this.state = {
      model: undefined,
      modified: undefined,
      original: undefined,
      groupSelected: -1,
      raceSelected: -1,
      regSelected: -1,
      rfidMessage: undefined
    };
    _this.dispatch = _this.props.dispatch;
    _this._bind('handleStartEdit', 'handleKeypress', 'handleKeyup', 'handleCancelEdit', 'handleDelete', 'handleSubmit', 'handleInput', 'handleInputRfid', 'handleSelect');
    return _this;
  }

  _createClass(EventManager, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var onSuccess = function onSuccess() {
        return _this2.setState({ model: 'event', original: {} });
      };
      var isMobile = window.navigator.userAgent.indexOf('Android') !== -1 ? true : false;
      if (isMobile) {
        window.addEventListener('keypress', this.handleKeypress);
        window.addEventListener('keyup', this.handleKeyup);
      }
      if (this.props.match.params.id === 'new') {
        this.dispatch(_event2.actionCreators.getEvent(this.props.match.params.id, onSuccess));
      } else {
        this.dispatch(_event2.actionCreators.getEvent(this.props.match.params.id));
      }
      //    this.dispatch(racerActions.getRacers())
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('keypress', this.handleKeypress);
      window.removeEventListener('keyup', this.handleKeyup);
    }
  }, {
    key: 'handleKeypress',
    value: function handleKeypress() {
      isRfidReader = true;
    }
  }, {
    key: 'handleKeyup',
    value: function handleKeyup() {
      isRfidReader = false;
    }
  }, {
    key: 'handleStartEdit',
    value: function handleStartEdit(model, object) {
      var _this3 = this;

      return function (e) {
        _this3.setState({ model: model, original: object });
      };
    }
  }, {
    key: 'handleCancelEdit',
    value: function handleCancelEdit() {
      if (this.props.match.params.id === 'new') {
        return window.location = '/console';
      }
      this.setState({ model: undefined, modified: undefined, original: undefined });
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(model) {
      var _this4 = this;

      return function (e) {
        var stateObj = { model: undefined, modified: undefined, original: undefined };
        var onSuccess = function onSuccess() {
          return _this4.setState(stateObj);
        };
        stateObj[model + 'Selected'] = -1;
        _this4.dispatch(_event2.actionCreators.delete(_this4.state, onSuccess));
      };
    }
  }, {
    key: 'handleInput',
    value: function handleInput(field) {
      var _this5 = this;

      return function (e) {
        if (!isRfidReader) {
          var val = e.target.value === 'true' || e.target.value === 'false' || e.target.value === 'on' ? e.target.value === 'true' ? false : true : e.target.value;
          _this5.setState({ modified: _this5.state.modified ? _extends({}, _this5.state.modified, _defineProperty({}, field, val)) : _defineProperty({}, field, val) });
        }
      };
    }
  }, {
    key: 'handleInputRfid',
    value: function handleInputRfid(field, index) {
      var _this6 = this;

      return function (e) {
        var value = e.target.value;
        if (index !== undefined) {
          var stateObj = { modified: _extends({}, _this6.state.modified) };
          stateObj.modified[field][index] = value;
          _this6.setState(stateObj);
        } else {
          _this6.setState({ modified: _this6.state.modified ? _extends({}, _this6.state.modified, _defineProperty({}, field, value)) : _defineProperty({}, field, value) });
        }
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(model) {
      var _this7 = this;

      return function (e) {
        var stateObj = { model: undefined, modified: undefined, original: undefined, rfidMessage: undefined };
        var state = _extends({}, _this7.state);
        var onSuccess = function onSuccess() {
          return _this7.setState(stateObj);
        };
        var validateResult = true;
        if (!state.original.id) {
          switch (model) {
            case 'event':
              stateObj.model = -1;
              break;
            case 'group':
              state.modified.event = _this7.props.event.id;
              state.groupSelected = stateObj.groupSelected = _this7.props.event.groups.length;
              break;
            case 'race':
              state.modified.group = _this7.props.event.groups[_this7.state.groupSelected].id;
              state.raceSelected = stateObj.raceSelected = _this7.props.event.groups[_this7.state.groupSelected].races.length;
              break;
            case 'reg':
              state.modified.group = _this7.props.event.groups[_this7.state.groupSelected].id;
              state.regSelected = stateObj.regSelected = _this7.props.event.groups[_this7.state.groupSelected].registrations.length;
              stateObj.raceSelected = -1;
              break;
          }
        }
        if (model === 'event') {
          if (state.modified.pacerEpc) {
            validateResult = validateRfid({ input: state.modified.pacerEpc, event: _this7.props.event });
            if (!validateResult) {
              return _this7.setState({ rfidMessage: '重複的RFID: ' + state.modified.pacerEpc });
            }
          }
        } else if (model === 'reg') {
          validateResult = validateRfid({ input: state.modified.epc, event: _this7.props.event, pacerEpc: _this7.props.event.pacerEpc });
          if (!validateResult) {
            return _this7.setState({ rfidMessage: '重複的RFID: ' + state.modified.epc });
          }
        }
        _this7.dispatch(_event2.actionCreators.submit(state, onSuccess));
      };
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(model, index) {
      var _this8 = this;

      return function (e) {
        var obj = void 0;
        var stateObj = void 0;
        var onSuccess = function onSuccess() {
          return _this8.setState(stateObj);
        };

        switch (model) {
          case 'group':
            obj = _this8.props.event.groups[index];
            stateObj = { groupSelected: _this8.state.groupSelected === index ? -1 : index, raceSelected: -1, regSelected: -1 };
            break;
          case 'race':
            obj = _this8.props.event.groups[_this8.state.groupSelected].races[index];
            stateObj = { raceSelected: _this8.state.raceSelected === index ? -1 : index, regSelected: -1 };
            break;
          case 'reg':
            stateObj = { regSelected: _this8.state.regSelected === index ? -1 : index };
            break;
        }
        return onSuccess();
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      var _props = this.props,
          location = _props.location,
          event = _props.event,
          match = _props.match;
      var _state = this.state,
          modified = _state.modified,
          original = _state.original,
          model = _state.model,
          groupSelected = _state.groupSelected,
          rfidMessage = _state.rfidMessage;

      var rfidForm = '';
      if (!match.params.id) {
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
      } else if (model === -1) {
        return _react2.default.createElement(_reactRouterDom.Redirect, { to: { pathname: '/console/event/' + event.id } });
      }

      return _react2.default.createElement(
        'div',
        { className: model ? _style2.default.fixed : _style2.default.wrap },
        _react2.default.createElement(_Header2.default, { location: location, nav: 'event', match: match }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _render.event({ event: event, onEdit: this.handleStartEdit('event', event) }),
          _react2.default.createElement(
            'div',
            { className: _style2.default.listHds },
            lists.map(function (V) {
              return _render.listHd({ model: V, array: returnListArray[V](_this9.props.event.groups, _this9.state), state: _this9.state, handleStartEdit: _this9.handleStartEdit });
            })
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.managerList },
            lists.map(function (V) {
              return _render.list({ model: V, array: returnListArray[V](_this9.props.event.groups, _this9.state), state: _this9.state, onSelect: _this9.handleSelect, handleStartEdit: _this9.handleStartEdit });
            })
          )
        ),
        model && _react2.default.createElement(_presenter.Dialogue, { content: model === 'advRules' ? _react2.default.createElement(_AdvRule2.default, { races: event.groups[groupSelected].races, handleCancelEdit: this.handleCancelEdit }) : model === 'assignReg' ? _react2.default.createElement(_AssignReg2.default, { groupIndex: groupSelected, group: event.groups[groupSelected], handleCancelEdit: this.handleCancelEdit }) : _render.infoForm({ model: model, modified: modified, original: original, onChange: this.handleInput, onSubmit: this.handleSubmit, onCancel: this.handleCancelEdit, onDelete: this.handleDelete, rfidForm: _render.rfidForm[model] ? _render.rfidForm[model]({ modified: modified, original: original, rfidMessage: rfidMessage, handleInputRfid: this.handleInputRfid }) : '' }) })
      );
    }
  }]);

  return EventManager;
}(_BaseComponent3.default);