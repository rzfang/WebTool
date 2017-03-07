<payment class='Pymnt'>
  <div if={IsSvdHnt}>Saved !</div>
  <tab-box dftidx={1} tbs={Tbs}>
    <div if={Idx === 0} class='ByrLst'>
      <ul>
        <li each={parent.Byrs}>
          <button onclick={parent.parent.BuyerEdit}>{Nm}</button>
        </li>
      </ul>
      <button onclick={parent.BuyerAdd}>Add</button>
    </div>
    <item-list if={Idx === 1} itms={parent.Itms} add={parent.ItemAdd} edit={parent.ItemEdit}/>
    <check-list if={Idx === 2} byrs={parent.Byrs} itms={parent.Itms}/>
  </tab-box>
  <cover-box if={EdtByr || EdtItm}>
    <buyer-editor if={parent.EdtByr} info={parent.EdtByr} cancel={parent.BuyerCancel} delete={parent.BuyerDelete} done={parent.BuyerDone}/>
    <item-editor if={parent.EdtItm} info={parent.EdtItm} edtclmn={parent.EdtItmClmn} byrs={parent.Byrs} cancel={parent.ItemCancel} delete={parent.ItemDelete} done={parent.ItemDone}/>
  </cover-box>
  <style>
    @keyframes Fd { /* fade */
      from { opacity: 1; }
      to { opacity: 0; }
    }
  </style>
  <style scoped>
    :scope { display: block; position: relative; margin-top: 10px; }
    :scope>div { position: absolute; right: 0; animation-name: Fd; animation-duration: 3s; }
    .ByrLst>ul { margin: 10px 0; }
    .ByrLst>ul>li { margin: 3px 0; list-style: none; }
  </style>
  <script>
    let LclStrgKy = 'PaymentData', // localStorage key.
        AtSvClck = 0; // auto save clock.

    this.IsSvdHnt = false; // is saved hint.
    this.EdtByr = null; // editing buyer.
    this.EdtItm = null; // editing item.
    this.EdtItmClmn = 1, // editing item column.
    this.Byrs = [];
    this.Itms = [];
    this.Tbs = [
        { Nm: 'Buyers' },
        { Nm: 'Items' },
        { Nm: 'Check' }];

    this.mixin('Z.RM');

    this.OnBrowser(() => {
      let Data = window.localStorage.getItem(LclStrgKy);

      if (Data) { Data = JSON.parse(Data); }

      if (!Data || typeof Data !== 'object') {
        this.Byrs = [];
        this.Itms = [];

        return;
      }

      this.Byrs = Z.Is.Array(Data.Byrs) ? Data.Byrs : [],
      this.Itms = Z.Is.Array(Data.Itms) ? Data.Itms : [];

      for (let i = 0; i < this.Itms.length; i++) {
        for (let j = 0; j < this.Byrs.length; j++) {
          if (this.Itms[i].Byr.Nm === this.Byrs[j].Nm) {
            this.Itms[i].Byr = this.Byrs[j];

            break;
          }
        }
      }
    });

    BuyerEdit (Evt) {
      const Idx = Evt.Element().Above().Index('li');

      this.update({ EdtByr: this.Byrs[Idx] });
    }

    BuyerAdd () {
      const EdtByr = { Nm: '' };

      this.Byrs.push(EdtByr);
      this.update({ EdtByr: EdtByr });
    }

    BuyerCancel (Evt) {
      this.update({ EdtByr: null });
    }

    BuyerDelete (Evt) {
      this.Byrs.splice(this.Byrs.indexOf(this.EdtByr), 1);
      this.AutoSave({ EdtByr: null });
    }

    BuyerDone (Evt, Nm) {
      this.EdtByr.Nm = Nm;

      this.AutoSave({ EdtByr: null });
    }

    ItemEdit (Evt, RwIdx, ClmnIdx) {
      this.update({ EdtItm: this.Itms[RwIdx], EdtItmClmn: ClmnIdx });
    }

    ItemAdd () {
      const EdtItm = { Byr: { Nm: '' }};

      this.Itms.push(EdtItm);
      this.update({ EdtItm: EdtItm });
    }

    ItemCancel (Evt) {
      this.update({ EdtItm: null });
    }

    ItemDelete (Evt) {
      this.Itms.splice(this.Itms.indexOf(this.EdtItm), 1);
      this.AutoSave({ EdtItm: null });
    }

    ItemDone (Evt, Info) {
      Object.assign(this.EdtItm, Info);
      this.AutoSave({ EdtItm: null });
    }

    /*
      @ updated options object. */
    AutoSave (UpdtOpts) {
      UpdtOpts.IsSvdHnt = false;

      clearTimeout(AtSvClck);
      this.update(UpdtOpts);

      AtSvClck = setTimeout(
        () => {
          let Data = JSON.stringify({Byrs: this.Byrs, Itms: this.Itms});

          window.localStorage.setItem(LclStrgKy, Data);
          this.update({ IsSvdHnt: true });
          setTimeout(() => { this.update({ IsSvdHnt: false }); }, 3000);
        },
        1000);
    }
  </script>
