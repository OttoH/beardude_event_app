'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _team = require('../../ducks/team');

var _racer = require('../../ducks/racer');

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _presenter = require('../Table/presenter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var valueFunc = function valueFunc(store, field) {
  return store.inEdit && store.inEdit[field] !== undefined ? store.inEdit[field] : store.teams[store.selectedIndex][field];
};
var listNameFunc = function listNameFunc(team) {
  return team.id ? team.nameCht && team.nameCht !== '' ? team.nameCht : team.name : '新增';
};
var returnInputs = function returnInputs(store, onChange) {
  return [{ label: '名稱', field: 'name', onChange: onChange('name'), value: valueFunc(store, 'name') }, { label: '中文名稱', field: 'nameCht', onChange: onChange('nameCht'), value: valueFunc(store, 'nameCht') }, { label: '描述', field: 'description', type: 'textarea', onChange: onChange('description'), value: valueFunc(store, 'description') }, { label: '網址', field: 'url', onChange: onChange('url'), value: valueFunc(store, 'url') }];
};
var _render = {
  inputSection: function inputSection(_ref) {
    var store = _ref.store,
        inputFunc = _ref.inputFunc;
    return _react2.default.createElement(
      'section',
      { key: 'sec-input' },
      _react2.default.createElement(
        'h3',
        null,
        '\u968A\u4F0D\u8CC7\u6599'
      ),
      _react2.default.createElement(
        'ul',
        null,
        returnInputs(store, inputFunc).map(function (input) {
          return _render.item(_extends({}, input));
        })
      )
    );
  },
  memberSection: function memberSection(_ref2) {
    var store = _ref2.store,
        inputFunc = _ref2.inputFunc,
        deleteFunc = _ref2.deleteFunc;

    var team = store.teams[store.selectedIndex];
    var teamRacers = store.selectedIndex !== -1 ? store.inEdit && store.inEdit.racers ? store.inEdit.racers : team.racers : [];
    return _react2.default.createElement(
      'section',
      { key: 'sec-member' },
      _react2.default.createElement(
        'h3',
        null,
        '\u6210\u54E1'
      ),
      _react2.default.createElement(
        'table',
        null,
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              null,
              '\u59D3\u540D'
            ),
            _react2.default.createElement(
              'th',
              null,
              '\u968A\u9577'
            ),
            _react2.default.createElement('th', { className: _style2.default.ctrl })
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          teamRacers && teamRacers.map(function (racer) {
            return _render.tableItem({ racer: racer, leader: store.inEdit && store.inEdit.leader !== undefined ? store.inEdit.leader : team.leader, onChange: inputFunc, onDelete: deleteFunc });
          })
        )
      )
    );
  },
  newMemberSection: function newMemberSection(_ref3) {
    var racers = _ref3.racers,
        addFunc = _ref3.addFunc;
    return _react2.default.createElement(
      'section',
      { key: 'sec-newMember' },
      _react2.default.createElement(
        'h3',
        null,
        '\u65B0\u589E\u968A\u54E1'
      ),
      _react2.default.createElement(
        'div',
        { className: _style2.default.addList },
        _react2.default.createElement(
          'ul',
          null,
          racers.length > 0 && racers.map(function (racer) {
            if (!racer.team) {
              return _render.newMemberOption({ racer: racer, onClick: addFunc });
            }
          })
        )
      )
    );
  },
  item: function item(_ref4) {
    var disabled = _ref4.disabled,
        label = _ref4.label,
        field = _ref4.field,
        onChange = _ref4.onChange,
        _ref4$type = _ref4.type,
        type = _ref4$type === undefined ? 'text' : _ref4$type,
        value = _ref4.value;
    return _react2.default.createElement(
      'li',
      { key: field },
      _react2.default.createElement(
        'label',
        null,
        label
      ),
      _presenter.renderInput[type]({ disabled: disabled, onChange: onChange, value: value })
    );
  },
  tableItem: function tableItem(_ref5) {
    var racer = _ref5.racer,
        leader = _ref5.leader,
        onChange = _ref5.onChange,
        onDelete = _ref5.onDelete;
    return _react2.default.createElement(
      'tr',
      { key: 'item-' + racer.id },
      _react2.default.createElement(
        'td',
        null,
        racer.lastName + racer.firstName
      ),
      _react2.default.createElement(
        'td',
        { className: _style2.default.center },
        _react2.default.createElement('input', { onChange: onChange('leader'), type: 'radio', value: racer.id, checked: leader === racer.id ? 'checked' : '' })
      ),
      _react2.default.createElement(
        'td',
        { className: _style2.default.ctrl },
        (racer.toAdd || racer.id !== leader && !racer.toRemove) && _react2.default.createElement(_Button2.default, { onClick: onDelete(racer.id), text: '\u522A\u9664' }),
        !racer.toAdd && racer.toRemove && _react2.default.createElement(_Button2.default, { onClick: onDelete(racer.id, true), text: '\u9084\u539F' })
      )
    );
  },
  newMemberOption: function newMemberOption(_ref6) {
    var racer = _ref6.racer,
        onClick = _ref6.onClick;
    return _react2.default.createElement(
      'li',
      { key: 'racerOption-' + racer.id },
      _react2.default.createElement(_Button2.default, { text: racer.lastName + ' ' + racer.firstName, onClick: onClick(racer) })
    );
  }
};

