let async = require('async'),
    fs = require('fs'),
    http = require('http'),
    // riot = require('riot'),
    url = require('url');
let Pgs = require('../SRC/pages'); // page info object.
let RtPth = __dirname + '/../'; // root path.

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

let CacheFile = {
  FlCch: {}, // file cache.
  Load: function (FlPth, Clbck) { // file path, callback (error code, result data).
    let This = this;

    if (this.FlCch[FlPth]) {
      Clbck(1, this.FlCch[FlPth]);
      Log(FlPth + "\nload file from the cache.");

      return;
    }

    fs.readFile(
      FlPth,
      'utf8',
      function (Err, FlStr) { // error, file string.
        if (Err) {
          Clbck(-1);
          Log(FlPth + "\ncan not found the content.", 'warn');

          return;
        }

        This.FlCch[FlPth] = FlStr;

        Clbck(0, FlStr);
        Log(FlPth + "\nload file and store into the cache.");
      });
  },
  MultipleLoad: function (FlPths, Clbck) { // file paths, callback (error code, result data).
    let This = this,
        Tsks = []; // tasks.

    function Load (FlPth, Clbck) {
      This.Load(
        FlPth,
        function (Err, Rst) {
          if (Err < 0) {
            Clbck('can not load the file.', '');
            Log(FlPth + "\ncan not load the file.", 'warn');

            return;
          }

          Clbck(null, Rst);
        });
    }

    if (!Array.isArray(FlPths)) {
      Clbck(-1, '');
      Log('body files format is unexpected.', 'error');

      return;
    }

    Tsks = FlPths.map(function(FlPth) {
      return Load.bind(null, FlPth);
    });

    async.parallel(
      Tsks,
      function (Err, Rst) {
        if (Err) {
          Clbck(-2, null);
          Log('load files failed.', 'error');

          return;
        }

        Clbck(0, Rst);
      });
  }
};

/*
  @ response object.
  @ file path.
  @ mine type. */
function StaticFileResponse (Rspns, FlPth, MmTp) {
  CacheFile.Load(
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
  @ response object.
  @ path name. */
function Render (Rspns, PthNm) {
  let Pg = Object.assign({}, Pgs.default, Pgs[PthNm] || {}), // page info object.
      BdyFlPths = []; // body file paths.

  if (!Pg.body) {
    Rspns.writeHead(404, {'Content-Type': 'text/html'});
    Rspns.write('can not found the content.');
    Rspns.end();
    Log(PthNm + '\ncan not found the body file for this path name.', 'warn');

    return;
  }

  for (let i = 0; i < Pg.body.length; i++) {
    BdyFlPths.push(RtPth + 'SRC/' + Pg.body[i]);
  }

  CacheFile.MultipleLoad(
    BdyFlPths,
    function (Err, BdStrs) { // error, body strings.
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
      Rspns.write('<!DOCTYPE HTML>\n<html>\n<head>\n');
      Rspns.write("<meta http-equiv='content-type' content='text/html; charset=utf-8'/>\n");
      Rspns.write(HdStr);
      Rspns.write("</head>\n<body>\n<div id='Base'>\n");
      Rspns.write(BdStrs.join('\n'));
      Rspns.write('</div>\n</body>\n</html>\n');
      Rspns.end();
    });
}

function Rout (Rqst, Rspns) {
  let URLInfo = url.parse(Rqst.url),
      SttcFlChk = /[^\/]+\.(js|css|tag)$/.exec(URLInfo.pathname); // static file check.

  if (SttcFlChk && SttcFlChk.length && SttcFlChk.length > 1) {
    let MmTp = {
          js: 'application/javascript',
          css: 'text/css',
          tag: 'text/plain' }; // mine type.

    return StaticFileResponse(Rspns, RtPth + 'WEB/www/resource/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
  }

  Render(Rspns, URLInfo.pathname);
}

http.createServer(Rout).listen(9001, '127.0.0.1');

Log('server has started.');
