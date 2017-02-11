#!/usr/bin/node

'use strict';

var fs = require('fs'),
    sass = require('node-sass'),
    uglifyjs = require('uglify-js');

function SCSS_CSS (FrmPth, ToPth) {
  var Src = fs.readFileSync(FrmPth, 'utf8'), // 'Src' = Source.
      CSS = sass.renderSync({'data': Src}).css.toString().replace(/\n +/g, ' ').replace(/\n\n/g, "\n");

  fs.writeFileSync(ToPth, CSS);
}

function JsCompress (FrmPthA, ToPth) {
  var Js = uglifyjs.minify(FrmPthA, {  }).code;

  fs.writeFileSync(ToPth, Js);
}

SCSS_CSS('SRC/css.scss', 'WEB/www/resource/css.css');
SCSS_CSS('SRC/pay.scss', 'WEB/www/resource/pay.css');
JsCompress(
  [ 'SRC/RZ-Js-DOM.js',
    'SRC/RZ-Js-Is.js',
    'SRC/RZ-Js-Obj.js',
    'SRC/RZ-Js-RiotMixin.js',
    'SRC/RZ-Js.js' ],
  'WEB/www/resource/include.js');
