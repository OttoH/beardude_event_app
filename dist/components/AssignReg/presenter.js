'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var returnInitStateObj = function returnInitStateObj(group) {
  var races = {};
  var stateObj = { entrysRegs: [], rematchsRegs: [], finalRegs: [], unassignedRegs: [] };

  group.races.map(function (V) {
    races[V.id] = { regs: [], name: V.name, nameCht: V.nameCht, isEntryRace: V.isEntryRace, isFinalRace: V.isFinalRace, racerNumberAllowed: V.racerNumberAllowed };
  });
  group.registrations.map(function (reg) {
    var regObj = { id: reg.id, name: reg.name, raceNumber: reg.raceNumber };
    if (reg.races.length === 0) {
      stateObj.unassignedRegs.push(regObj);
    } else {
      reg.races.map(function (race) {
        races[race.id].regs.push(regObj);
      });
    }
  });
  for (var id in races) {
    var raceObj = { id: id, name: races[id].name, nameCht: races[id].nameCht, regs: races[id].regs, racerNumberAllowed: races[id].racerNumberAllowed };
    if (races[id].isEntryRace) {
      stateObj.entrysRegs.push(raceObj);
    } else if (races[id].isFinalRace) {
      stateObj.finalRegs.push(raceObj);
    } else {
      stateObj.rematchsRegs.push(raceObj);
    }
  }
  return stateObj;
};

