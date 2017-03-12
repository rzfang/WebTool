const request = require('request'),
      feedparser = require('feedparser'),
      Is = require('../RZ-Js-Is'),
      Cch = require('../cache');

/*
  @ request info object.
  @ callback function. */
module.exports = function (RqstInfo, Clbck) {
  if (!RqstInfo.Bdy || !RqstInfo.Bdy || !RqstInfo.Bdy.URL || !Is.String(RqstInfo.Bdy.URL)) {
    return Clbck(-1, null);
  }

  let FdInfo = Cch.Get(RqstInfo.Bdy.URL); // feed info object.

  if (FdInfo) { return Clbck(1, FdInfo); }

  let Rqst = request(encodeURI(RqstInfo.Bdy.URL)),
      FdPrsr = new feedparser(), // feed parser.
      IsEnd = false; // is end flag.

  FdInfo = { FdURL: RqstInfo.Bdy.URL, Itms: [] }; // default, feed url, items.

  Rqst.on(
    'error',
    function (Err) {
      if (IsEnd) { return; }

      Clbck(-2, null);

      IsEnd = true;
    });

  Rqst.on(
    'response',
    function (Rspns) {
      let Strm = this; // stream object.

      if (Rspns.statusCode !== 200) { this.emit('error', new Error('Bad status code')); }
      else { Strm.pipe(FdPrsr); }
    });

  FdPrsr.on(
    'error',
    function (Err) {
      if (IsEnd) { return; }

      Clbck(-3, null);

      IsEnd = true;
    });

  FdPrsr.on(
    'meta',
    function ({ title: Ttl = '', description: Dscrptn = '', link: Lnk = '', date: Dt = '', author: Athr = '' }) {
      FdInfo = Object.assign(FdInfo, { Ttl, Dscrptn, Lnk, Dt, Athr});
    });

  FdPrsr.on(
    'readable',
    function () {
      let Strm = this,
          Itm; // stream object.

       while (Itm = Strm.read()) {
        let {
          title: Ttl = '',
          date: Dt = '',
          link: Lnk = '' } = Itm;

        FdInfo.Itms.push({ Ttl, Dt, Lnk });
      }
    });

  FdPrsr.on('end', function () {
    if (IsEnd) { return; }

    FdInfo.Itms = FdInfo.Itms.slice(0, 5);

    Clbck(0, FdInfo);
    Cch.Set(RqstInfo.Bdy.URL, FdInfo, 1800);
  });
};
