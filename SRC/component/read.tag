<read>
  <input type='text' placeholder='enter the feed url.' ref='url'/>
  <button onclick={OneFeedAdd}>add a new feed</button>
  <button onclick={Transfer}>Transfer</button>
  <div>
    <feed each={Fds} delete={parent.OneFeedRemove}/>
  </div>
  <cover-box if={IsTrnsfrOt}>
    <p>please finish the transfering in 10 minutes by visit followed link in your device which you want the data transfer to.</p>
    <div>
      {parent.TrnsfrLnk}<br/>
      <button onclick={parent.TransferModeToggle}>OK</button>
    </div>
  </cover-box>
  <cover-box if={HsTrnsfrCnfrm}>
    <p>detected feed urls from remote transfering, what would you do ?</p>
    <div>
      <button onclick={parent.TransferIgnore}>Ignore</button>
      <button onclick={parent.TransferMerge}>Merge</button>
      <button onclick={parent.TransferReplace}>Replace</button>
    </div>
  </cover-box>
  <style scoped>
    :scope { display: block; padding-top: 5px; }
    cover-box>div { position: relative; }
    cover-box p { max-width: 480px; }
    cover-box>div>div { margin: 10px 0; text-align: center; }
    cover-box button { margin-top: 10px; }
  </style>
  <script>
    this.HsTrnsfrCnfrm = this.opts.FdURLs ? true : false; // has transfering confirmation.
    this.IsTrnsfrOt = false; // is transfer out.
    this.Fds = []; // feeds.
    this.TrnsfrLnk = ''; // transfer link.

    this.mixin('Z.RM');

    this.on(
      'mount',
      () => {
        this.OnBrowser(() => {
          if (!window.localStorage.FdURLs) {
            window.localStorage.FdURLs = '';

            return;
          }

          if (this.HsTrnsfrCnfrm) { return; }

          let FdURLs = this.URLsFilter(window.localStorage.FdURLs.split('_|_'));

          this.AllFeedsLoad(FdURLs);
        });
      });

    this.ServiceListen('FEEDS', (Sto, TskPrms) => { this.update({ Fds: Sto }); });

    this.ServiceListen(
      'TRANSFER',
      (Sto, TskPrms) => {
        this.update({
          TrnsfrLnk: Sto ? ('http://' + window.location.host + '/read?t=' + Sto) : 'can not transer data.'
        });
      });

    URLsFilter (URLs) {
      if (!Z.Is.Array(URLs)) { return []; }

      return URLs.filter(function (URL) { return Z.Is.URL(URL); });
    }

    AllFeedsLoad (FdURLs) {
      for (let i = 0; i < FdURLs.length; i++) {
        if (!FdURLs[i]) { continue; }

        this.OneFeedLoad(FdURLs[i]);
      }
    }

    OneFeedLoad (URL) {
      this.ServiceCall(
        '/service/feed',
        { URL: URL },
        'FEEDS',
        (Sto, Rst) => {
          if (!Sto) { Sto = []; }

          if (!Rst) { console.log('can get feed result for ' +  URL); }
          else { Sto.push(Rst); }

          return Sto;
        });
    }

    OneFeedAdd (Evt) {
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
          this.Fds.splice(i, 1);

          break;
        }
      }

      window.localStorage.FdURLs = FdURLs.replace(URL, '').replace(/_\|__\|_/g, '_|_').replace(/^_\|_|_\|_$/g, '');
      this.update();
    }

    Transfer (Evt) {
      this.ServiceCall(
        '/service/transfer',
        { Ctn: window.localStorage.FdURLs },
        'TRANSFER',
        (Sto, Rst) => { return Rst; });

      this.TransferModeToggle(Evt);
    }

    TransferModeToggle (Evt) {
      this.update({ IsTrnsfrOt: !this.IsTrnsfrOt });
    }

    TransferIgnore (Evt) {
      let FdURLs = this.URLsFilter(window.localStorage.FdURLs.split('_|_'));

      this.update({ HsTrnsfrCnfrm: false });
      this.AllFeedsLoad(FdURLs);
    }

    TransferMerge (Evt) {
      let LclFdURLs = this.URLsFilter(window.localStorage.FdURLs.split('_|_')),
          RmtFdURLs = this.URLsFilter(this.opts.FdURLs.split('_|_')),
          FdURLs = LclFdURLs;

      for (let i = 0; i < RmtFdURLs.length; i++) {
        if (FdURLs.indexOf(RmtFdURLs[i]) > -1 || !Z.Is.URL(RmtFdURLs[i])) { continue; }

        FdURLs.push(RmtFdURLs[i]);
      }

      window.localStorage.FdURLs = FdURLs.join('_|_');
      this.update({ HsTrnsfrCnfrm: false });
      this.AllFeedsLoad(FdURLs);
    }

    TransferReplace (Evt) {
      let FdURLs = this.URLsFilter(this.opts.FdURLs.split('_|_'));

      window.localStorage.FdURLs = FdURLs.join('_|_');
      this.update({ HsTrnsfrCnfrm: false });
      this.AllFeedsLoad(FdURLs);
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
    :last-child>a { display: block; margin: 10px 0; }
  </style>
  <script>
    Delete (Evt) {
      if (Z.Is.Function(this.opts.delete)) { this.opts.delete(this.FdURL); }
    }
  </script>
</feed>
