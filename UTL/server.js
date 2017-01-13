let async = require('async'),
    fs = require('fs'),
    http = require('http'),
    // riot = require('riot'),
    url = require('url');
let Pgs = require('../SRC/pages'); // page info object.
let FlCch = {}, // file cache.
    RtPth = __dirname + '/../'; // root path.

/*
  @ file path.
  @ callback (error code, result data).
  */
function CacheOrFileLoad (FlPth, Clbck) {
  if (FlCch[FlPth]) {
    Clbck(1, FlCch[FlPth]);

    console.log('----');
    console.log(FlPth);
    console.log('load file from the cache.');

    return;
  }

  fs.readFile(FlPth, 'utf8', function (Err, FlStr) { // error, file string.
    if (Err) {
      Clbck(-1);

      console.log('----');
      console.log(FlPth);
      console.log('can not found the content.');

      return;
    }

    Clbck(0, FlStr);

    FlCch[FlPth] = FlStr;

    console.log('----');
    console.log(FlPth);
    console.log('load file and store into the cache.');
  });
}

function MultiCacheOrFileLoad (FlPths, Clbck) {
  let Tsks = [], // tasks.
      Cchs = []; // caches.

  function Load (FlPth, Clbck) {
    CacheOrFileLoad(
      FlPth,
      function (Err, Rst) {
        if (Err < 0) {
          console.log('----');
          console.log(FlPth);
          console.log('can not load the file.');
          Clbck('can not load the file.', '');

          return;
        }

        Clbck(null, Rst);
      });
  }

  if (!Array.isArray(FlPths)) {
    console.log('----');
    console.log('body files format is unexpected.');
    Clbck(-1, '');

    return;
  }

  Tsks = FlPths.map(function(FlPth) {
    return Load.bind(null, FlPth);
  });

  async.parallel(
    Tsks,
    function (Err, Rst) {
      if (Err) {
        console.log('----');
        console.log('load files failed.');
        Clbck(-2, null);

        return;
      }

      Clbck(0, Rst);
    });
}

/*
  @ response object.
  @ file path.
  @ mine type. */
function StaticFileResponse (Rspns, FlPth, MmTp) {
  CacheOrFileLoad(
    FlPth,
    function (Err, Str) {
      if (Err < 0) {
        Rspns.writeHead(404, {'Content-Type': MmTp});
        Rspns.write('can not found the content.');
      }
      else {
        Rspns.writeHead(Err === 1 ? 304 : 200, {'Content-Type': MmTp});
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
    Rspns.writeHead(404, {"Content-Type": "text/html"});
    Rspns.write('can not found the content.');
    Rspns.end();

    console.log('----');
    console.log(PthNm);
    console.log('can not found the body file for this path name.');

    return;
  }

  for (let i = 0; i < Pg.body.length; i++) {
    BdyFlPths.push(RtPth + 'SRC/' + Pg.body[i]);
  }

  MultiCacheOrFileLoad(
    BdyFlPths,
    function (Err, BdStrs) { // error, body strings.
      let HdStr = ''; // head string.

      if (Err < 0) {
        Rspns.writeHead(404, {"Content-Type": "text/html"});
        Rspns.write('can not found the content.');
        Rspns.end();

        console.log('----');
        console.log(PthNm + ' ' + Pg.body);
        console.log('load the body file failed.');

        return;
      }

      if (Pg.title) {
        HdStr += "<title>" + Pg.title + "</title>\n";
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

      Rspns.writeHead(200, {"Content-Type": "text/html"});
      Rspns.write("<!DOCTYPE HTML>\n<html>\n<head>\n");
      Rspns.write("<meta http-equiv='content-type' content='text/html; charset=utf-8'/>\n");
      Rspns.write(HdStr);
      Rspns.write("</head>\n<body>\n<div id='Base'>\n");
      Rspns.write(BdStrs.join("\n"));
      Rspns.write("</div>\n</body>\n</html>\n");
      Rspns.end();
    });
}

function Rout (Rqst, Rspns) {
  let URLInfo = url.parse(Rqst.url);
  let SttcFlChk = /[^\/]+\.(js|css|tag)$/.exec(URLInfo.pathname); // static file check.

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

console.log("server has started.");
