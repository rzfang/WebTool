const async = require('async'),
      compile = require('@riotjs/compiler').compile,
      path = require('path');

const Cch = require('./RZ-Nd-Cache'),
      Log = require('./RZ-Js-Log');

function Riot4ModulesCompile (FlPth, EdgPtrn, Then) {
  Cch.FileLoad(
    FlPth,
    (ErrCd, SrcCd, Dt) => { // error code, source code, cached date.
      if (ErrCd < 0) {
        Log('cache file load failed: ' + ErrCd + ' ' + FlPth, 'error');

        return Then(-1, '');
      }

      // ==== get all 'import ... from ...;' and remove them from source code. ====

      let Mdls = SrcCd.match(/import .+ from .+;\n/g) || [], // modules.
          Tsks = [];

      SrcCd = SrcCd.replace(/import .+ from .+;\n/g, '');

      Tsks = Mdls
        .filter((Itm, Idx) => Mdls.indexOf(Itm) === Idx)
        .map(Mdl => {
          const [ , Pth ] = Mdl.match(/import .+ from '(.+)';/);

          return Done => {
            Riot4ModulesCompile(
              path.dirname(FlPth) + '/' + Pth, // handle module path.
              EdgPtrn,
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
          let RsltMdls = Mdls || {}; // packed Js module codes.

          // ==== compile separated component, and combine them after parse. ====

          SrcCd.replace(/^\n+|\n+$/g, '') // clean head, tail end line characters.
            .split(EdgPtrn) // separate component codes by pattern.
            .map(Cd => {
              let Nm = Cd.substr(0, Cd.indexOf('>')).replace(/\n|<|>/g, ''), // component name.
                  NmPrts = Nm.match(/-\w/g); // name part.

              if (NmPrts) {
                NmPrts.map(Prt => { Nm = Nm.replace(Prt, Prt.substr(1).toUpperCase()); });
              }

              if (RsltMdls[Nm]) { return; }

              RsltMdls[Nm] = compile(Cd).code.replace('export default', 'const ' + Nm + ' ='); // trim 'export default'.
            }); // adjust compiled code to be ready for becoming a single Js module.

          Then(0, RsltMdls);
        });
    });
}

/* compile riot 4 component file with some more feature support.
  @ file path.
  @ type, can be 'node' or 'esm', default 'esm'.
  @ edge pattern.
  @ callback function (error code, code string). */
function Riot4Compile (FlPth, Tp = 'esm', EdgPtrn, Then) {
  Riot4ModulesCompile(
    FlPth,
    EdgPtrn,
    (ErrCd, Mdls) => {
      const Kys = Object.keys(Mdls);

      let RsltCd = Kys.map(Ky => Mdls[Ky]).join('\n\n');

      RsltCd += (Tp === 'node') ?
        ('\n\nmodule.exports.default = ' + Kys.pop() + ';\n') :
        ('\n\nexport default ' + Kys.pop() + ';\n');

      Then(1, RsltCd);
    });
}

module.exports = Riot4Compile;
