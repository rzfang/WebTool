let http = require('http'),
    fs = require('fs');
let FlCch = {}, // file cache.
    RtPth = __dirname + '/../'; // root path.

/*
  @ response object.
  @ file path.
  @ mine type. */
function StaticFileLoad (Rspns, FlPth, MmTp) {
  if (FlCch[FlPth]) {
    Rspns.writeHead(200, {'Content-Type': MmTp});
    Rspns.write(FlCch[FlPth]);
    Rspns.end();

    console.log('----');
    console.log(FlPth);
    console.log('load file from the cache.');

    return;
  }

  fs.readFile(FlPth, 'utf8', function (Err, FlStr) { // error, file string.
    if (Err) {
      Rspns.writeHead(404, {'Content-Type': MmTp});
      Rspns.write('can not found the content.');
    }

    Rspns.writeHead(200, {'Content-Type': MmTp});
    Rspns.write(FlStr);
    Rspns.end();

    FlCch[FlPth] = FlStr;

    console.log('----');
    console.log(FlPth);
    console.log('load file and store into the cache.');
  });
}

function Rout (Rqst, Rspns) {
  let SttcFlChk = /[^\/]+\.(js|css|tag|html)$/.exec(Rqst.url); // static file check.

  if (SttcFlChk && SttcFlChk.length && SttcFlChk.length > 1) {
    let MmTp = {
          js: 'application/javascript',
          css: 'text/css',
          tag: 'text/plain',
          html: 'text/html' }; // mine type.

    switch (SttcFlChk[1]) {
      case 'html':
        return StaticFileLoad(Rspns, RtPth + 'WEB/www/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
    }

    return StaticFileLoad(Rspns, RtPth + 'WEB/www/resource/' + SttcFlChk[0], MmTp[SttcFlChk[1]]);
  }

  Rspns.writeHead(404, {"Content-Type": "text/html"});
  Rspns.write('can not found the content.');
  Rspns.end();
}

http.createServer(Rout).listen(9001, '127.0.0.1');

console.log("server has started.");
