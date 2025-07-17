import Cch from 'rzjs/node/Cache.js';
import Is from 'rzjs/Is.js';
import { KeyGenerate } from '../helper.mjs';

export function ConnectionGet (Rqst, URLInfo, Clbck) {
  if (!Is.String(URLInfo.query) ||  URLInfo.query.indexOf('c=') < 0) {
    return Clbck(1, null);
  }

  const Ky = URLInfo.query.replace('c=', ''); // connection key
  console.log('--- 102 ---');
  console.log(Ky);

  if (!Cch.Has(Ky)) {
    return Clbck(2, null);
  }

  const Ofr = Cch.Get(Ky);

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

  while(Cch.Has(Ky)) {
    Ky = KeyGenerate(Ky);
  }

  Cch.Set(Ky, Ofr, 600);

  console.log('--- 101 ---');
  console.log(Cch.Get(Ky));

  return Clbck(0, Ky);
}
