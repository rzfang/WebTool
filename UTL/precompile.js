#!/usr/bin/node

'use strict';

const fs = require('fs'),
      sass = require('node-sass'),
      terser = require('terser');

function SCSS_CSS (FrmPth, ToPth) {
  const Src = fs.readFileSync(FrmPth, 'utf8'), // 'Src' = Source.
        CSS = sass.renderSync({'data': Src}).css.toString().replace(/\n +/g, ' ').replace(/\n\n/g, "\n");

  fs.writeFileSync(ToPth, CSS);
}

function JsCompress (FrmPthA, ToPth) {
  let Srcs = [], // sources.
      Rst;

  for (let i = 0; i < FrmPthA.length; i++) {
    Srcs.push(fs.readFileSync(FrmPthA[i], 'utf8'));
  }

  Rst = terser.minify(Srcs, {});

  if (Rst.error) { return console.log(Rst.error); }

  fs.writeFileSync(ToPth, Rst.code);
}

SCSS_CSS('SRC/css.scss', 'WEB/css.css');
JsCompress(
  [ 'SRC/RZ-Js-DOM.js',
    'SRC/RZ-Js-Is.js',
    'SRC/RZ-Js-Obj.js' ],
  'WEB/include.js');
