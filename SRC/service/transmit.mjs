import cch from 'rzjs/node/cache.mjs';
import is from 'rzjs/is.js';

import { KeyGenerate } from '../helper.mjs';

export function ConnectionGet (Rqst, URLInfo, Clbck) {
  if (!is.String(URLInfo.query) ||  URLInfo.query.indexOf('c=') < 0) {
    return Clbck(1, null);
  }

  const Ky = URLInfo.query.replace('c=', ''); // connection key
  console.log('--- 102 ---');
  console.log(Ky);

  if (!cch.Has(Ky)) {
    return Clbck(2, null);
  }

  const Ofr = cch.Get(Ky);

  Rqst.R4FMI.StoreSet('CONNECTION', () => { return { Ky, Ofr }; });
  Clbck(0, { Ky, Ofr });
}

export function ConnectionRegister (Rqst, Rspns, RqstInfo, Clbck) {
  const Ofr = RqstInfo?.Bd || {}; // WebRTC connection offer as the body object.

  if (!Ofr || !Ofr.type || !Ofr.sdp) {
    return Clbck(-1, '');
  }

  const Dt = new Date();
  let Ky = KeyGenerate(Ofr.sdp + Dt.getTime().toString());

  while(cch.Has(Ky)) {
    Ky = KeyGenerate(Ky);
  }

  cch.Set(Ky, Ofr, 600);

  console.log('--- 101 ---');
  console.log(cch.Get(Ky));

  return Clbck(0, Ky);
}
