<read>
  <input type='text' placeholder='enter the feed url.' ref='url'/>
  <input type='button' value='add new feed' onclick={OneFeedAdd}/>
  <div>
    <feed each={Fds} delete={parent.OneFeedRemove}/>
  </div>

  <style>
    :scope { display: block; padding-top: 5px; }
  </style>

  <script>
    (() => {
      if (typeof window !== 'undefined') { this.mixin(Z.RM); }

      this.Fds = [];
    })();

    this.on(
      'mount',
      () => {
        if (typeof window === 'undefined') { return; }

        if (!window.localStorage.FdURLs) {
          window.localStorage.FdURLs = '';

          return;
        }

        let FdURLs = window.localStorage.FdURLs.split('_|_');

        for (let i = 0; i < FdURLs.length; i++) {
          if (!FdURLs[i]) { continue; }

          this.OneFeedLoad(FdURLs[i]);
        }
      });

    OneFeedLoad (URL, Err) {
      this.AJAX({
        URL: '/service/feed',
        Mthd: 'POST',
        Data: { URL: URL },
        Err: (Sts) => {
          this.Fds.push({ Lnk: URL, Ttl: 'Load Failed', Dscrptn: `can not load this feed.`, FdURL: URL, Itms: null });
        },
        OK: (RspnsTxt, Sts) => {
          let FdInfo = RspnsTxt && JSON.parse(RspnsTxt) || null;

          if (FdInfo) { this.Fds.push(FdInfo); }

          this.update();

          this.refs.url.value = '';
        }});
    }

    OneFeedAdd () {
      let FdURLs = window.localStorage.FdURLs,
          URL = this.refs.url.value;

      if (!Z.Is.URL(URL)) { return alert('this is not a standard URL.'); }

      if (FdURLs.indexOf(URL) > -1) { return alert('this url has been added before.'); }

      window.localStorage.FdURLs += '_|_' + URL;

      this.OneFeedLoad(URL);
    }

    OneFeedRemove (URL) {
      if (!URL) { return; }

      let FdURLs = window.localStorage.FdURLs;

      for (let i = 0; i < this.Fds.length; i++) {
        if (this.Fds[i].FdURL === URL) {
          window.localStorage.FdURLs = FdURLs.replace(URL, '').replace(/_\|__\|_/g, '_|_').replace(/^_\|_|_\|_$/g, '');

          this.Fds.splice(i, 1);
          this.update();

          break;
        }
      }
    }
  </script>
</read>

<feed>
  <div>
    <a href='{Lnk}' target='_blank'>{Ttl}</a>
    <div>{Dscrptn}</div>
    <button onClick={Delete}>X</button>
  </div>
  <div>
    <a each={Itms} href='{Lnk}' target='_blank'>{Ttl}</a>
  </div>

  <style>
    :scope { display: block; margin: 10px 0; padding: 5px; border: 1px solid; border-radius: 3px; }
    :scope>div:first-child { position: relative; }
    :scope>div:first-child>div { font-size: 14px; color: #808080; }
    :scope>div:first-child>button { position: absolute; right: 0px; top: 0px; }
    :last-child>a { display: block; }
  </style>

  <script>
    Delete (Evt) {
      if (Z.Is.Function(this.opts.delete)) { this.opts.delete(this.FdURL); }
    }
  </script>
</feed>