'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BaseComponent2 = require('../BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

var _event = require('../../ducks/event');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var validate = {
  ruleCompleted: function ruleCompleted(rule) {
    return rule.rankFrom !== undefined && rule.rankTo !== undefined && rule.toRace !== undefined ? true : false;
  },
  continuity: function continuity(rules) {
    var hasError = void 0;
    if (rules.length > 1) {
      rules.forEach(function (rule, i) {
        if (rules[i + 1] && rules[i + 1].rankFrom - rule.rankTo !== 1) {
          hasError = true;
        }
      });
    }
    return hasError ? '晉級規則的名次必須連續' : undefined;
  },
  incrementalRange: function incrementalRange(rule) {
    return rule.rankTo >= rule.rankFrom ? undefined : '名次必須從小到大做設定';
  },
  startFromZero: function startFromZero(rules) {
    return rules[0].rankFrom === 0 ? undefined : '需從第一名開始設定晉級規則';
  },
  noOverflow: function noOverflow(raceId, modifiedRules, toRace, races) {
    var advRules = races.map(function (race) {
      return race.id === raceId ? modifiedRules : race.advancingRules;
    }).reduce(function (sum, v) {
      return sum.concat(v);
    });
    var sum = advRules.reduce(function (sum, V) {
      return sum + (V.rankTo - V.rankFrom + 1);
    }, 0);
    var toRaceObj = races.filter(function (V) {
      return V.id === toRace;
    })[0];
    var toRaceName = toRaceObj.nameCht ? toRaceObj.nameCht : toRaceObj.name;
    return toRaceObj.racerNumberAllowed !== sum ? '\u6649\u7D1A\u81F3\u300C' + toRaceName + '\u300D\u7684\u4EBA\u6578\u52A0\u7E3D\uFF08' + sum + '\uFF09\u4E0D\u7B26\u5408\u8A2D\u5B9A\u7684\u4EBA\u6578\uFF08' + toRaceObj.racerNumberAllowed + '\uFF09' : undefined;
  }
};
var returnRankArray = function returnRankArray(racerNumberAllowed) {
  var options = [];
  for (var i = 0; i < racerNumberAllowed; i += 1) {
    options.push({ value: i, label: i + 1 });
  }
  return options;
};
var _render = {
  ruleItem: function ruleItem(_ref) {
    var races = _ref.races,
        raceObj = _ref.raceObj,
        rules = _ref.rules,
        onEdit = _ref.onEdit,
        onRemove = _ref.onRemove,
        disabled = _ref.disabled,
        options = _ref.options;
    return rules.map(function (V, index) {
      return _react2.default.createElement(
        'tr',
        { key: 'adv' + index },
        _react2.default.createElement(
          'td',
          null,
          '\u5F9E ',
          _react2.default.createElement(
            'select',
            { value: V.rankFrom, disabled: disabled, onChange: onEdit({ index: index, field: 'rankFrom' }) },
            _react2.default.createElement(
              'option',
              { key: 'opt0' },
              '\u540D\u6B21...'
            ),
            options.map(function (V) {
              return _react2.default.createElement(
                'option',
                { key: 'opt' + V.label, value: V.value },
                V.label
              );
            })
          ),
          '\u5230 ',
          _react2.default.createElement(
            'select',
            { disabled: disabled, value: V.rankTo, onChange: onEdit({ index: index, field: 'rankTo' }) },
            _react2.default.createElement(
              'option',
              { key: 'opt0' },
              '\u540D\u6B21...'
            ),
            options.map(function (V) {
              return _react2.default.createElement(
                'option',
                { key: 'opt' + V.label, value: V.value },
                V.label
              );
            })
          )
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement(
            'select',
            { disabled: disabled, onChange: onEdit({ index: index, field: 'toRace' }), value: V.toRace },
            _react2.default.createElement(
              'option',
              { key: 'toRace0' },
              '\u8CFD\u4E8B...'
            ),
            races.map(function (V) {
              if (V.id !== raceObj.id && !V.isEntryRace) {
                return _react2.default.createElement(
                  'option',
                  { key: 'toRace' + V.id, value: V.id },
                  V.nameCht
                );
              }
            })
          ),
          !disabled && _react2.default.createElement(
            'span',
            { className: _style2.default.right },
            _react2.default.createElement(_Button2.default, { onClick: onRemove({ index: index }), style: 'del', text: 'x' })
          )
        )
      );
    });
  }
};

