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
  return store.inEdit && store.inEdit[field] !== undefined ? store.inEdit[field] : store.racers[store.selectedIndex][field];
};
var listNameFunc = function listNameFunc(racer) {
  return racer.id ? racer.lastName + racer.firstName : '新增';
};
var returnBasicInputs = function returnBasicInputs(store, onChange) {
  return [{ label: '電子信箱', field: 'email', onChange: onChange('email'), value: valueFunc(store, 'email') }, { label: '電話', field: 'phone', onChange: onChange('phone'), value: valueFunc(store, 'phone') }, { label: '姓氏', field: 'lastName', onChange: onChange('lastName'), value: valueFunc(store, 'lastName') }, { label: '名字', field: 'firstName', onChange: onChange('firstName'), value: valueFunc(store, 'firstName') }, { label: '綽號', field: 'nickName', onChange: onChange('nickName'), value: valueFunc(store, 'nickName') }, { label: '生日', field: 'birthday', onChange: onChange('birthday'), value: valueFunc(store, 'birthday') }, { label: '身分證或護照', field: 'idNumber', onChange: onChange('idNumber'), value: valueFunc(store, 'idNumber') }, { label: '已啟用', field: 'isActive', type: 'checkbox', onChange: onChange('isActive'), value: valueFunc(store, 'isActive') }];
};
var returnPasswordInputs = function returnPasswordInputs(store, onChange) {
  return [{ label: '新密碼', field: 'password', type: 'password', onChange: onChange('password'), value: valueFunc(store, 'password') }, { label: '確認新密碼', field: 'confirmPassword', type: 'password', onChange: onChange('confirmPassword'), value: valueFunc(store, 'confirmPassword') }];
};
var returnAddressInputs = function returnAddressInputs(store, onChange) {
  return [{ label: '街道', field: 'street', onChange: onChange('street'), value: valueFunc(store, 'street') }, { label: '區', field: 'district', onChange: onChange('district'), value: valueFunc(store, 'district') }, { label: '城市', field: 'city', onChange: onChange('city'), value: valueFunc(store, 'city') }, { label: '鄉鎮', field: 'county', onChange: onChange('county'), value: valueFunc(store, 'county') }, { label: '國家', field: 'country', onChange: onChange('country'), value: valueFunc(store, 'country') }, { label: '郵遞區號', field: 'zip', onChange: onChange('zip'), value: valueFunc(store, 'zip') }];
};
var returnTeamInputs = function returnTeamInputs(racer) {
  return [{ label: '車隊', field: 'name', disabled: true, value: racer.team ? racer.team.name : '(無)' }, { label: '隊長', field: 'leader', type: 'checkbox', disabled: true, value: racer.team && racer.id === racer.team.leader ? true : false }];
};
var _render = {
  item: function item(_ref) {
    var disabled = _ref.disabled,
        label = _ref.label,
        field = _ref.field,
        onChange = _ref.onChange,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'text' : _ref$type,
        value = _ref.value;
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
  section: function section(_ref2) {
    var heading = _ref2.heading,
        inputs = _ref2.inputs,
        key = _ref2.key;
    return _react2.default.createElement(
      'section',
      { key: key },
      _react2.default.createElement(
        'h3',
        null,
        heading
      ),
      _react2.default.createElement(
        'ul',
        null,
        inputs.map(function (input) {
          return _render.item(_extends({}, input));
        })
      )
    );
  }
};

var Racer = function (_BaseComponent) {
  _inherits(Racer, _BaseComponent);

  function Racer(props) {
    _classCallCheck(this, Racer);

    var _this = _possibleConstructorReturn(this, (Racer.__proto__ || Object.getPrototypeOf(Racer)).call(this, props));

    _this.state = { readOnly: true };
    _this.dispatch = _this.props.dispatch;
    _this._bind('handleCreate', 'handleInput', 'handleEditToggle', 'handleSelect', 'handleSubmit');
    return _this;
  }

  _createClass(Racer, [{
    key: 'handleCreate',
    value: function handleCreate() {
      this.dispatch(_racer.actionCreators.create());
      this.setState({ readOnly: false });
    }
  }, {
    key: 'handleInput',
    value: function handleInput(field) {
      var _this2 = this;

      return function (e) {
        var value = field === 'isActive' ? e.target.value === 'true' ? false : true : e.currentTarget.value;
        _this2.dispatch(_racer.actionCreators.input(field, value));
      };
    }
  }, {
    key: 'handleEditToggle',
    value: function handleEditToggle() {
      this.setState({ readOnly: !this.state.readOnly });
      if (!this.state.readOnly) {
        this.dispatch(_racer.actionCreators.cancelEdit());
      }
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(index) {
      var _this3 = this;

      return function (e) {
        _this3.dispatch(_racer.actionCreators.selectRacer(index));
        _this3.setState({ readOnly: true });
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      this.dispatch(_racer.actionCreators.submit());
      this.setState({ readOnly: true });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.racer.racers) {
        this.dispatch(_racer.actionCreators.getRacers());
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var store = this.props.racer;
      var editBd = store.racers && store.selectedIndex > -1 && store.racers[store.selectedIndex] ? [_render.section({ heading: '身份', inputs: returnBasicInputs(store, this.handleInput), key: 'sec-0' }), _render.section({ heading: '更改密碼', inputs: returnPasswordInputs(store, this.handleInput), key: 'sec-1' }), _render.section({ heading: '聯絡地址', inputs: returnAddressInputs(store, this.handleInput), key: 'sec-2' }), _render.section({ heading: '所屬車隊', inputs: returnTeamInputs(store.racers[store.selectedIndex]), key: 'sec-3' })] : [];

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, { location: this.props.location, nav: 'base' }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _react2.default.createElement(_Table2.default, { list: store.racers, selectedIndex: store.selectedIndex, editBody: editBd, inEdit: this.props.racer.inEdit ? true : false, readOnly: this.state.readOnly, handleSubmit: this.handleSubmit, handleEditToggle: this.handleEditToggle, listNameFunc: listNameFunc, handleSelect: this.handleSelect, handleCreate: this.handleCreate })
        )
      );
    }
  }]);

  return Racer;
}(_BaseComponent3.default);

exports.default = Racer;