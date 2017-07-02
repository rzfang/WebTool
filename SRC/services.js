let transfer = require('./service/transfer');

module.exports = {
  'feed': require('./service/feed'),
  'feed/transfer': transfer,
  'transfer': transfer,
  default: function () { return {}; }
};
