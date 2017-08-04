'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _connectHistoryApiFallback = require('connect-history-api-fallback');

var _connectHistoryApiFallback2 = _interopRequireDefault(_connectHistoryApiFallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.SERVER_PORT || '3030';

app.use(_express2.default.static(_path2.default.resolve(__dirname, '../dist/')));
app.use((0, _connectHistoryApiFallback2.default)());
app.use(_express2.default.static(_path2.default.resolve(__dirname, '../dist/')));

app.get('/api/**/**', (0, _expressHttpProxy2.default)('http://localhost:1337'));

app.get('/', function (req, res) {
  console.log(req);
  res.render(_path2.default.join(__dirname, '../dist/index.html'));
});

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info('Listening at http://localhost:' + port);
  }
});