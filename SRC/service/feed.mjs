import cch from 'rzjs/node/cache.mjs';
import feedparser from 'feedparser';
import is from 'rzjs/is.mjs';
import { Readable } from 'node:stream';

export default function feed (request, response, requestInfo, callback) {
  if (!requestInfo.Bd || !requestInfo.Bd || !requestInfo.Bd.URL || !is.String(requestInfo.Bd.URL)) {
    return callback(-1, null);
  }

  let feedInfo = cch.get(requestInfo.Bd.URL);

  if (feedInfo) { return callback(1, feedInfo); }

  const fpi = new feedparser(); // feed parser instance.

  let isEnd = false; // is end flag.

  fetch(encodeURI(requestInfo.Bd.URL)).then(
    response => {
      if (response.status !== 200) {
        throw new Error('Bad status code');
      }
      else {
        Readable.fromWeb(response.body).pipe(fpi); // covert from Web API steam to Node stream.
      }
    },
    _error => {
      if (isEnd) { return; }

      callback(-2, null);

      isEnd = true;
    });

  feedInfo = {
    feedUrl: requestInfo.Bd.URL,
    items: [],
  }; // default, feed url, items.

  fpi.on(
    'error',
    () => {
      if (isEnd) { return; }

      callback(-3, null);

      isEnd = true;
    });

  fpi.on(
    'meta',
    ({ title = '', description = '', link = '', date = '', author = '' }) => {
      feedInfo = Object.assign(feedInfo, { author, description, date, link, title });
    });

  fpi.on(
    'readable',
    function () {
      const stream = this;

      let item = stream.read(); // stream object.

      while (item) {
        const { date = '', link = '', title = '' } = item;

        feedInfo.items.push({ date, link, title });

        item = stream.read();
      }
    });

  fpi.on(
    'end',
    () => {
      if (isEnd) { return; }

      feedInfo.items = feedInfo.items.slice(0, 5);

      callback(0, feedInfo);
      cch.set(requestInfo.Bd.URL, feedInfo, 1800);
    });
}
