const Cch = require('../RZ-Nd-Cache');

module.exports = function (Rqst, URLInfo, Clbck) {
  let Rst = [];

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

  Rst = Cch.Get(TrnsfrKy).split('_|_').map(Url => { return { FdUrl: Url, HsBnLdd: false }; });

  Rqst.RM.StoreSet('FEEDS', () => Rst);
  Clbck(0, Rst);
};
