const async = require('async'),
      compile = require('@riotjs/compiler').compile,
      path = require('path');

const Cch = require('./RZ-Nd-Cache'),
      Log = require('./RZ-Js-Log');

function SourceCodeSplit (SrcCd) {
  if (!SrcCd) { return []; }

  let Cds = [];

  while (SrcCd.length > 0) {
    let Nm = SrcCd.match(/<([^/<>]+)>\n/); // name.

    if (!Nm || !Nm[1]) { break; }

    Nm = Nm[1];

    const StTg = `<${Nm}>`, // start tag.
          EndTg = `</${Nm}>`, // end tag.
          EndIdx = SrcCd.indexOf(EndTg) + EndTg.length; // end index.

    // ==== change name to be camel case. ====

    const NmChk = Nm.match(/-\w/);

    if (NmChk) { Nm = Nm.replace(NmChk[0], NmChk[0].substr(1).toUpperCase()); }

    // ====

    Cds.push({ Nm, Cd: SrcCd.substring(SrcCd.indexOf(StTg), EndIdx) });

    SrcCd = SrcCd.substr(EndIdx);
  }

  return Cds;
}

function Riot4ModulesCompile (FlPth, Then) {
  Cch.FileLoad(
    FlPth,
    (ErrCd, SrcCd, Dt) => { // error code, source code, cached date.
      if (ErrCd < 0) {
        Log('cache file load failed: ' + ErrCd + ' ' + FlPth, 'error');

        return Then(-1, '');
      }

      SrcCd = SrcCd.replace(/<!--[\s\S]+?-->/g, ''); // trim all HTML comments.

      // ==== get all 'import ... from ...;' and remove them from source code. ====

      let Mdls = SrcCd.match(/import .+ from .+;\n/g) || [], // modules.
          Tsks = [];

      SrcCd = SrcCd.replace(/import .+ from .+;\n/g, '');

      // ====

      // prepare import components compiling tasks.
      Tsks = Mdls
        .filter((Itm, Idx) => Mdls.indexOf(Itm) === Idx)
        .map(Mdl => {
          const [ , Pth ] = Mdl.match(/import .+ from '(.+)';/);

          return Done => {
            Riot4ModulesCompile(
              path.dirname(FlPth) + '/' + Pth, // handle module path.
              (ErrCd, RsltMdls) => {
                if (ErrCd < 0) {
                  Log('can not do Riot4ModulesCompile. error code: ' + ErrCd, 'error');

                  return Done({});
                }

                Done(RsltMdls);
              });
          };
        });

      async.parallel(
        Tsks,
        Mdls => {
          let RsltMdls = Mdls || {}; // packed Js module codes, modules.

          // ==== compile separated component, and combine them after parse. ====

          SourceCodeSplit(SrcCd).map(({ Nm, Cd }) => {
            if (RsltMdls[Nm]) { return ; }

            const Dt1 = new Date();

            RsltMdls[Nm] = compile(Cd).code.replace('export default', 'const ' + Nm + ' ='); // trim 'export default'.

            const Dt2 = new Date();

            console.log('---- 101 ---- ' + Nm + ' ----');
            console.log(Dt2.getTime() - Dt1.getTime());

          }); // adjust compiled code to be ready for becoming a single Js module.

          Then(0, RsltMdls);
        });
    });
}

/* compile riot 4 component file with some more feature support.
  @ file path.
  @ type, can be 'node' or 'esm', default 'esm'.
  @ callback function (error code, code string). */
function Riot4Compile (FlPth, Tp = 'esm', Then) {
  const CchKy = `${FlPth}-${Tp}`;

  if (Cch.Has(CchKy)) { return Then(1, Cch.Get(CchKy)); }

  Riot4ModulesCompile(
    FlPth,
    (ErrCd, Mdls) => {
      const Kys = Object.keys(Mdls);

      let RsltCd = Kys.map(Ky => Mdls[Ky]).join('\n\n');

      RsltCd += (Tp === 'node') ?
        ('\n\nmodule.exports.default = ' + Kys.pop() + ';\n') :
        ('\n\nexport default ' + Kys.pop() + ';\n');

      Then(0, RsltCd);
      Cch.Set(CchKy, RsltCd, 60 * 60 * 24);
    });
}

module.exports = Riot4Compile;
