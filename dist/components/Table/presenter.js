'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderList = function renderList(_ref) {
  var selectedIndex = _ref.selectedIndex,
      index = _ref.index,
      handleSelect = _ref.handleSelect,
      name = _ref.name;
  return _react2.default.createElement(
    'li',
    { className: selectedIndex === index ? _style2.default.selected : _style2.default.li, key: 'list-' + index },
    _react2.default.createElement(_Button2.default, { onClick: handleSelect(index), style: 'list', text: name })
  );
};
var renderFt = function renderFt(_ref2) {
  var inEdit = _ref2.inEdit,
      handleSubmit = _ref2.handleSubmit,
      handleEditToggle = _ref2.handleEditToggle;
  return _react2.default.createElement(
    'span',
    null,
    inEdit ? _react2.default.createElement(_Button2.default, { style: 'listFt', onClick: handleSubmit, text: '\u5132\u5B58' }) : _react2.default.createElement(_Button2.default, { style: 'listFtDisabled', text: '\u5132\u5B58' }),
    _react2.default.createElement(_Button2.default, { style: 'listFtRight', onClick: handleEditToggle, text: '\u53D6\u6D88' })
  );
};
var renderFtReadOnly = function renderFtReadOnly(_ref3) {
  var handleEditToggle = _ref3.handleEditToggle;
  return _react2.default.createElement(_Button2.default, { style: 'listFt', onClick: handleEditToggle, text: '\u7DE8\u8F2F' });
};

var Table = function Table(_ref4) {
  var list = _ref4.list,
      selectedIndex = _ref4.selectedIndex,
      editBody = _ref4.editBody,
      inEdit = _ref4.inEdit,
      listNameFunc = _ref4.listNameFunc,
      readOnly = _ref4.readOnly,
      handleSelect = _ref4.handleSelect,
      handleCreate = _ref4.handleCreate,
      handleEditToggle = _ref4.handleEditToggle,
      handleSubmit = _ref4.handleSubmit;
  return _react2.default.createElement(
    'div',
    { className: _style2.default.body },
    _react2.default.createElement(
      'div',
      { className: _style2.default.list },
      list && list.length > 0 && _react2.default.createElement(
        'div',
        { className: _style2.default.table },
        _react2.default.createElement(
          'div',
          { className: _style2.default.tableBd },
          _react2.default.createElement(
            'div',
            { className: _style2.default.content },
            _react2.default.createElement(
              'ul',
              null,
              list.map(function (listItem, index) {
                return renderList({ selectedIndex: selectedIndex, index: index, handleSelect: handleSelect, name: listNameFunc(listItem) });
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.tableFt },
          _react2.default.createElement(_Button2.default, { style: 'listFtIcon', text: '+', onClick: handleCreate })
        )
      )
    ),
    selectedIndex !== -1 && _react2.default.createElement(
      'div',
      { className: _style2.default.edit },
      _react2.default.createElement(
        'div',
        { className: _style2.default.table },
        _react2.default.createElement(
          'div',
          { className: _style2.default.tableBd },
          _react2.default.createElement(
            'div',
            { className: readOnly ? _style2.default.readOnly : _style2.default.content },
            editBody
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.tableFt },
          readOnly ? renderFtReadOnly({ handleEditToggle: handleEditToggle }) : renderFt({ inEdit: inEdit, handleSubmit: handleSubmit, handleEditToggle: handleEditToggle })
        )
      )
    )
  );
};

exports.default = Table;
var renderInput = exports.renderInput = {
  checkbox: function checkbox(_ref5) {
    var disabled = _ref5.disabled,
        onChange = _ref5.onChange,
        value = _ref5.value;
    return _react2.default.createElement('input', { type: 'checkbox', onChange: onChange, checked: value, value: value, disabled: disabled });
  },
  datetime: function datetime(_ref6) {
    var disabled = _ref6.disabled,
        onChange = _ref6.onChange,
        value = _ref6.value;
    return _react2.default.createElement('input', { type: 'datetime-local', onChange: onChange, value: value, disabled: disabled });
  },
  password: function password(_ref7) {
    var disabled = _ref7.disabled,
        onChange = _ref7.onChange,
        value = _ref7.value;
    return _react2.default.createElement('input', { type: 'password', onChange: onChange, value: value, disabled: disabled });
  },
  text: function text(_ref8) {
    var disabled = _ref8.disabled,
        onChange = _ref8.onChange,
        value = _ref8.value;
    return _react2.default.createElement('input', { type: 'text', onChange: onChange, value: value, disabled: disabled });
  },
  number: function number(_ref9) {
    var disabled = _ref9.disabled,
        onChange = _ref9.onChange,
        value = _ref9.value;
    return _react2.default.createElement('input', { type: 'number', onChange: onChange, value: value, disabled: disabled });
  },
  textarea: function textarea(_ref10) {
    var disabled = _ref10.disabled,
        onChange = _ref10.onChange,
        value = _ref10.value;
    return _react2.default.createElement('textarea', { onChange: onChange, value: value, disabled: disabled });
  }
};