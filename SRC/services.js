module.exports = {
  'feed': require('./service/feed'),
  'feed/transfer': require('./service/transfer'),
  default: function () { return {}; }
};
