import Cch from 'rzjs/node/Cache.js';
import feedparser from 'feedparser';
import Is from 'rzjs/Is.js';
import request from 'request';

/*
  @ request info object.
  @ callback function. */
export default function Feed (Rqst, Rspns, RqstInfo, Clbck) {
  if (!RqstInfo.Bd || !RqstInfo.Bd || !RqstInfo.Bd.URL || !Is.String(RqstInfo.Bd.URL)) {
    return Clbck(-1, null);
  }

  let FdInfo = Cch.Get(RqstInfo.Bd.URL); // feed info object.

  if (FdInfo) { return Clbck(1, FdInfo); }

  const FdPrsr = new feedparser(); // feed parser.
  const SvcRqst = request(encodeURI(RqstInfo.Bd.URL)); // server request.

  let IsEnd = false; // is end flag.

  FdInfo = { FdURL: RqstInfo.Bd.URL, Itms: [] }; // default, feed url, items.

  SvcRqst.on(
    'error',
    () => {
      if (IsEnd) { return; }

      Clbck(-2, null);

      IsEnd = true;
    });

  SvcRqst.on(
    'response',
    function (Rspns) {
      const Strm = this; // stream object.

      if (Rspns.statusCode !== 200) { this.emit('error', new Error('Bad status code')); }
      else { Strm.pipe(FdPrsr); }
    });

  FdPrsr.on(
    'error',
    () => {
      if (IsEnd) { return; }

      Clbck(-3, null);

      IsEnd = true;
    });

  FdPrsr.on(
    'meta',
    ({ title: Ttl = '', description: Dscrptn = '', link: Lnk = '', date: Dt = '', author: Athr = '' }) => {
      FdInfo = Object.assign(FdInfo, { Ttl, Dscrptn, Lnk, Dt, Athr});
    });

  FdPrsr.on(
    'readable',
    function () {
      const Strm = this;

      let Itm = Strm.read(); // stream object.

      while (Itm) {
        const {
          title: Ttl = '',
          date: Dt = '',
          link: Lnk = '',
        } = Itm;

        FdInfo.Itms.push({ Ttl, Dt, Lnk });

        Itm = Strm.read();
      }
    });

  FdPrsr.on(
    'end',
    () => {
      if (IsEnd) { return; }

      FdInfo.Itms = FdInfo.Itms.slice(0, 5);

      Clbck(0, FdInfo);
      Cch.Set(RqstInfo.Bd.URL, FdInfo, 1800);
    });
}