var AssignReg = function (_BaseComponent) {
  _inherits(AssignReg, _BaseComponent);

  function AssignReg(props) {
    _classCallCheck(this, AssignReg);

    var _this = _possibleConstructorReturn(this, (AssignReg.__proto__ || Object.getPrototypeOf(AssignReg)).call(this, props));

    var stateObj = returnInitStateObj(props.group);
    _this.state = {
      entrysRegs: stateObj.entrysRegs,
      rematchsRegs: stateObj.rematchsRegs,
      finalRegs: stateObj.finalRegs,
      unassignedRegs: stateObj.unassignedRegs,
      autoAssign: false,
      modified: false,
      original: {
        entrysRegs: [].concat(_toConsumableArray(stateObj.entrysRegs)),
        unassignedRegs: [].concat(_toConsumableArray(stateObj.unassignedRegs))
      }
      //{id: ID, regs: []}
    };_this.dispatch = _this.props.dispatch;
    _this._bind('handleAutoAssign', 'handleRestore', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleSubmit');
    return _this;
  }

  _createClass(AssignReg, [{
    key: 'handleAutoAssign',
    value: function handleAutoAssign() {
      var shuffleArray = function shuffleArray(arr) {
        return arr.sort(function () {
          return Math.random() - 0.5;
        });
      };
      var stateObj = { autoAssign: true, entrysRegs: [].concat(_toConsumableArray(this.state.entrysRegs)), unassignedRegs: [].concat(_toConsumableArray(this.state.unassignedRegs)), modified: true };
      var slots = Math.floor(this.props.group.registrations.length / stateObj.entrysRegs.length);

      stateObj.entrysRegs.map(function (race, i) {
        var availableSlots = slots - race.regs.length;
        var newRegs = stateObj.unassignedRegs.splice(0, availableSlots);
        newRegs = newRegs.map(function (reg) {
          return _extends({}, reg, { toAdd: true });
        });
        stateObj.entrysRegs[i].regs = stateObj.entrysRegs[i].regs.concat(newRegs);
      });
      if (stateObj.unassignedRegs.length > 0) {
        stateObj.unassignedRegs.map(function (reg, index) {
          stateObj.entrysRegs[index].regs.push(_extends({}, reg, { toAdd: true }));
        });
        stateObj.unassignedRegs = [];
      }
      this.setState(stateObj);
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this2 = this;

      var onSuccess = function onSuccess(group) {
        var stateObj = returnInitStateObj(group);
        _this2.setState(_extends({}, stateObj, {
          autoAssign: false,
          modified: false,
          original: {
            entrysRegs: stateObj.entrysRegs,
            unassignedRegs: stateObj.unassignedRegs
          }
        }));
      };
      var submitObject = [];
      this.state.entrysRegs.map(function (race) {
        var obj = { id: race.id, toAdd: [], toRemove: [] };
        var toSubmit = void 0;

        race.regs.map(function (reg) {
          if (reg.toAdd) {
            obj.toAdd.push(reg.id);
            toSubmit = true;
          } else if (reg.toRemove) {
            obj.toRemove.push(reg.id);
            toSubmit = true;
          }
        });
        if (toSubmit) {
          submitObject.push(obj);
        }
      });
      if (submitObject.length > 0) {
        this.dispatch(_event.actionCreators.submitRegsToRaces(this.props.group.id, this.props.groupIndex, submitObject, onSuccess));
      } else {
        this.setState({ modified: false });
      }
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart(fromState, index, fromIndex) {
      var _this3 = this;

      return function (e) {
        _this3.dragFrom = fromState;
        _this3.dragItemIndex = index;
        _this3.dragFromIndex = fromIndex;
      };
    }
  }, {
    key: 'handleDragOver',
    value: function handleDragOver(overIndex) {
      var _this4 = this;

      return function (e) {
        e.preventDefault();
        _this4.dragOverIndex = overIndex;
      };
    }
  }, {
    key: 'handleDragEnd',
    value: function handleDragEnd(e) {
      var _this5 = this;

      var stateObj = {
        unassignedRegs: this.state.unassignedRegs,
        entrysRegs: this.state.entrysRegs,
        modified: false
      };
      var reg = void 0;
      switch (this.dragFrom) {
        case 'unassignedRegs':
          reg = stateObj.unassignedRegs.splice(this.dragItemIndex, 1)[0];
          reg.toAdd = true;
          stateObj.entrysRegs[this.dragOverIndex].regs.push(reg);
          stateObj.modified = true;
          return this.setState(stateObj);
        case 'entrysRegs':
          if (this.dragFromIndex !== this.dragOverIndex) {
            stateObj.modified = true;
            // moving unsaved item again
            if (stateObj.entrysRegs[this.dragFromIndex].regs[this.dragItemIndex].toAdd) {
              var existsInTarget = false;
              reg = stateObj.entrysRegs[this.dragFromIndex].regs.splice([this.dragItemIndex], 1)[0];
              if (this.dragOverIndex !== -1) {
                stateObj.entrysRegs[this.dragOverIndex].regs.forEach(function (regNew, i) {
                  if (regNew.id === reg.id) {
                    stateObj.entrysRegs[_this5.dragOverIndex].regs[i].toRemove = false;
                    stateObj.entrysRegs[_this5.dragOverIndex].regs[i].toAdd = false;
                    existsInTarget = true;
                  }
                });
              }
              if (!existsInTarget) {
                reg.toAdd = true;
                if (this.dragOverIndex === -1) {
                  stateObj.unassignedRegs.push(reg);
                } else {
                  stateObj.entrysRegs[this.dragOverIndex].regs.push(reg);
                }
              }
            } else {
              var _existsInTarget = false;
              reg = _extends({}, stateObj.entrysRegs[this.dragFromIndex].regs[this.dragItemIndex]);
              stateObj.entrysRegs[this.dragFromIndex].regs[this.dragItemIndex].toRemove = true;
              reg.toAdd = true;
              if (this.dragOverIndex === -1) {
                stateObj.unassignedRegs.push(reg);
              } else {
                stateObj.entrysRegs[this.dragOverIndex].regs.push(reg);
              }
            }
            return this.setState(stateObj);
          }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var _state = this.state,
          autoAssign = _state.autoAssign,
          modified = _state.modified,
          unassignedRegs = _state.unassignedRegs,
          entrysRegs = _state.entrysRegs,
          rematchsRegs = _state.rematchsRegs,
          finalRegs = _state.finalRegs;


      var renderMoveBit = function renderMoveBit(_ref) {
        var stateName = _ref.stateName,
            reg = _ref.reg,
            regIndex = _ref.regIndex,
            raceIndex = _ref.raceIndex;
        return _react2.default.createElement(
          'li',
          { className: reg.toAdd || reg.toRemove ? _style2.default.modifiedMoveBit : _style2.default.moveBit, draggable: 'true', key: 'move' + reg.id, onDragStart: _this6.handleDragStart(stateName, regIndex, raceIndex), onDragEnd: _this6.handleDragEnd },
          reg.raceNumber,
          ' ',
          reg.nameCht ? reg.nameCht : reg.name
        );
      };

      return _react2.default.createElement(
        'div',
        { className: _style2.default.assignReg },
        _react2.default.createElement(
          'h3',
          null,
          '\u9078\u624B\u5206\u7D44'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: _style2.default.unassign, onDragOver: this.handleDragOver(-1) },
            unassignedRegs.length > 0 && _react2.default.createElement(
              'div',
              { className: _style2.default.auto },
              _react2.default.createElement(_Button2.default, { style: 'shortGrey', text: '\u81EA\u52D5\u5206\u914D\u9078\u624B', onClick: this.handleAutoAssign })
            ),
            _react2.default.createElement(
              'h5',
              { className: _style2.default.inlineB },
              '\u5C1A\u672A\u5206\u7D44'
            ),
            _react2.default.createElement(
              'ul',
              null,
              unassignedRegs.map(function (reg, regIndex) {
                return renderMoveBit({ stateName: 'unassignedRegs', reg: reg, regIndex: regIndex });
              })
            )
          ),
          _react2.default.createElement(
            'label',
            { className: _style2.default.inlineB },
            '\u521D\u8CFD'
          ),
          _react2.default.createElement(
            'ul',
            { className: _style2.default.races },
            entrysRegs.map(function (race, raceIndex) {
              return _react2.default.createElement(
                'li',
                { key: 'race' + race.id, onDragOver: _this6.handleDragOver(raceIndex) },
                _react2.default.createElement(
                  'h5',
                  null,
                  race.nameCht ? race.nameCht : race.name,
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: _style2.default.count },
                    race.regs.filter(function (reg) {
                      return !reg.toRemove;
                    }).length,
                    ' / ',
                    race.racerNumberAllowed
                  )
                ),
                _react2.default.createElement(
                  'ul',
                  null,
                  race.regs.map(function (reg, regIndex) {
                    return !reg.toRemove && renderMoveBit({ stateName: 'entrysRegs', reg: reg, regIndex: regIndex, raceIndex: raceIndex });
                  })
                )
              );
            })
          )
        ),
        rematchsRegs.length > 0 && _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            null,
            '\u8907\u8CFD'
          ),
          _react2.default.createElement(
            'ul',
            { className: _style2.default.races },
            rematchsRegs.map(function (race) {
              return _react2.default.createElement(
                'li',
                { key: 'race' + race.id },
                _react2.default.createElement(
                  'h5',
                  null,
                  race.nameCht,
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: _style2.default.count },
                    race.regs.length,
                    ' / ',
                    race.racerNumberAllowed
                  )
                ),
                _react2.default.createElement(
                  'ul',
                  null,
                  race.regs.map(function (reg) {
                    return _react2.default.createElement(
                      'li',
                      { key: 'reg' + reg.id, className: _style2.default.moveBit },
                      reg.nameCht ? reg.nameCht : reg.name
                    );
                  })
                )
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            null,
            '\u6C7A\u8CFD'
          ),
          _react2.default.createElement(
            'ul',
            { className: _style2.default.races },
            finalRegs.map(function (race) {
              return _react2.default.createElement(
                'li',
                { key: 'race' + race.id },
                _react2.default.createElement(
                  'h5',
                  null,
                  race.nameCht,
                  ' ',
                  _react2.default.createElement(
                    'span',
                    { className: _style2.default.count },
                    race.regs.length,
                    ' / ',
                    race.racerNumberAllowed
                  )
                ),
                _react2.default.createElement(
                  'ul',
                  null,
                  race.regs.map(function (reg) {
                    return _react2.default.createElement(
                      'li',
                      { key: 'reg' + reg.id, className: _style2.default.moveBit },
                      reg.nameCht ? reg.nameCht : reg.name
                    );
                  })
                )
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.boxFt },
          modified ? _react2.default.createElement(_Button2.default, { onClick: this.handleSubmit, text: '\u5132\u5B58' }) : _react2.default.createElement(_Button2.default, { style: 'disabled', text: '\u5132\u5B58' }),
          _react2.default.createElement(_Button2.default, { style: 'grey', onClick: this.props.handleCancelEdit, text: '\u95DC\u9589' })
        )
      );
    }
  }]);

  return AssignReg;
}(_BaseComponent3.default);

exports.default = AssignReg;