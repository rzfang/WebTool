import cch from 'rzjs/node/cache.mjs';
import feedparser from 'feedparser';
import is from 'rzjs/is.mjs';
import { Readable } from 'node:stream';

/*
  @ request info object.
  @ callback function. */
export default function Feed (Rqst, Rspns, RqstInfo, Clbck) {
  if (!RqstInfo.Bd || !RqstInfo.Bd || !RqstInfo.Bd.URL || !is.String(RqstInfo.Bd.URL)) {
    return Clbck(-1, null);
  }

  let FdInfo = cch.get(RqstInfo.Bd.URL); // feed info object.

  if (FdInfo) { return Clbck(1, FdInfo); }

  const FdPrsr = new feedparser(); // feed parser.

  let IsEnd = false; // is end flag.

  fetch(encodeURI(RqstInfo.Bd.URL)).then(
    response => {
      if (response.status !== 200) {
        throw new Error('Bad status code');
      }
      else {
        Readable.fromWeb(response.body).pipe(FdPrsr);
      }
    },
    error => {
      if (IsEnd) { return; }

      Clbck(-2, null);

      IsEnd = true;
    });

  FdInfo = { FdURL: RqstInfo.Bd.URL, Itms: [] }; // default, feed url, items.

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
      cch.set(RqstInfo.Bd.URL, FdInfo, 1800);
    });
}
