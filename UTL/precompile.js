#!/usr/bin/node

'use strict';

var fs = require('fs'),
    sass = require('node-sass'),
    uglifyjs = require('uglify-js'),
    RtPth = __dirname + '/../';

function SCSS_CSS (FrmPth, ToPth)
{
  var Src = fs.readFileSync(FrmPth, 'utf8'), // 'Src' = Source.
      CSS = sass.renderSync({'data': Src}).css.toString().replace(/\n +/g, ' ').replace(/\n\n/g, "\n");

  fs.writeFileSync(ToPth, CSS);
}

function JsCompress (FrmPthA, ToPth)
{
  var Js = uglifyjs.minify(FrmPthA, {'mangle': true}).code;

  fs.writeFileSync(ToPth, Js);
}

SCSS_CSS(RtPth + 'SRC/css.scss', RtPth + 'WEB/www/resource/css.css');
SCSS_CSS(RtPth + 'SRC/pay.scss', RtPth + 'WEB/www/resource/pay.css');
JsCompress([RtPth + 'SRC/RZ-Js-Is.js', RtPth + 'SRC/RZ-Js-Obj.js'], RtPth + 'WEB/www/resource/include.js');
