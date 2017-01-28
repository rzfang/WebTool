const feedparser = require('feedparser');
const request = require('request'); // for fetching the feed

module.exports = (URL, Clbck) => {
  let FdInfo = { title: '', description: '', link: '', date: '', author: '', items: []},
      FdPsr = new feedparser(),
      IsEnd = false;

  FdPsr.on(
    'error',
    function (Err) {
      if (IsEnd) { return; }

      IsEnd = true;

      Clbck(-1, 'error happend.');
    });

  FdPsr.on(
    'readable',
    function () {
      FdInfo.title = this.meta.title;
      FdInfo.description = this.meta.description || '';
      FdInfo.link = this.meta.link;
      FdInfo.date = this.meta.date;
      FdInfo.author = this.meta.author;
    });

  FdPsr.on(
    'data',
    function (data) {
      FdInfo.items.push({
        title: data.title,
        date: data.date,
        link: data.link
        // ,
        // imageLink: data.image.url || ''
      });
    });

  FdPsr.on(
    'end',
    () => {
      if (IsEnd) { return; }

      IsEnd = true;

      Clbck(0, FdInfo);
    });

    let Rqst = request(URL);

  Rqst.on('error', function (Err) {
    if (IsEnd) { return; }

    IsEnd = true;

    Clbck(-2, 'error happend.');
  });

  Rqst.on('response', function (Rspns) {
    let Strm = this; // `this` is `Rqst`, which is a stream.

    if (Rspns.statusCode !== 200) {
      if (IsEnd) { return; }

      IsEnd = true;

      Clbck(-3, 'error happend.');
    }
    else {
      Strm.pipe(FdPsr);
    }
  });
};
