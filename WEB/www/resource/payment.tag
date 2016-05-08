<payment class='Pymnt'>
  <div>
    <span class='Btn' onclick={Save}>Save</span>
  </div>
  <tabbox class='TbBx' dftidx={1}>
    <buyerlist if={Idx === 0}  class='ByrLst' tbnm="Buyers" byrs={parent.Byrs} edit={parent.BuyerEdit} add={parent.BuyerAdd}/>
    <itemlist if={Idx === 1}  class='ItmLst' tbnm="Items" itms={parent.Itms} edit={parent.ItemEdit} add={parent.ItemAdd}/>
  </tabbox>
  <editor class='Edtr' byrs={Byrs} itms={Itms} md={false} ttl='' info={null} save={null}/>

  <script>
    let self = this,
        LclStrgKy = 'PaymentData';

    (() => {
      let Data = window.localStorage.getItem(LclStrgKy);

      if (Data) { Data = JSON.parse(Data); }

      if (!Data || typeof Data !== 'object') {
        this.Byrs = [];
        this.Itms = [];

        return;
      }

      this.Byrs = Data.Byrs || [],
      this.Itms = Data.Itms || [];

      for (let i = 0; i < this.Itms.length; i++) {
        let ItmByr = this.Itms[i] && this.Itms[i].Byr || null,
            ItmByrNm = ItmByr && ItmByr.Nm || null,
            IsMtchd = false;

        for (let j = 0; j < this.Byrs.length; j++) {
          if (this.Byrs[j] && this.Byrs[j].Nm && this.Byrs[j].Nm === ItmByrNm) {
            this.Itms[i].Byr = this.Byrs[j];
            IsMtchd = true;

            break;
          }
        }

        if (!IsMtchd && ItmByr) { this.Byrs.push(ItmByr); }
      }
    })();

    BuyerEdit (Evt) {
      let Save = (Rst) => {
        self.tags.editor.opts.md = false;
        Evt.item.Nm = Rst;

        self.tags.tabbox.tags.buyerlist.update();
      };

      this.tags.editor.update({
        opts: {
          ttl: 'Buyer Edit',
          md: 'BUYER',
          info: Evt.item,
          save: Save}});
    }

    BuyerAdd () {
      let Save = (Rst) => {
        self.tags.editor.opts.md = false;

        self.Byrs.push({Nm: Rst});
        self.tags.tabbox.tags.buyerlist.update();
      };

      this.tags.editor.update({
        opts: {
          ttl: 'Buyer Add',
          md: 'BUYER',
          info: null,
          save: Save}});
    }

    ItemEdit (Evt) {
      let Save = (Rst) => {
        self.tags.editor.opts.md = false;

        Z.Obj.Combine(Evt.item, Rst, true);
        self.tags.tabbox.tags.itemlist.update();
      };

      this.tags.editor.update({
        opts: {
          byrs: this.Byrs,
          itms: this.Itms,
          ttl: 'Item Edit',
          md: 'ITEM',
          info: Evt.item,
          save: Save}});
    }

    ItemAdd () {
      let Save = (Rst) => {
        self.tags.editor.opts.md = false;

        self.Itms.push(Rst);
        self.tags.tabbox.tags.itemlist.update();
      };

      this.tags.editor.update({
        opts: {
          byrs: this.Byrs,
          itms: this.Itms,
          ttl: 'Item Add',
          md: 'ITEM',
          info: null,
          save: Save}});
    }

    Save () {
      let Data = JSON.stringify({Byrs: this.Byrs, Itms: this.Itms});

      window.localStorage.setItem(LclStrgKy, Data);
    }
  </script>
</payment>

<tabbox>
  <ul>
    <li each={Tbs} class="Tb {Pckd ? 'Pckd' : ''}" onclick={Switch}>{Nm}</li>
  </ul>
  <yield/>

  <script>
    this.Idx = Z.Is.Number(this.opts.dftidx) ? this.opts.dftidx : 0;
    this.Tbs = [];

    this.on('before-mount', () => {
      for (let i in this.tags) {
        let Tb = this.tags[i];

        this.Tbs.push({Nm: Tb.opts && Tb.opts.tbnm || '?', Pckd: false});
      }

      this.Tbs[this.Idx].Pckd = true;
    });

    Switch (Evt) {
      this.Tbs[this.Idx].Pckd = false;
      this.Idx = this.Tbs.indexOf(Evt.item);
      this.Tbs[this.Idx].Pckd = true;

      this.update();
    }
  </script>

  <style>
    .TbBx>ul:first-child { margin: 0; padding: 0; }
    .TbBx>ul:first-child>li { display: inline-block; cursor: pointer; }
  </style>
