import Cch from 'rzjs/node/Cache.js';
import crypto from 'crypto';
import Is from 'rzjs/Is.js';

const CdMp = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq0Rr1Ss2Tt3Uu4Vv5Ww6Xx7Yy8Zz9'; // code map string.

/*
  @ seed.
  Return: an key string. */
function KeyGenerate (Sd) {
  const Hsh = crypto.createHash('md5').update(Sd).digest('base64'); // hash string.

  let Ky = ''; // key.

  for (let i = 0; i < Hsh.length; i += 4) {
    let Chr = Hsh.charCodeAt(i) + Hsh.charCodeAt(i + 1) + Hsh.charCodeAt(i + 2) + Hsh.charCodeAt(i + 3);

    Chr = parseInt(Chr, 10);
    Ky += CdMp.charAt(Chr % CdMp.length);
  }

  return Ky;
}

/*
  @ request info object. format as { Bd: { Ctn: '...' }}.
  @ callback function. */
export default function Transfer (Rqst, Rspns, RqstInfo, Clbck) {
  if (!RqstInfo.Bd || !RqstInfo.Bd.Ctn || !Is.String(RqstInfo.Bd.Ctn)) {
    return Clbck(-1, null);
  }

  const Dt = new Date();

  let Ky = KeyGenerate(RqstInfo.Bd.Ctn + Dt.getTime().toString());

  while(Cch.Has(Ky)) {
    Ky = KeyGenerate(Ky);
  }

  Cch.Set(Ky, RqstInfo.Bd.Ctn, 600);

  return Clbck(0, Ky);
}