var Team = function (_BaseComponent) {
  _inherits(Team, _BaseComponent);

  function Team(props) {
    _classCallCheck(this, Team);

    var _this = _possibleConstructorReturn(this, (Team.__proto__ || Object.getPrototypeOf(Team)).call(this, props));

    _this.state = { readOnly: true };
    _this.dispatch = _this.props.dispatch;
    _this._bind('handleCreate', 'handleInput', 'handleEditToggle', 'handleAddRacer', 'handleRemoveRacer', 'handleSelect', 'handleSubmit');
    return _this;
  }

  _createClass(Team, [{
    key: 'handleCreate',
    value: function handleCreate() {
      this.dispatch(_team.actionCreators.create());
      this.setState({ readOnly: false });
    }
  }, {
    key: 'handleInput',
    value: function handleInput(field) {
      var _this2 = this;

      return function (e) {
        _this2.dispatch(_team.actionCreators.input(field, field === 'leader' ? parseInt(e.currentTarget.value) : e.currentTarget.value));
      };
    }
  }, {
    key: 'handleEditToggle',
    value: function handleEditToggle() {
      this.setState({ readOnly: !this.state.readOnly });
      if (!this.state.readOnly) {
        this.dispatch(_team.actionCreators.cancelEdit());
      }
    }
  }, {
    key: 'handleAddRacer',
    value: function handleAddRacer(newRacer) {
      var _this3 = this;

      return function (e) {
        var added = void 0;
        _this3.props.team.teams[_this3.props.team.selectedIndex].racers.forEach(function (racer) {
          if (racer.id === newRacer.id) {
            added = true;
          }
        });
        if (!added) {
          _this3.dispatch(_team.actionCreators.addRacer(newRacer));
        }
      };
    }
  }, {
    key: 'handleRemoveRacer',
    value: function handleRemoveRacer(id, toRestore) {
      var _this4 = this;

      return function (e) {
        if (_this4.props.team.teams[_this4.props.team.selectedIndex].racers.length > 1) {
          _this4.dispatch(_team.actionCreators.removeRacer(id, toRestore));
        }
      };
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(index) {
      var _this5 = this;

      return function (e) {
        _this5.dispatch(_team.actionCreators.selectTeam(index));
        _this5.setState({ readOnly: true });
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      this.dispatch(_team.actionCreators.submit());
      this.setState({ readOnly: true });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.team.teams) {
        this.dispatch(_team.actionCreators.getTeams());
      }
      if (!this.props.racer.racers) {
        this.dispatch(_racer.actionCreators.getRacers());
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var store = this.props.team;
      var newMemberSection = !this.state.readOnly ? _render.newMemberSection({ racers: this.props.racer.racers, addFunc: this.handleAddRacer }) : '';
      var editBd = store.teams && store.selectedIndex > -1 && store.teams[store.selectedIndex] ? [_render.inputSection({ store: store, inputFunc: this.handleInput }), _render.memberSection({ store: store, inputFunc: this.handleInput, deleteFunc: this.handleRemoveRacer }), newMemberSection] : [];

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, { location: this.props.location, nav: 'base' }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _react2.default.createElement(_Table2.default, { list: store.teams, selectedIndex: store.selectedIndex, editBody: editBd, inEdit: this.props.team.inEdit ? true : false, readOnly: this.state.readOnly, listNameFunc: listNameFunc, handleSelect: this.handleSelect, handleSubmit: this.handleSubmit, handleEditToggle: this.handleEditToggle, handleCreate: this.handleCreate })
        )
      );
    }
  }]);

  return Team;
}(_BaseComponent3.default);

exports.default = Team;