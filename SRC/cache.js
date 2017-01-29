const fs = require('fs');

module.exports = {
  Cchs: { Fls: {}, Dt: {} }, // caches, data.
  /*
    @ file path.
    @ callback (error code, result data). */
  FileLoad: function (FlPth, Clbck) {
    const This = this;

    if (this.Cchs.Fls[FlPth]) {
      Clbck(1, this.Cchs.Fls[FlPth]);

      return;
    }

    fs.readFile(
      FlPth,
      'utf8',
      function (Err, FlStr) { // error, file string.
        if (Err) {
          Clbck(-1);

          return;
        }

        This.Cchs.Fls[FlPth] = FlStr;

        Clbck(0, FlStr);
      });
  },
  /* get the value.
    @ key name.
    < cached data, or null. */
  Get: function (Ky) {
    if (!this.Cchs.Dt[Ky] || !this.Cchs.Dt[Ky]['Vl'] || !this.Cchs.Dt[Ky]['Dt'] || !this.Cchs.Dt[Ky]['ScndLmt']) {
      return null;
    }

    let Drtn = ((new Date()).getTime() - this.Cchs.Dt[Ky]['Dt']) / 1000; // duration.

    return Drtn > this.Cchs.Dt[Ky]['ScndLmt'] ? null : this.Cchs.Dt[Ky]['Vl'];
  },
  /* set the value.
    @ key name.
    @ value.
    @ second limit.
    < return true or false. */
  Set: function (Ky, Vl, ScndLmt = 300) {
    if (typeof Ky !== 'string' || typeof ScndLmt !== 'number') { return false; }

    this.Cchs.Dt[Ky] = { Vl: Vl, Dt: (new Date()).getTime(), ScndLmt: ScndLmt };

    return true;
  }
};
