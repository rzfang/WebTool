/* eslint no-console: 0 */

(function Z_Log_API () {
  function Log (Info, Lv = 2) {
    switch (Lv) {
      case 0:
      case 'error':
        console.error('\x1b[41m%s\x1b[0m', '\n[ERROR]');
        console.error(Info);

        break;

      case 1:
      case 'warn':
        console.warn('\x1b[41m%s\x1b[0m', '\n[WARN ]');
        console.warn(Info);

        break;

      case 2:
      case 'log':
        console.log('\x1b[42m%s\x1b[0m', '\n[ LOG ]');
        console.log(Info);

        break;

      case 3:
      case 'debug':
        console.log('\x1b[30m\x1b[47m%s\x1b[0m', '\n[DEBUG]');
        console.log(Info);

        break;
    }

    if (typeof Info === 'string') { return Info; }

    if (Info === null) { return 'null'; }

    return Info.toString();
  }

  if (typeof module !== 'undefined') { module.exports = Log; }
  else if (typeof window !== 'undefined') {
    if (!window.Z || typeof window.Z !== 'object') { window.Z = { Log: Log }; }
    else { window.Z.Log = Log; }
  }
})();