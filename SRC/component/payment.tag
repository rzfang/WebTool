<payment class='Pymnt'>
  <div if={IsSvdHnt}>Saved !</div>
  <tab-box dftidx={1} tbs={Tbs}>
    <buyer-list if={Idx === 0} nms={parent.ByrNms} add={parent.BuyerAdd} edit={parent.BuyerEdit}/>
    <item-list if={Idx === 1} itms={parent.Itms} add={parent.ItemAdd} edit={parent.ItemEdit} sort={parent.ItemSort}/>
    <check-list if={Idx === 2} byrnms={parent.ByrNms} itms={parent.Itms}/>
  </tab-box>
  <button onclick={Transfer}>Transfer</button>
  <cover-box if={EdtMd}>
    <buyer-editor if={parent.EdtMd === 'BUYER'} edtnm={parent.EdtByr} cancel={parent.EditorDoneOrCancel} done={parent.EditorDoneOrCancel}/>
    <item-editor if={parent.EdtMd === 'ITEM'} info={parent.EdtItm} edtclmn={parent.EdtItmClmn} byrnms={parent.ByrNms} cancel={parent.EditorDoneOrCancel} done={parent.EditorDoneOrCancel}/>
  </cover-box>
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
      <button onclick={parent.TransferReplace}>Replace</button>
    </div>
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
    :scope>button { position: absolute; left: 220px; top: 0; }
    cover-box>div { position: relative; }
    cover-box p { max-width: 480px; }
    cover-box>div>div { margin: 10px 0; text-align: center; }
    cover-box button { margin-top: 10px; }
  </style>
  <script>
    let LclStrgKy = 'PaymentData', // localStorage key.
        AtSvClck = 0; // auto save clock.

    this.IsSvdHnt = false; // is saved hint.
    this.EdtByr = null; // editing buyer.
    this.EdtItm = null; // editing item.
    this.EdtItmClmn = 1, // editing item column.
    this.EdtMd = ''; // editing mode, 'BUYER' | 'ITEM';
    this.HsTrnsfrCnfrm = this.opts.TrnsfrData ? true : false; // has transfering confirmation.
    this.IsTrnsfrOt = false; // is transfer out.
    this.TrnsfrLnk = ''; // transfer link.
    this.ByrNms = [];
    this.Itms = [];
    this.Tbs = [
        { Nm: 'Buyers' },
        { Nm: 'Items' },
        { Nm: 'Check' }];

    this.mixin('Z.RM');

    this.StoreListen(
      'TRANSFER',
      (Sto, TskPrms) => {
        this.update({ TrnsfrLnk: Sto ? (window.location.origin + '/payment?t=' + Sto) : 'can not transer data.' });
      });

    this.StoreListen(
      'PAYMENTS',
      (Pymnts) => {
        if (Z.Is.Array(Pymnts)) { this.AutoSave({ EdtMd: '', Itms: Pymnts }); }
      });

    this.StoreListen(
      'BUYER_NAMES',
      (ByrNms) => { this.update({ ByrNms }); });

    this.on('mount', () => { this.DataFromJSON(window.localStorage.getItem(LclStrgKy)); });

    /* set up data from JSON string.
      Str = JSON string.
      Return: result code number. */
    DataFromJSON (Str) {
      let Data = { Itms: [], Byrs: [] };

      if (!Str) { return -1; }

      Data = JSON.parse(Str);

      if (!Data || !Z.Is.Object(Data)) { return -1; }

      let Pymnts = Data,
          ByrNms = []; // buyer names.

      //==== transfer the old version format data to be new one. ====

      if (!Z.Is.Array(Pymnts) && Pymnts.Itms && Z.Is.Array(Pymnts.Itms)) { Pymnts = Pymnts.Itms; }

      for (let i = 0; i < Pymnts.length; i++) {
        let Byr = Pymnts[i].Byr || {},
            Prc = Pymnts[i].Prc || 0;

        if (!Pymnts[i].Byrs || !Z.Is.Array(Pymnts[i].Byrs)) { Pymnts[i].Byrs = []; }

        if (Byr && Byr.Nm && Z.Is.String(Byr.Nm)) { Pymnts[i].Byrs.push({ Nm: Byr.Nm, Prc }); }

        for (let j = 0; j < Pymnts[i].Byrs.length; j++) {
          if (ByrNms.indexOf(Pymnts[i].Byrs[j].Nm) < 0) { ByrNms.push(Pymnts[i].Byrs[j].Nm); }
        }

        delete Pymnts[i].Byr;
        delete Pymnts[i].Prc;
      }

      //====

      this.StoreSet('PAYMENTS', () => { return Pymnts; });
      this.StoreSet('BUYER_NAMES', () => { return ByrNms; });
    }

    EditorDoneOrCancel (Evt) {
      this.update({ EdtMd: '' });
    }

    BuyerEdit (Evt) {
      this.update({ EdtMd: 'BUYER', EdtByr: Evt.Element().innerText });
    }

    BuyerAdd () {
      this.update({ EdtMd: 'BUYER', EdtByr: '' });
    }

    ItemEdit (Evt, RwIdx, ClmnIdx) {
      this.update({ EdtMd: 'ITEM', EdtItm: this.Itms[RwIdx], EdtItmClmn: ClmnIdx });
    }

    ItemAdd (Evt) {
      this.update({ EdtMd: 'ITEM', EdtItm: null, EdtItmClmn: -1 });
    }

    ItemSort (Evt) {
      let Itms = Array.from(this.Itms);

      Itms.sort((A, B) => {
        if (!A.Dt || !B.Dt) { return 0; }

        if (A.Dt > B.Dt) { return 1; }
        else if (A.Dt < B.Dt) { return -1; }

        return 0;
      });

      this.StoreSet('PAYMENTS', () => { return Itms; });
      this.update({ Itms });
    }

    /*
      @ updated options object. */
    AutoSave (UpdtOpts) {
      UpdtOpts.IsSvdHnt = false;

      clearTimeout(AtSvClck);
      this.update(UpdtOpts);

      AtSvClck = setTimeout(
        () => {
          let Data = JSON.stringify({ Itms: this.Itms });

          window.localStorage.setItem(LclStrgKy, Data);
          this.update({ IsSvdHnt: true });
          setTimeout(() => { this.update({ IsSvdHnt: false }); }, 3000);
        },
        1000);
    }

    Transfer (Evt) {
      this.ServiceCall(
        '/service/transfer',
        { Ctn: window.localStorage.PaymentData },
        'TRANSFER',
        (Sto, Rst) => { return Rst; });

      this.TransferModeToggle(Evt);
    }

    TransferModeToggle (Evt) {
      this.IsTrnsfrOt = !this.IsTrnsfrOt;
    }

    TransferIgnore (Evt) {
      this.HsTrnsfrCnfrm = false;
    }

    TransferReplace (Evt) {
      this.DataFromJSON(this.opts.TrnsfrData);
      this.AutoSave({ HsTrnsfrCnfrm: false });
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

<buyer-list>
  <ul>
    <li each={Nm, i in opts.nms}>
      <button onclick={parent.opts.edit}>{Nm}</button>
    </li>
  </ul>
  <button onclick={opts.add}>Add</button>
  <style scoped>
    :scope>ul { margin: 10px 0; }
    :scope>ul>li { margin: 3px 0; list-style: none; }
  </style>
</buyer-list>

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
        <td><button onclick={Edit}>{PricePrint(Byrs)}</button></td>
        <td><button onclick={Edit}>{BuyersPrint(Byrs)}</button></td>
        <td><button onclick={Edit}>{Cmt || '-'}</button></td>
      </tr>
    </tbody>
  </table>
  <div>
    <button onclick={opts.add}>Add</button>
    <button onclick={opts.sort}>Sort By Date</button>
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

    /*
      Byrs = buyers arary. */
    PricePrint (Byrs) {
      if (!Z.Is.Array(Byrs)) { return 0; }

      let Prc = 0; // price.

      for (let i = 0; i < Byrs.length; i++) {
        if (Byrs[i].Prc && Z.Is.Number(Byrs[i].Prc)) { Prc += Byrs[i].Prc; }
      }

      return Prc;
    }

    /*
      Byrs = buyers arary. */
    BuyersPrint (Byrs) {
      if (!Z.Is.Array(Byrs) || Byrs.length < 1 || !Z.Is.String(Byrs[0].Nm)) { return '-'; }

      let Nms = Byrs[0].Nm; // names.

      if (Byrs.length > 1) { Nms += ' (' + (Byrs.length).toString() + ')'; }

      return Nms;
    }
  </script>
</item-list>

<check-list>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Amount</th>
        <th>Has Paid</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr each={Chks}>
        <td>{Nm}</td>
        <td>{Amnt}</td>
        <td>{Pd}</td>
        <td>{Blnc}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td>{Ttl}</td>
        <td></td>
        <td></td>
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
    this.Chks = []; // checking list.
    this.Ttl = 0; // total.

    this.mixin('Z.RM');

    this.on(
      'before-mount',
      () => {
        // fill checking list.
        for (let i = 0; i < this.opts.byrnms.length; i++) {
          this.Chks.push({ Nm: this.opts.byrnms[i], Amnt: 0, Pd: 0, Blnc: 0 });
        }

        for (let i = 0; i < this.opts.itms.length; i++) {
          let Itm = this.opts.itms[i],
              Amnt = 0,
              Avrg;

          //==== calculate one item. ====

          for (let j = 0; j < Itm.Byrs.length; j++) { Amnt += Itm.Byrs[j].Prc; }

          this.Ttl += Amnt;
          Avrg = parseFloat((Amnt / Itm.Byrs.length).toFixed(2));

          //====

          for (let j = 0; j < Itm.Byrs.length; j++) {
            let Byr = Itm.Byrs[j];

            for (let k = 0; k < this.Chks.length; k++) {
              let Chk = this.Chks[k];

              if (Byr.Nm === Chk.Nm) {
                Chk.Pd += Byr.Prc;
                Chk.Amnt = parseFloat((Chk.Amnt + Avrg).toFixed(2));
                Chk.Blnc = parseFloat((Chk.Pd - Chk.Amnt).toFixed(2));
              }
            }
          }
        }

        console.log(this.Chks);
      });
  </script>
</check-list>

<buyer-editor>
  <h3>Buyer Add/Edit</h3>
  <input ref='Nm' type='text' value={opts.edtnm} onkeyup={KeyAction}/>
  <div>
    <button onclick={opts.cancel}>Cancel</button>
    <button onclick={Done}>Done</button>
  </div>
  <style scoped>
    h3 { margin: 0; }
    input { margin: 5px 0; }
    div>div { text-align: right; }
  </style>
  <script>
    this.mixin('Z.RM');

    this.on('mount', () => { this.refs.Nm.focus(); });

    KeyAction (Evt) {
      if (Evt.keyCode === 27) { return this.opts.cancel(Evt); }

      if (Evt.keyCode !== 13) { return; }

      this.Done(Evt);
    }

    Done (Evt) {
      let NwNm = this.refs.Nm.value?.trim(), // new name.
          ByrNms, // buyer names.
          Idx; // index.

      if (!NwNm) { return alert('empty name ?'); }

      ByrNms = this.StoreGet('BUYER_NAMES');
      Idx = ByrNms.indexOf(NwNm);

      if (Idx > -1) { return alert('the name has been existed.'); }

      if (!this.opts.edtnm) { ByrNms.push(NwNm); } // add.
      else { // edit.
        Idx = ByrNms.indexOf(this.opts.edtnm);
        ByrNms[Idx] = NwNm;

        this.StoreSet(
          'PAYMENTS',
          (Pymnts) => {
            for (let i = 0; i < Pymnts.length; i++) {
              for (let j = 0; j < Pymnts[i].Byrs.length; j++) {
                if (Pymnts[i].Byrs[j].Nm === this.opts.edtnm) { Pymnts[i].Byrs[j].Nm = NwNm; }
              }
            }

            return Pymnts;
          });
      }

      this.StoreSet('BUYER_NAMES', () => { return ByrNms; });
      this.opts.done(Evt);
    }
  </script>
</buyer-editor>

<item-editor>
  <h3>Item Add/Edit</h3>
  <table>
    <tbody>
      <tr>
        <td>Datetime</td>
        <td><input ref='Dt' type="date" placeholder="YYYY-MM-DD" value={EdtItm.Dt} onkeyup={KeyAction}/></td>
      </tr>
      <tr>
        <td>Item</td>
        <td>
          <input ref='Itm' type="text" value={EdtItm.Itm} oninput={ItemSuggest} onblur={SuggestionHide}/>
          <ul if={Sgstns.length}>
            <li each={Nm, i in Sgstns}>
              <button onclick={SuggestionPick}>{Nm}</button>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Buyer &amp;<br/>Price</td>
        <td>
          <ul ref='Byrs'>
            <li each={EdtItm.Byrs}>
              <select>
                <option each={ByrNm, i in parent.opts.byrnms} value={ByrNm} selected={ByrNm === Nm}>{ByrNm}</option>
              </select>
              <input type='number' min='0' value={Prc}/>
              <button onclick={BuyerDelete}>X</button>
            </li>
            <li><button onclick={BuyerAdd}>+</button></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Comment</td>
        <td><input ref='Cmt' type="text" value={EdtItm.Cmt} onkeyup={KeyAction}/></td>
      </tr>
    </tbody>
  </table>
  <div>
    <button onclick={opts.cancel}>Cancel</button>
    <button if={opts.info} onclick={Delete}>Delete</button>
    <button onclick={Done}>Done</button>
  </div>
  <style scoped>
    :scope>h3 { margin: 0; }
    input { margin: 5px 0; }
    :scope tr:nth-child(2) ul { position: absolute; list-style: none; margin: 0; border-width: 1px; padding: 5px; background-color: #ffffff; }
    :scope tr:nth-child(2) ul>li { margin-top: 5px; }
    :scope tr:nth-child(2) ul>li:first-child { margin-top: 0; }
    :scope tr:nth-child(2) ul>li>button { margin-top: 0; min-width: 80px; }
    :scope tr:nth-child(3) ul { padding: 0; list-style: none; }
    :scope tr:nth-child(3) ul>li>input { margin: 2px 0; max-width: 80px; }
    :scope tr:nth-child(3) ul>li>button { margin-top: 0; min-width: 20px; }
  </style>
  <script>
    this.EdtItm = this.opts.info ? Z.Obj.Clone(this.opts.info) : { Dt: '', Itm: '', Byrs: [], Cmt: '' };
    this.Sgstns = [];

    this.mixin('Z.RM');

    this.on(
      'mount',
      () => {
        let Tgt; // target.

        switch (this.opts.edtclmn) {
          case '0':
            Tgt = this.refs.Dt;
            break;

          case '2':
            Tgt = this.refs.Byrs.Find('input[type=number]')[0];
            break;

          case '3':
            Tgt = this.refs.Byrs.Find('select')[0];
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

    BuyerAdd (Evt) {
      let EdtItm = this.EdtItm;

      EdtItm.Byrs.push({ Nm: '', Prc: 0});

      this.update({ EdtItm });
    }

    BuyerDelete (Evt) {
      let EdtItm = this.EdtItm,
          Idx = Evt.Element().Above().Index();

      EdtItm.Byrs.splice(Idx, 1);

      this.update({ EdtItm });
    }

    KeyAction (Evt) {
      if (Evt.keyCode === 27) { return this.opts.cancel(Evt); }

      if (Evt.keyCode !== 13) { return; }

      this.Done(Evt);
    }

    ItemSuggest (Evt) {
      if (Evt.target.value.trim().length === 0) {
        this.Sgstns = [];

        return;
      }

      const Pymnts = this.StoreGet('PAYMENTS');
      let Sgstns = []; // suggestions.

      for (let i = 0; i < Pymnts.length; i++) {
        const Pymnt = Pymnts[i].Itm;

        if (Pymnt.indexOf(Evt.target.value) < 0 || Sgstns.indexOf(Pymnt) > -1) { continue; }

        Sgstns.push(Pymnt);
      }

      this.Sgstns = Sgstns;
    }

    SuggestionHide (Evt) {
      setTimeout(() => {
        this.Sgstns = [];
        this.update();
      },
      100); // slow down 'onblur' event so that 'SuggestionPick' can do first.
    }

    SuggestionPick (Evt) {
      this.refs.Itm.value = Evt.target.innerText;
      this.Sgstns = [];
    }

    Delete (Evt) {
      this.StoreSet(
        'PAYMENTS',
        (Pymnts) => {
          let Idx = Pymnts.indexOf(this.opts.info);

          Pymnts.splice(Idx, 1);

          return Pymnts;
        });

      this.opts.done(Evt);
    }

    Done (Evt) {
      let NwInfo = {
            Dt: this.refs.Dt.value,
            Itm: this.refs.Itm.value,
            Byrs: [],
            Cmt: this.refs.Cmt.value
          }, // new info.
          ByrNds = this.refs.Byrs.Find('select,input[type=number]'), // buyer nodes.
          Hnt = '';

      for (let i = 0; i < ByrNds.length; i += 2) {
        NwInfo.Byrs.push({ Nm: ByrNds[i].value, Prc: parseInt(ByrNds[i + 1].value, 10) });
      }

      if (!NwInfo.Dt) { Hnt += 'no date.\n'; }

      if (!NwInfo.Itm) { Hnt += 'no item name.\n'; }

      if (NwInfo.Byrs.length === 0) { Hnt += 'no buyers.\n'; }

      if (Hnt) { return alert('please notice:\n' + Hnt); }

      this.StoreSet(
        'PAYMENTS',
        (Pymnts) => {
          let Idx = Pymnts.indexOf(this.opts.info);

          if (Idx < 0) { Pymnts.push(NwInfo); } // add.
          else { Pymnts.splice(Idx, 1, NwInfo); } // edit / replace.

          return Pymnts;
        });

      this.opts.done(Evt);
    }
  </script>
</item-editor>
