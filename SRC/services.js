module.exports = {
  'feed': require('./service/feed'),
  'transfer': require('./service/transfer'),
  default: function () { return {}; }
};
