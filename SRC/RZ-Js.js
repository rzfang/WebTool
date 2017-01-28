(function Z_API () {
  var Z;

  /* Pad Characters into a string.
    'Str' = String.
    'Lth' = Length. minimum length of string should be padding to.
    'Chr' = Character. optional, default '0';
    'Sd' = Side. optional, default 'l'. 'l'|'L': left padding, 'r'|'R': right padding.
    Return: string after handle. */
  function CharPad (Str, Lth, Chr, Sd) {
    if (typeof Str !== 'string') { Str = Str.toString(); }

    if (typeof Lth !== 'number' || Lth < 2 || Str.length >= Lth) { return Str; }

    if (typeof Chr !== 'string' || Chr.length === 0) { Chr = '0'; }

    if (typeof Sd !== 'string') { Sd = 'l'; }
    else {
      Sd = Sd.toLowerCase();

      if (Sd !== 'l' && Sd !== 'r') { return Str; }
    }

    var PN = Lth - Str.length, // 'PN' = Padding Number.
        PS = ''; // 'PS' = Padding String.

    for (PS = ''; PS.length < PN; PS += Chr);

    if (Sd === 'l') { Str = PS + Str; }
    else { Str += PS; }

    return Str;
  }

  /* get a Data String by giving Second number.
    'Scd' = Second, float to include millisecond.
    'Fmt' = Format.
      0: YYYY-MM-DD HH:II:SS.CCC+ZZ. (default)
      1: YYYY-MM-DD HH:II:SS.CCC+ZZ (W).
      2: YYYYMMDDHHIISS.
      3: YYYY-MM-DD.
      4: YYYYMMDD.
    Return: datatime string.
    Need: CharPad(). */
  function Second2Datetime (Scd, Fmt) {
    var Dt = new Date(Scd * 1000), // 'Dt' = Date.
        DtStr = '',
        TZOM = Dt.getTimezoneOffset(), // 'TZOM' = Time Zone Offset Minute.
        TZOH = TZOM / 60; // 'TZOH' = Time Zone Offset Hour.

    Scd = parseFloat(Scd);

    if (typeof Fmt !== 'number') { Fmt = 0; }

    Fmt = parseInt(Fmt, 10);
    TZOH = (TZOH > 0 ? '-' : '+') + CharPad(Math.abs(TZOH), 2);

    switch (Fmt) {
      case 1:
        Dt.setMinutes(Dt.getMinutes() - TZOM);

        DtStr = Dt.toJSON().substr(0, 19).replace('T', ' ');

        break;

      case 2:
        DtStr = '' + Dt.getFullYear() + CharPad((Dt.getMonth() + 1), 2) + CharPad(Dt.getDate(), 2) +
                CharPad(Dt.getHours(), 2) + CharPad(Dt.getMinutes(), 2) + CharPad(Dt.getSeconds(), 2);

        break;

      case 3:
        DtStr = Dt.getFullYear() + '-' + CharPad((Dt.getMonth() + 1), 2) + '-' + CharPad(Dt.getDate(), 2);

        break;

      case 4:
        DtStr = Dt.getFullYear() + CharPad((Dt.getMonth() + 1), 2) + CharPad(Dt.getDate(), 2);

        break;

      case 0:
      default:
        DtStr = Dt.getFullYear() + '-' + CharPad((Dt.getMonth() + 1), 2) + '-' + CharPad(Dt.getDate(), 2) + ' ' +
                CharPad(Dt.getHours(), 2) + ':' + CharPad(Dt.getMinutes(), 2) + ':' + CharPad(Dt.getSeconds(), 2) + '.' +
                CharPad(Dt.getMilliseconds(), 3) + TZOH;
    }

    return DtStr;
  }

  Z = {
    CharPad: CharPad,
    Second2Datetime: Second2Datetime
  };

  if (typeof module !== 'undefined') { module.exports = Z; }
  else if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = Z; }
    else {
      for (var i in Z) {
        if (Z.hasOwnProperty(i)) { window.Z[i] = Z[i]; }
      }
    }
  }
})();