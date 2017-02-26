<payment class='Pymnt'>
  <button onclick={Save}>Save</button>
  <tabbox dftidx={1} tbs={Tbs}>
    <div if={Idx === 0} class='ByrLst'>
      <ul>
        <li each={parent.Byrs}>
          <button onclick={parent.parent.BuyerEdit}>{Nm}</button>
        </li>
      </ul>
      <button onclick={parent.BuyerAdd}>Add</button>
    </div>
    <itemlist if={Idx === 1} itms={parent.Itms} add={parent.ItemAdd} edit={parent.ItemEdit}/>
    <check if={Idx === 2} class='Chk' byrs={parent.Byrs} itms={parent.Itms}/>
  </tabbox>
  <buyer-editor if={EdtByr} info={EdtByr} cancel={BuyerCancel} delete={BuyerDelete} done={BuyerDone}/>
  <item-editor if={EdtItm} info={EdtItm} byrs={Byrs} cancel={ItemCancel} delete={ItemDelete} done={ItemDone}/>
  <style scoped>
    :scope { display: block; position: relative; margin-top: 10px; }
    :scope>button { position: absolute; right: 0; }
    .ByrLst>ul { margin: 10px 0; }
    .ByrLst>ul>li { margin: 3px 0; list-style: none; }
  </style>
  <script>
    let LclStrgKy = 'PaymentData'; // localStorage key.

    this.EdtByr;
    this.Byrs = [];
    this.Itms = [];
    this.Tbs = [
        { Nm: 'Buyer' },
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
      this.update({ EdtByr: null });
    }

    BuyerDone (Evt, Nm) {
      this.EdtByr.Nm = Nm;

      this.update({ EdtByr: null });
    }

    ItemEdit (Evt, Idx) {
      this.update({ EdtItm: this.Itms[Idx] });
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
      this.update({ EdtItm: null });
    }

    ItemDone (Evt, Info) {
      Object.assign(this.EdtItm, Info);

      this.update({ EdtItm: null });
    }

    Save () {
      let Data = JSON.stringify({Byrs: this.Byrs, Itms: this.Itms});

      window.localStorage.setItem(LclStrgKy, Data);
      alert('Saved.');
    }
  </script>
</payment>

<tabbox>
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
</tabbox>

<itemlist>
  <table>
    <thead>
      <tr>
        <th>Datetime</th>
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
    :scope>table { width: 100%; }
    td>button { width: 100%; }
  </style>
  <script>
    Edit (Evt) {
      const Idx = Evt.Element().Above(2).Index('tr');

      this.opts.edit(Evt, Idx);
    }
  </script>
</itemlist>

<check>
  <table>
    <tbody>
      <tr>
        <th>Name</th>
        <th>Amount</th>
        <th>Balance</th>
      </tr>
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

  <script>
    this.Chk = []; // 'Chk' = Check.
    this.Ttl = 0; // 'Ttl' = Total.
    this.Avrg = 0; // 'Avrg' = Average.

    this.on(
      'update',
      () => {
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
</check>

<buyer-editor>
  <div>
    <h3>Buyer Add/Edit</h3>
    <input ref='Nm' type='text' value={opts.info.Nm}/>
    <div>
      <button onclick={opts.cancel}>Cancel</button>
      <button onclick={opts.delete}>Delete</button>
      <button onclick={Done}>Done</button>
    </div>
  </div>
  <style scoped>
    :scope { position: fixed; left: 0; top: 0; width: 100%; height: 100%; text-align: center; background-color: rgba(0, 0, 0, .5); }
    :scope>div { display: inline-block; min-width: 300px; margin-top: 20px; padding: 5px; text-align: left; background-color: #ffffff; }
    h3 { margin: 0; }
    input { margin: 5px 0; }
    div>div { text-align: right; }
  </style>
  <script>
    this.on('mount', () => { this.refs.Nm.focus(); });

    Done (Evt) {
      this.opts.done(Evt, this.refs.Nm.value);
    }
  </script>
</buyer-editor>

<item-editor>
  <div>
    <h3>Item Add/Edit</h3>
    <table>
      <tbody>
        <tr>
          <td>Datetime</td>
          <td><input ref='Dt' type="date" placeholder="YYYY-MM-DD" value={opts.info.Dt}/></td>
        </tr>
        <tr>
          <td>Item</td>
          <td><input ref='Itm' type="text" value={opts.info.Itm}/>
        </td>
        <tr>
          <td>Price</td>
          <td><input ref='Prc' type="number" value={opts.info.Prc || 0}/>
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
          <td><input ref='Cmt' type="text" value={opts.info.Cmt}/></td>
        </tr>
      </tbody>
    </table>
    <div>
      <button onclick={opts.cancel}>Cancel</button>
      <button onclick={opts.delete}>Delete</button>
      <button onclick={Done}>Done</button>
    </div>
  </div>
  <style scoped>
    :scope { position: fixed; left: 0; top: 0; width: 100%; height: 100%; text-align: center; background-color: rgba(0, 0, 0, .5); }
    :scope>div { display: inline-block; min-width: 300px; margin-top: 20px; padding: 5px; text-align: left; background-color: #ffffff; }
    h3 { margin: 0; }
    input { margin: 5px 0; }
    div>div { text-align: right; }
  </style>
  <script>
    this.on('mount', () => { this.refs.Itm.focus(); });

    Done (Evt) {
      let NwInfo = {
            Dt: this.refs.Dt.value,
            Itm: this.refs.Itm.value,
            Prc: this.refs.Prc.value,
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
