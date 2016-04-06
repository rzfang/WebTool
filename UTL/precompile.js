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
// JsCompress([RtPth + 'SRC/api.js'], RtPth + 'WEB/www/resource/api.min.js');
