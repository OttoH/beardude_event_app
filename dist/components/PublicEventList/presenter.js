'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _event = require('../../ducks/event');

var _style = require('./style.css');

var _style2 = _interopRequireDefault(_style);

var _Header = require('../Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('../Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Button = require('../Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import BaseComponent from '../BaseComponent'


var EventBrick = function EventBrick(_ref) {
  var _ref$events = _ref.events,
      events = _ref$events === undefined ? [] : _ref$events;
  return events.length > 0 ? events.map(function (raceEvent) {
    return _react2.default.createElement(
      'li',
      { key: 'event-' + raceEvent.id },
      _react2.default.createElement(_Button2.default, { style: 'bigIcon', text: raceEvent.nameCht, url: '/event/' + raceEvent.id })
    );
  }) : null;
};

var PublicEventList = function (_React$PureComponent) {
  _inherits(PublicEventList, _React$PureComponent);

  function PublicEventList(props) {
    _classCallCheck(this, PublicEventList);

    var _this = _possibleConstructorReturn(this, (PublicEventList.__proto__ || Object.getPrototypeOf(PublicEventList)).call(this, props));

    _this.dispatch = _this.props.dispatch;
    return _this;
  }

  _createClass(PublicEventList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.dispatch(_event.actionCreators.getEvents());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          event = _props.event,
          location = _props.location;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, { isPublic: '1', location: location }),
        _react2.default.createElement(
          'div',
          { className: _style2.default.mainBody },
          _react2.default.createElement(
            'ul',
            { className: _style2.default.iconView },
            EventBrick(_extends({}, event))
          )
        ),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return PublicEventList;
}(_react2.default.PureComponent);

exports.default = PublicEventList;