</tabbox>

<buyerlist>
  <ul>
    <li each={opts.byrs}>
      <span class='Btn' onclick={Edit}>{Nm}</span>
    </li>
  </ul>
  <span class='Btn' onclick={opts.add}>+</span>

  <script>
    let self = this;

    Edit (Evt) {
      self.opts.edit(Evt);
    }
  </script>
</buyerlist>

<itemlist>
  <table>
    <tbody>
      <tr class="Itm">
        <td>Datetime</td>
        <td>Item</td>
        <td>Price</td>
        <td>Buyer</td>
        <td>Comment</td>
      </tr>
      <tr each={opts.itms} class="Btn Itm" onclick={Edit}>
        <td>{Dt}</td>
        <td>{Itm}</td>
        <td>{Prc}</td>
        <td>{Byr.Nm}</td>
        <td>{Cmt}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <span class='Btn' onclick={opts.add}>+</span>
  </div>

  <script>
    let self = this;

    Edit (Evt) {
      self.opts.edit(Evt);
    }
  </script>

  <style>
    itemlist>table { width: 100%; }
  </style>
</itemlist>

<editor if={opts.md} class='Edtr Bckbrd'>
  <div class='FrntBrd'>
    <div>{opts.ttl}</div>
    <buyerform if={opts.md === 'BUYER'} info={opts.info} save={Save}/>
    <itemform if={opts.md === 'ITEM'} info={opts.info} byrs={Byrs}/>
    <div>
      <span class='Btn' onclick={Cancel}>Cancel</span>
      <span if={opts.info} class='Btn' onclick={Delete}>Delete</span>
      <span class='Btn' onclick={Save}>Save</span>
    </div>
  </div>

  <script>
    let self = this,
        Byrs = this.opts.byrs,
        Itms = this.opts.itms;

    Cancel (Evt) {
      this.update({opts: {md: ''}});
    }

    Delete (Evt) {
      let TgtData = this.opts.md === 'BUYER' ? Byrs : Itms;

      TgtData.splice(TgtData.indexOf(this.opts.info), 1);

      this.opts.md = '';

      this.parent.update();
    }

    Save (Evt) {
      let TgtRst = self.opts.md === 'BUYER' ? self.tags.buyerform.DataGet() : self.tags.itemform.DataGet();

      self.opts.save(TgtRst);
    }
  </script>
</editor>

<buyerform>
  <input type="text" name="ByrNm" value={Nm}/>

  <script>
    this.Nm = this.opts.info && this.opts.info.Nm || '';

    this.on('update', function (Data) {
      this.Nm = Z.Obj.Dig(Data, ['opts', 'info', 'Nm'], '');
    });

    this.on('updated', () => {
        this.ByrNm.focus();
        this.ByrNm.select();
    });

    DataGet () {
      return this.ByrNm.value;
    }
  </script>
</buyerform>

<itemform>
  <table>
    <tbody>
      <tr><td>Datetime</td><td><input type="date" name="Dt" placeholder="YYYY-MM-DD" value={Info.Dt}/></td></tr>
      <tr><td>Item</td><td><input type="text" name="Itm" value={Info.Itm}/></td>
      <tr><td>Price</td><td><input type="number" name="Prc" value={Info.Prc}/></td>
      <tr>
        <td>Buyer</td>
        <td>
          <select name="Byr">
            <option each={opts.byrs} value={Nm} selected={Nm === parent.Info.Byr.Nm}>{Nm}</option>
          </select>
        </td>
      <tr><td>Comment</td><td><input type="text" name="Cmt" value={Info.Cmt}/></td>
    </tbody>
  </table>

  <script>
    this.Info = this.opts.info;

    this.on(
      'update',
      (Data) => {
        this.Info = Z.Obj.Dig(Data, ['opts', 'info'], {});
      });

    this.on(
      'updated',
      () => {
        this.Dt.focus();
        this.Dt.select();
      });

    DataGet () {
      let Rst = {Dt: this.Dt.value, Itm: this.Itm.value, Prc: this.Prc.value, Byr: this.opts.byrs[0], Cmt: this.Cmt.value};

      for (let i = 1; i < this.opts.byrs.length; i++) {
        if (this.opts.byrs[i].Nm === this.Byr.value) {
          Rst.Byr = this.opts.byrs[i];

          break;
        }
      }

      return Rst;
    }
  </script>
</itemform>