var AdvRule = function (_BaseComponent) {
  _inherits(AdvRule, _BaseComponent);

  function AdvRule(props) {
    _classCallCheck(this, AdvRule);

    var _this = _possibleConstructorReturn(this, (AdvRule.__proto__ || Object.getPrototypeOf(AdvRule)).call(this, props));

    _this.state = {
      warning: undefined,
      raceId: undefined,
      modified: undefined,
      canSubmit: true
    };
    _this.dispatch = _this.props.dispatch;
    _this._bind('handleAdd', 'handleRemove', 'handleSubmit', 'handleToggle', 'handleEdit');
    return _this;
  }

  _createClass(AdvRule, [{
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this2 = this;

      if (this.state.canSubmit) {
        var successCallback = function successCallback() {
          return _this2.setState({ raceId: undefined, modified: undefined });
        };
        this.dispatch(_event.actionCreators.submitAdvancingRules(this.state, successCallback));
      }
    }
  }, {
    key: 'handleToggle',
    value: function handleToggle(raceObj, index) {
      var _this3 = this;

      return function (e) {
        if (_this3.state.raceId === raceObj.id) {
          return _this3.setState({ raceId: undefined, raceSelected: -1, modified: undefined, warning: undefined });
        }
        _this3.setState({ raceId: raceObj.id, raceSelected: index, modified: [].concat(_toConsumableArray(raceObj.advancingRules)) });
      };
    }
  }, {
    key: 'handleAdd',
    value: function handleAdd() {
      var _this4 = this;

      return function (e) {
        _this4.setState({ modified: [].concat(_toConsumableArray(_this4.state.modified), [{}]) });
      };
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(_ref2) {
      var _this5 = this;

      var index = _ref2.index;
      return function (e) {
        var stateObj = { modified: _this5.state.modified, warning: undefined, canSubmit: true };

        stateObj.modified.splice(index, 1);
        if (stateObj.modified.length > 0) {
          stateObj.warning = validate.startFromZero(stateObj.modified);
          if (stateObj.warning) {
            stateObj.canSubmit = false;
            return _this5.setState(stateObj);
          }
          stateObj.warning = validate.continuity(stateObj.modified);
          if (stateObj.warning) {
            stateObj.canSubmit = false;
          }
          _this5.setState(stateObj);
        }
      };
    }
  }, {
    key: 'handleEdit',
    value: function handleEdit(_ref3) {
      var _this6 = this;

      var index = _ref3.index,
          field = _ref3.field;
      return function (e) {
        var stateObj = { modified: _this6.state.modified, warning: undefined, canSubmit: true };

        stateObj.modified[index][field] = parseInt(e.target.value);
        if (validate.ruleCompleted(stateObj.modified[index])) {
          stateObj.warning = validate.startFromZero(stateObj.modified);
          if (stateObj.warning) {
            return _this6.setState(stateObj);
          }
          stateObj.warning = validate.incrementalRange(stateObj.modified[index]);
          if (stateObj.warning) {
            stateObj.canSubmit = false;
            return _this6.setState(stateObj);
          }
          stateObj.warning = validate.continuity(stateObj.modified);
          if (stateObj.warning) {
            return _this6.setState(stateObj);
          }
          stateObj.warning = validate.noOverflow(_this6.state.raceId, stateObj.modified, stateObj.modified[index].toRace, _this6.props.races);
        } else {
          stateObj.canSubmit = false;
        }
        _this6.setState(stateObj);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var races = this.props.races;
      var _state = this.state,
          canSubmit = _state.canSubmit,
          warning = _state.warning,
          raceId = _state.raceId,
          modified = _state.modified;


      return _react2.default.createElement(
        'div',
        { className: _style2.default.advTable },
        _react2.default.createElement(
          'h3',
          null,
          '\u6649\u7D1A\u898F\u5247'
        ),
        _react2.default.createElement(
          'h4',
          { className: canSubmit ? _style2.default.warning : _style2.default.forbidden },
          warning
        ),
        races.map(function (V, I) {
          var options = returnRankArray(V.racerNumberAllowed);
          return _react2.default.createElement(
            'div',
            { key: 'race' + I },
            _react2.default.createElement(
              'label',
              null,
              V.nameCht
            ),
            !V.isFinalRace && _react2.default.createElement(
              'div',
              { className: _style2.default.tableInput },
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
                      '\u8CC7\u683C'
                    ),
                    _react2.default.createElement(
                      'th',
                      null,
                      '\u6649\u7D1A\u5230'
                    )
                  )
                ),
                _react2.default.createElement(
                  'tbody',
                  null,
                  _render.ruleItem({ races: races, rules: modified && raceId === V.id ? modified : V.advancingRules, onEdit: _this7.handleEdit, onRemove: _this7.handleRemove, raceObj: V, disabled: raceId === V.id ? false : true, options: options }),
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: _style2.default.ft, colSpan: '4' },
                      raceId === V.id ? _react2.default.createElement(
                        'span',
                        null,
                        _react2.default.createElement(_Button2.default, { style: 'listFtIcon', text: '+', onClick: _this7.handleAdd() }),
                        _react2.default.createElement(
                          'span',
                          { className: _style2.default.right },
                          _react2.default.createElement(_Button2.default, { onClick: _this7.handleSubmit, text: '\u5132\u5B58' }),
                          _react2.default.createElement(_Button2.default, { text: '\u53D6\u6D88', style: 'grey', onClick: _this7.handleToggle(V, I) })
                        )
                      ) : !raceId && _react2.default.createElement(
                        'span',
                        { className: _style2.default.right },
                        _react2.default.createElement(_Button2.default, { text: '\u7DE8\u8F2F', onClick: _this7.handleToggle(V, I) })
                      )
                    )
                  )
                )
              )
            )
          );
        }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          _react2.default.createElement(_Button2.default, { style: 'grey', onClick: this.props.handleCancelEdit, text: '\u95DC\u9589' })
        )
      );
    }
  }]);

  return AdvRule;
}(_BaseComponent3.default);

exports.default = AdvRule;