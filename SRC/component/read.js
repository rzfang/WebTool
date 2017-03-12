const Cch = require('../cache');

module.exports = function (URLInfo, Clbck) {
  let Rst = { // result.
        LdJs: "<script type='riot/tag' src='/read.tag'></script>\n", // loading javascript tag.
        HTML: '<read><!-- this will be replaced by riot.mount. --></read>',
        Js: "riot.mount('read');\n" };

  if (!URLInfo || !URLInfo.query || URLInfo.query.indexOf('t=') < 0) {
    return Clbck(1, Rst);
  }

  const RERst = URLInfo.query.match(/t=([^&]+)/); // regular expression result.

  if (!RERst || RERst.length < 2) {
    return Clbck(2, Rst);
  }

  const TrnsfrKy = RERst[1]; // transfering key.

  if (!Cch.Has(TrnsfrKy)) {
    return Clbck(3, Rst);
  }

  Rst.Js = "riot.mount('read', { FdURLs: '" + Cch.Get(TrnsfrKy) + "' });";

  Clbck(0, Rst);
};
