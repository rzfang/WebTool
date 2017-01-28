const async = require('async'),
      fs = require('fs'),
      http = require('http'),
      riot = require('riot'),
      url = require('url')
      Is = require('../SRC/RZ-Js-Is');
const Pgs = require('../SRC/pages'), // page info object.
      Svcs = require('../SRC/services'); // service info object.
const RtPth = __dirname + '/../'; // root path.

function Log (Info, Lv = 2) {
  switch (Lv) {
    case 0:
    case 'error':
      console.error('\n---- [ERROR] ----');
      console.error(Info);
      break;

    case 1:
    case 'warn':
      console.warn('\n---- [WARN ] ----');
      console.warn(Info);
      break;

    case 2:
    case 'log':
      console.log('\n---- [LOG  ] ----');
      console.log(Info);
      break;

    case 3:
    case 'debug':
      console.debug('\n---- [DEBUG] ----');
      console.debug(Info);
      break;
  }
}

let Cache = {
  Cchs: { Fls: {}, Mdls: {} }, // caches.
  FileLoad: function (FlPth, Clbck) { // file path, callback (error code, result data).
    const This = this;

    if (this.Cchs.Fls[FlPth]) {
      Clbck(1, this.Cchs.Fls[FlPth]);
      Log(FlPth + '\nload file from the cache.');

      return;
    }

    fs.readFile(
      FlPth,
      'utf8',
      function (Err, FlStr) { // error, file string.
        if (Err) {
          Clbck(-1);
          Log(FlPth + '\ncan not found the content.', 'warn');

          return;
        }

        This.Cchs.Fls[FlPth] = FlStr;

        Clbck(0, FlStr);
        Log(FlPth + '\nload file and store into the cache.');
      });
  },
  ModuleRequire: function (FlPth, Clbck) {
    const This = this;

    if (this.Cchs.Mdls[FlPth]) {
      Clbck(0, this.Cchs.Mdls[FlPth]);

      return;
    }

    setTimeout(
      function () {
        let Mdl;

        try {
          Mdl = require(FlPth);
        }
        catch (Err) {
          Clbck(-1, Err.message);
          Log(Err.message, 'error');

          return;
        }

        This.Cchs.Mdls[FlPth] = Mdl;

        Clbck(0, Mdl);
        Log(FlPth + '\nrequire module and store into the cache.');
      },
      0);
  }
};

/*
  @ response object.
  @ file path.
  @ mine type. */
function StaticFileResponse (Rspns, FlPth, MmTp) {
  Cache.FileLoad(
    FlPth,
    function (Err, Str) {
      if (Err < 0) {
        Rspns.writeHead(404, {'Content-Type': MmTp});
        Rspns.write('can not found the content.');
      }
      else {
        Rspns.writeHead(200, {'Content-Type': MmTp});
        Rspns.write(Str);
      }

      Rspns.end();
    });
}

/*
  @ source file name,
  @ data for riot render.
  @ callback function. */
function RiotRender (Src, Data, Clbck) {
  Cache.ModuleRequire(
    RtPth + 'SRC/' + Src + '.tag',
    function (Err, Mdl) {
      if (Err < 0) {
        Clbck(-1, '<!-- can not load this module. -->');
        Log(Src + '\ncan not load this module.', 'error');

        return;
      }

      let MdlStr = riot.render(Mdl, Data || {});

      if (!MdlStr) {
        Clbck(-2, '<!-- can not render this module. -->');
        Log('can not render this module.', 'error');

        return;
      }

      MdlStr = MdlStr.replace(/> ?</g, '>\n<');

      Clbck(0, MdlStr);
    });
}

/*
  @ response object.
  @ path name. */
