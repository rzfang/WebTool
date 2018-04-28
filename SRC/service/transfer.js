const crypto = require('crypto'),
      Is = require('../RZ-Js-Is'),
      Cch = require('../cache'),
      CdMp = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq0Rr1Ss2Tt3Uu4Vv5Ww6Xx7Yy8Zz9'; // code map string.

/*
  @ seed.
  Return: an key string. */
function KeyGenerate (Sd) {
  let Hsh = crypto.createHash('md5').update(Sd).digest('base64'), // hash string.
      Ky = ''; // key.

  for (let i = 0; i < Hsh.length; i += 4) {
    let Chr = Hsh.charCodeAt(i) + Hsh.charCodeAt(i + 1) + Hsh.charCodeAt(i + 2) + Hsh.charCodeAt(i + 3);

    Chr = parseInt(Chr, 10);
    Ky += CdMp.charAt(Chr % CdMp.length);
  }

  return Ky;
}

/*
  @ request info object. format as { Bdy: { Ctn: '...' }}.
  @ callback function. */
module.exports = function (RqstInfo, Clbck) {
  if (!RqstInfo.Bdy || !RqstInfo.Bdy.Ctn || !Is.String(RqstInfo.Bdy.Ctn)) {
    return Clbck(-1, null);
  }

  let Dt = new Date(),
      Ky = KeyGenerate(RqstInfo.Bdy.Ctn + Dt.getTime().toString());

  while(Cch.Has(Ky)) {
    Ky = KeyGenerate(Ky);
  }

  Cch.Set(Ky, RqstInfo.Bdy.Ctn, 600);

  return Clbck(0, Ky);
};
