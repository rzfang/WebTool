<payment class='Pymnt'>
  <buyerlist byrs={Data.Byrs} />
  <itemlist itms={Data.Itms}></itemlist>
  <editor />
</payment>

<buyerlist>
  Buyers:
  <span each={opts.byrs} class='Btn' onclick={BuyerEdit}>{Nm}</span>
  <span class='Btn' onclick={BuyerAdd}>+</span>

  <script>
    let self = this,
        Edtr = this.parent.tags.editor;

    BuyerEdit (Evt) {
      let Save = function (Rst) {
        Evt.item.Nm = Rst;

        self.parent.update();
        Edtr.Cancel();
      };

      Edtr.update({opts: {Ttl: 'Buyer Edit', Md: 'BUYER', Info: Evt.item, Save: Save}});
    }

    BuyerAdd () {
      let Save = function (Rst) {
        self.opts.byrs.push({Nm: Rst});
        self.parent.update();
        Edtr.Cancel();
      };

      Edtr.update({opts: {Ttl: 'Buyer Add', Md: 'BUYER', Info: null, Save: Save}});
    }
  </script>
</buyerlist>

<itemlist>
  <table class='ItmLst'>
    <tbody>
      <tr class="Itm">
        <td>Datetime</td>
        <td>Item</td>
        <td>Price</td>
        <td>Buyer</td>
        <td>Comment</td>
      </tr>
      <tr each={opts.itms} class="Itm" onclick={ItemEdit}>
        <td>{Dt}</td>
        <td>{Itm}</td>
        <td>{Prc}</td>
        <td>{Byr.Nm}</td>
        <td>{Cmt}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <span class='Btn' onclick={ItemAdd}>+</span>
  </div>

  <script>
    let self = this,
        Edtr = this.parent.tags.editor;

    ItemEdit (Evt) {
      let Save = (Rst) => {
        Rst.Byr = {Nm: Rst.Byr};

        Z.Obj.Merge(Evt.item, Rst);
        self.parent.update();
        Edtr.Cancel();
      };

      Edtr.update({opts: {Ttl: 'Item Edit', Md: 'ITEM', Info: Evt.item, Save: Save}});
    }

    ItemAdd () {
      let Save = (Rst) => {
        Rst.Byr = {Nm: Rst.Byr};

        this.opts.itms.push(Rst);
        self.parent.update();
        Edtr.Cancel();
      };

      Edtr.update({opts: {Ttl: 'Item Add', Md: 'ITEM', Info: null, Save: Save}});
    }
  </script>
</itemlist>

<editor class='Edtr Bckbrd' if={opts.Md}>
  <div class='FrntBrd'>
    <div>{opts.Ttl}</div>
    <buyerform if={opts.Md === 'BUYER'} info={opts.Info} />
    <itemform if={opts.Md === 'ITEM'} info={opts.Info} />
    <div>
      <span class='Btn' onclick={Cancel}>Cancel</span>
      <span class='Btn' onclick={Delete}>Delete</span>
      <span class='Btn' onclick={Save}>Save</span>
    </div>
  </div>

  <script>
    Cancel () {
      this.opts.Md = '';

      this.update();
    }

    Delete () {
      let TgtData = this.opts.Md === 'BUYER' ? Data.Byrs : Data.Itms;

      TgtData.splice(TgtData.indexOf(this.opts.Info), 1);

      this.opts.Md = '';

      this.parent.update();
    }

    Save (Evt) {
      let TgtRst = this.opts.Md === 'BUYER' ? this.tags.buyerform.DataGet() : this.tags.itemform.DataGet();

      this.opts.Save(TgtRst);
    }
  </script>
</editor>

<buyerform>
  <input type="text" name="ByrNm" value={opts.Info.Nm} />

  <script>
    DataGet () {
      return this.ByrNm.value;
    }
  </script>
</buyerform>

<itemform>
  <input type="date" name="Dt" value={opts.Info.Dt} />
  <input type="text" name="Itm" value={opts.Info.Itm} />
  <input type="number" name="Prc" value={opts.Info.Prc} />
  <input type="text" name="Byr" value={opts.Info.Byr.Nm} />
  <input type="text" name="Cmt" value={opts.Info.Cmt} />

  <script>
    DataGet () {
      let Rst = {Dt: this.Dt.value, Itm: this.Itm.value, Prc: this.Prc.value, Byr: this.Byr.value, Cmt: this.Cmt.value};

      return Rst;
    }
  </script>
</itemform>
