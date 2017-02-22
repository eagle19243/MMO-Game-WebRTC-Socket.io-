'use strict';

exports.__esModule = true;

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _async = require('./async');

var async = _interopRequireWildcard(_async);

var _b = require('./b64');

var b64 = _interopRequireWildcard(_b);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Loader2.default.Resource = _Resource2.default;
_Loader2.default.async = async;
_Loader2.default.base64 = b64;

// export manually, and also as default
module.exports = _Loader2.default; // eslint-disable-line no-undef
exports.default = _Loader2.default;
//# sourceMappingURL=index.js.map