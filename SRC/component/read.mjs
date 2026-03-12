import cch from 'rzjs/node/cache.mjs';

export default function Read (Rqst, URLInfo, Clbck) {
  let Rst = [];

  if (!URLInfo || !URLInfo.query || URLInfo.query.indexOf('t=') < 0) {
    return Clbck(1, Rst);
  }

  const RERst = URLInfo.query.match(/t=([^&]+)/); // regular expression result.

  if (!RERst || RERst.length < 2) {
    return Clbck(2, Rst);
  }

  const TrnsfrKy = RERst[1]; // transfering key.

  if (!cch.Has(TrnsfrKy)) {
    return Clbck(3, Rst);
  }

  Rst = cch.Get(TrnsfrKy).split('_|_').map(Url => { return { FdUrl: Url, HsBnLdd: false }; });

  Rqst.RMI.StoreSet('FEEDS', () => Rst);
  Clbck(0, Rst);
}