function Render (Rspns, PthNm) {
  let Pg = Object.assign({}, Pgs.default, Pgs[PthNm] || {}), // page info object.
      BdyFlPths = [], // body file paths.
      MdlIntlStp = { LdScrpts: '', MntScrpts: '' };  // module initial step., load scripts, mount scripts.

  if (!Pg.body) {
    Rspns.writeHead(404, {'Content-Type': 'text/html'});
    Rspns.write('can not found the content.');
    Rspns.end();
    Log(PthNm + '\ncan not found the body file for this path name.', 'warn');

    return;
  }

  async.map(
    Pg.body,
    function (Bd, Clbck) { // body info object|string, callback function.
      const Tp = typeof Bd;

      if (Tp === 'string') {
        Cache.FileLoad(
          RtPth + 'SRC/' + Bd,
          function (Err, FlStr) { // error, file string.
            if (Err < 0) {
              Clbck('FileLoad', '<!-- can not load this module. -->');
              Log(Bd + '\nload file failed.', 'error');

              return;
            }

            Clbck(null, FlStr);
          });

        return;
      }
      else if (Tp !== 'object' || !Bd.type || !Bd.source || typeof Bd.type !== 'string' || typeof Bd.source !== 'string') {
        Clbck('bad format', '<!-- can not load this module. -->');
        Log(JSON.stringify(Bd) + '\ncan not load this module.', 'error');

        return;
      }

      if (Bd.type === 'riot') {
        RiotRender(
          Bd.source,
          Bd.data || {},
          function (Rst, MdlStr) {
            if (Rst < 0) {
              Clbck('RiotRender', Rst);
              Log('can not do riot render.', 'error');

              return;
            }

            MdlIntlStp.LdScrpts += `<script type='riot/tag' src='${Bd.source}.tag'></script>\n`;
            MdlIntlStp.MntScrpts += `<script>riot.mount('${Bd.source}', '${Bd.source}');</script>\n`;

            Clbck(null, MdlStr);
          });

        return;
      }

      Clbck('Render', '<!-- can not render this module. -->');
      Log('do not know how to deal this module.', 'error');
    },
    function (Err, BdStrs) {
      let HdStr = ''; // head string.

      if (Err < 0) {
        Rspns.writeHead(404, {'Content-Type': 'text/html'});
        Rspns.write('can not found the content.');
        Rspns.end();
        Log(PthNm + ' ' + Pg.body + '\nload the body file failed.', 'warn');

        return;
      }

      if (Pg.title) {
        HdStr += '<title>' + Pg.title + "</title>\n";
      }

      if (Pg.description) {
        HdStr += "<meta name='description' content='" + Pg.description + "'/>\n";
      }

      if (Pg.keywords) {
        HdStr += "<meta name='keywords' content='" + Pg.keywords + "'/>\n";
      }

      if (Pg.author) {
        HdStr += "<meta name='author' content='" + Pg.author + "'/>\n";
      }

      if (Pg.favicon) {
        HdStr += "<link rel='icon' href='favicon.ico' type='" + Pg.favicon + "'/>\n";
      }

      if (Pg.css && Pg.css.length) {
        for (let i = 0; i < Pg.css.length; i++) {
          HdStr += "<link rel='stylesheet' type='text/css' href='" + Pg.css[i] + "'/>\n";
        }
      }

      if (Pg.js && Pg.js.length) {
        for (let i = 0; i < Pg.js.length; i++) {
          HdStr += "<script language='javascript' src='" + Pg.js[i] + "'></script>\n";
        }
      }

      Rspns.writeHead(200, {'Content-Type': 'text/html'});
      Rspns.write(
        "<!DOCTYPE HTML>\n<html>\n<head>\n<meta http-equiv='content-type' content='text/html; charset=utf-8'/>\n" +
        HdStr +
        "</head>\n<body>\n<div id='Base'>\n" +
        BdStrs.join('\n') +
        '</div>\n' +
        MdlIntlStp.LdScrpts + MdlIntlStp.MntScrpts +
        '</div>\n</body>\n</html>\n');
      Rspns.end();
    });
}

/*
  @ url info object.
  @ response object. */
function ServiceResponse (RqstInfo, Rspns) {
  let MdlNm = RqstInfo.URL.pathname.replace('/service/', ''); // module name.

  if (!Svcs[MdlNm]) {
    Rspns.writeHead(404, {'Content-Type': 'application/json'});
    Rspns.write('');
    Rspns.end();

    return;
  }

  Svcs[MdlNm](
    RqstInfo,
    function (Cd, RstObj) { // code, result object.
      if (Cd < 0) {
        Rspns.writeHead(404, {'Content-Type': 'application/json'});
        Rspns.write('');
        Rspns.end();

        return;
      }

      Rspns.writeHead(200, {'Content-Type': 'application/json'});

      if (!RstObj || !Is.Object(RstObj)) { Rspns.write(''); }
      else { Rspns.write(JSON.stringify(RstObj)); }

      Rspns.end();
    });
}

function Route (Rqst, Rspns) {
  let URLInfo = url.parse(Rqst.url),
      SttcFlChk = /[^\/]+\.(js|css|tag)$/.exec(URLInfo.pathname), // static file check.
      PstBdy = ''; // post body.

  Rqst.on(
    'data',
    function (Chnk) { // chunk.
      PstBdy += Chnk;

      // if (body.length > 1e6) { // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      //   request.connection.destroy(); // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      // }
    });

  Rqst.on(
    'end',
    function () {
      if (SttcFlChk && SttcFlChk.length && SttcFlChk.length > 1) {
        const MmTp = { js: 'application/javascript', css: 'text/css', tag: 'text/plain' }; // mine type.

        // this is a special case for old PHP page.
        if (URLInfo.pathname.indexOf('payment.tag') > -1) {
          return StaticFileResponse(Rspns, RtPth + 'WEB/www/resource/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
        }

        if (SttcFlChk[1] === 'tag') {
          return StaticFileResponse(Rspns, RtPth + 'SRC/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
        }

        return StaticFileResponse(Rspns, RtPth + 'WEB/www/resource/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
      }

      if (URLInfo.pathname.indexOf('/service/') === 0) {
        let RqstInfo = { URL: URLInfo, Bdy: {} },
            LpTms; // loop times.

        PstBdy = PstBdy.replace(/(\r\n)+/g, '\n').split('\n');
        LpTms = PstBdy.length - 1;

        for (let i = 1; i < LpTms; i += 3) {
          let Ky = PstBdy[i + 0].match(/name="(.+)"/), // key.
              Vl = PstBdy[i + 1]; // value.

          if (!Ky || !Is.Array(Ky) || Ky.length < 2) { continue; }

          RqstInfo.Bdy[Ky[1]] = Vl;
        }

        return ServiceResponse(RqstInfo, Rspns);
      }

      Render(Rspns, URLInfo.pathname);
    });
}

http.createServer(Route).listen(9001, '127.0.0.1');

Log('server has started.');
