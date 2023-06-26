import Cch from 'rzjs/node/Cache.js';

export default function Payment (Rqst, URLInfo, Clbck) {
  let Rst = { TrnsfrData: '' };

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

  Rst.TrnsfrData = Cch.Get(TrnsfrKy);

  Clbck(0, Rst);
}
