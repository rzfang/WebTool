const fs = require('fs');

module.exports = {
  Cchs: { Fls: {}, Dt: {} }, // caches, data.
  /*
    @ file path.
    @ callback (error code, result data). */
  FileLoad: function (FlPth, Clbck) {
    const This = this;

    if (this.Cchs.Fls[FlPth] && this.Cchs.Fls[FlPth]['Str']) { return Clbck(1, this.Cchs.Fls[FlPth]['Str']); }

    fs.readFile(
      FlPth,
      'utf8',
      function (Err, FlStr) { // error, file string.
        if (Err) { return Clbck(-1); }

        This.Cchs.Fls[FlPth] = { Dt: (new Date()).getTime(), Str: FlStr };

        Clbck(0, FlStr);
      });
  },
  /*
    @ key name.
    @ date number. */
  IsFileCached: function (Ky, Dt) {
    let FlInfo = this.Cchs.Fls && this.Cchs.Fls[Ky] || null;

    if (!FlInfo || !FlInfo.Dt || !FlInfo.Str) { return false; }

    if ((typeof Dt !== 'number') || (Dt < FlInfo.Dt)) { return false; }

    return true;
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