</payment>

<tab-box>
  <ul>
    <li each={Tbs} class="Tb {Pckd ? 'Pckd' : ''}" onclick={Switch}>{Nm}</li>
  </ul>
  <yield/>
  <style scoped>
    ul { margin: 0; padding: 0; }
    :scope>ul>li { display: inline-block; margin-right: 5px; padding: 3px; border-width: 1px; color: #808080; cursor: pointer; }
    ul>li.Pckd { color: #202020; }
  </style>
  <script>
    this.Idx = 0;
    this.Tbs = [];

    this.mixin('Z.RM');

    this.OnBrowser(() => {
      if (Z.Is.Number(this.opts.dftidx)) { this.Idx = this.opts.dftidx; }

      if (this.opts.tbs && Z.Is.Array(this.opts.tbs)) {
        this.Tbs = this.opts.tbs;
        this.Tbs[this.Idx].Pckd = true;
      }
    });

    Switch (Evt) {
      this.Tbs[this.Idx].Pckd = false;
      this.Idx = this.Tbs.indexOf(Evt.item);
      this.Tbs[this.Idx].Pckd = true;
    }
  </script>
</tab-box>

<item-list>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Item</th>
        <th>Price</th>
        <th>Buyer</th>
        <th>Comment</th>
      </tr>
    </thead>
    <tbody>
      <tr each={opts.itms}>
        <td><button onclick={Edit}>{Dt}</button></td>
        <td><button onclick={Edit}>{Itm}</button></td>
        <td><button onclick={Edit}>{Prc}</button></td>
        <td><button onclick={Edit}>{Byr.Nm}</button></td>
        <td><button onclick={Edit}>{Cmt}</button></td>
      </tr>
    </tbody>
  </table>
  <div>
    <button onclick={opts.add}>Add</button>
  </div>
  <style scoped>
    @media screen and (max-width: 360px) {
        th:first-child, td:first-child, th:last-child, td:last-child { display: none; }
    }

    :scope>table { width: 100%; }
    td>button { width: 100%; }
  </style>
  <script>
    Edit (Evt) {
      const Elmnt = Evt.Element(), // element.
            RwIdx = Elmnt.Above(2).Index(), // row index.
            ClmnIdx = Elmnt.Above(1).Index(); // column index.

      this.opts.edit(Evt, RwIdx, ClmnIdx);
    }
  </script>
</item-list>

<check-list>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Amount</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr each={Chk}>
        <td>{Nm}</td>
        <td>{Amnt}</td>
        <td>{Avrg - Amnt}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td>{Ttl}</td>
        <td>{Avrg}</td>
      </tr>
    </tfoot>
  </table>
  <style scoped>
    table { width: 100%; margin: 5px 0; }
    th, td { text-align: right; }
    th:first-child, td:first-child { text-align: center; }
    tfoot td { border-top-width: 1px; }
  </style>
  <script>
    this.Chk = []; // 'Chk' = Check.
    this.Ttl = 0; // 'Ttl' = Total.
    this.Avrg = 0; // 'Avrg' = Average.

    this.mixin('Z.RM');

    this.OnBrowser(() => {
      this.Chk = [];
      this.Ttl = 0;

      for (let i = 0; i < this.opts.byrs.length; i++) {
        let Pymnt = {Nm: this.opts.byrs[i].Nm, Amnt: 0}; // 'Pymnt' = Payment. 'Nm' = Name, 'Amnt' = Amount.

        for (let j = 0; j < this.opts.itms.length; j++) {
          if (this.opts.itms[j].Byr.Nm === Pymnt.Nm) { Pymnt.Amnt += this.opts.itms[j].Prc; }
        }

        this.Chk.push(Pymnt);
      }

      for (let i = 0; i < this.opts.itms.length; i++) { this.Ttl += this.opts.itms[i].Prc; }

      this.Avrg = this.Ttl / this.Chk.length;
    });
  </script>
</check-list>

<cover-box>
  <div>
    <yield/>
  </div>
  <style scoped>
    :scope { position: fixed; left: 0; top: 0; width: 100%; height: 100%; text-align: center; background-color: rgba(0, 0, 0, .5); }
    :scope>div { display: inline-block; min-width: 300px; margin-top: 20px; padding: 5px; text-align: left; background-color: #ffffff; }
  </style>
</cover-box>

<buyer-editor>
  <h3>Buyer Add/Edit</h3>
  <input ref='Nm' type='text' value={opts.info.Nm} onkeyup={KeyAction}/>
  <div>
    <button onclick={opts.cancel}>Cancel</button>
    <button onclick={opts.delete}>Delete</button>
    <button onclick={Done}>Done</button>
  </div>
  <style scoped>
    h3 { margin: 0; }
    input { margin: 5px 0; }
    div>div { text-align: right; }
  </style>
  <script>
    this.on('mount', () => { this.refs.Nm.focus(); });

    KeyAction (Evt) {
      if (Evt.keyCode === 27) { return this.opts.cancel(Evt); }

      if (Evt.keyCode !== 13) { return; }

      this.Done(Evt);
    }

    Done (Evt) {
      this.opts.done(Evt, this.refs.Nm.value);
    }
  </script>
</buyer-editor>

<item-editor>
  <h3>Item Add/Edit</h3>
  <table>
    <tbody>
      <tr>
        <td>Datetime</td>
        <td><input ref='Dt' type="date" placeholder="YYYY-MM-DD" value={opts.info.Dt} onkeyup={KeyAction}/></td>
      </tr>
      <tr>
        <td>Item</td>
        <td><input ref='Itm' type="text" value={opts.info.Itm} onkeyup={KeyAction}/>
      </td>
      <tr>
        <td>Price</td>
        <td><input ref='Prc' type="number" value={opts.info.Prc || 0} onkeyup={KeyAction}/>
      </td>
      <tr>
        <td>Buyer</td>
        <td>
          <select ref='Byr'>
            <option each={opts.byrs} value={Nm} selected={Nm === parent.opts.info.Byr.Nm}>{Nm}</option>
          </select>
        </td>
      <tr>
        <td>Comment</td>
        <td><input ref='Cmt' type="text" value={opts.info.Cmt} onkeyup={KeyAction}/></td>
      </tr>
    </tbody>
  </table>
  <div>
    <button onclick={opts.cancel}>Cancel</button>
    <button onclick={opts.delete}>Delete</button>
    <button onclick={Done}>Done</button>
  </div>
  <style scoped>
    h3 { margin: 0; }
    input { margin: 5px 0; }
    div>div { text-align: right; }
  </style>
  <script>
    this.on(
      'mount',
      () => {
        let Tgt; // target.

        switch (this.opts.edtclmn) {
          case '0':
            Tgt = this.refs.Dt;
            break;

          case '2':
            Tgt = this.refs.Prc;
            break;

          case '3':
            Tgt = this.refs.Byr;
            break;

          case '4':
            Tgt = this.refs.Cmt;
            break;

          case '1':
          default:
            Tgt = this.refs.Itm;
        }

        Tgt.focus();
      });

    KeyAction (Evt) {
      if (Evt.keyCode === 27) { return this.opts.cancel(Evt); }

      if (Evt.keyCode !== 13) { return; }

      this.Done(Evt);
    }

    Done (Evt) {
      let NwInfo = {
            Dt: this.refs.Dt.value,
            Itm: this.refs.Itm.value,
            Prc: parseInt(this.refs.Prc.value, 10),
            Byr: { Nm: '' },
            Cmt: this.refs.Cmt.value
          };

      for (let i = 0; i < this.opts.byrs.length; i++) {
        if (this.opts.byrs[i].Nm === this.refs.Byr.value) {
          NwInfo.Byr = this.opts.byrs[i];

          break;
        }
      }

      this.opts.done(Evt, NwInfo);
    }
  </script>
</item-editor>
