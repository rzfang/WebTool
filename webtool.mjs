import App from 'rzjs/node/RiotHttp.js';
import path from 'path';
import { fileURLToPath } from 'url';

import feed from './SRC/service/feed.js';
import payment from './SRC/component/payment.js';
import read from './SRC/component/read.js';
import transfer from './SRC/service/transfer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STTC_PTH = path.resolve(__dirname, './WEB'),
      TMP_PTH = path.resolve(__dirname, './DAT/temp');

const DftPgRt = { // here should handle 404.
  title: 'Web Tool',
  description: '網頁工具。tools for web engineer life easier.',
  keywords: '網頁, 工具, Web, Tool',
  author: 'RZ Fang',
  favicon: '',
  css: [ '/css.css' ],
  js: [ '/include.js' ],
  body: { type: 'html', component: path.resolve(__dirname, './SRC/component/keycode.part.html') }
};

const RHC = {
  port: 9001,
  uploadFilePath: TMP_PTH,
  page: {
    // '/chat': { // v3
    //   ...DftPgRt,
    //   title: 'Moment Chat - Web Tool',
    //   keywords: '聊天, chat, websocket, Web, Tool, Program, Develop',
    //   body: [ 'header.tag', 'chat.tag', 'component/footer.part.html' ]},
    '/colors': {
      ...DftPgRt,
      title: 'Color Conside - Web Tool',
      keywords: '顏色, 色票, 樣式, color, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      css: [],
      js: [],
      body: { type: 'riot', component: './SRC/component/page-colors.riot' }},
    '/convert': {
      ...DftPgRt,
      title: 'Convert Table - Web Tool',
      keywords: '轉換, 換算, 查表, convert, list, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      css: [],
      js: [],
      body: { type: 'riot', component: './SRC/component/page-convert.riot' }},
    '/countdown': {
      ...DftPgRt,
      title: 'Countdown Notify - Web Tool',
      keywords: '倒數計時, 計時, countdown, 網頁, 工具, Tool',
      css: [],
      js: [],
      body: { type: 'riot', component: './SRC/component/page-countdown.riot' }},
    '/datauri': {
      ...DftPgRt,
      title: 'File to Data URI - Web Tool',
      keywords: '資料, 轉換, datauri, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      css: [],
      js: [],
      // body: { type: 'html', component: path.resolve(__dirname, './SRC/component/datauri.part.html') }},
      body: { type: 'riot', component: './SRC/component/page-datauri.riot' }},
    '/datetime': {
      ...DftPgRt,
      title: 'Datetime Transform - Web Tool',
      keywords: '時間格式轉換, datetime transform, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/datetime.part.html') }},
    '/endecode': {
      ...DftPgRt,
      title: 'String Encode/Decode - Web Tool',
      keywords: '編碼, 解碼, encoding, decoding, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/endecode.part.html') }},
    '/ipv426': {
      ...DftPgRt,
      title: 'IPv4 to v6 convert - Web Tool',
      keywords: 'ipv6, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/ipv426.part.html') }},
    '/json': {
      ...DftPgRt,
      title: 'JSON Edit - Web Tool',
      keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/json.part.html') }},
    '/keycode': {
      ...DftPgRt,
      title: 'Key Code Detect - Web Tool',
      keywords: '鍵盤代碼, keyboard, keyCode, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/keycode.part.html') }},
    // '/payment': { // v3
    //   ...DftPgRt,
    //   title: 'Payment - Web Tool',
    //   keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    //   js: [ '/include.js', '/payment.tag', '/coverbox.tag' ],
    //   body: [
    //     'header.tag',
    //     { type: 'riot', component: './component/payment.tag', initialize: require('./component/payment') },
    //     'component/footer.part.html' ]},
    // '/payment2': {
    //   ...DftPgRt,
    //   title: 'Payment - Web Tool',
    //   keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    //   js: [ 'include.js', 'hydrate.js' ],
    //   body: { type: 'riot', component: './SRC/component/payment.riot', initialize: payment }},
    '/post': {
      ...DftPgRt,
      title: 'Form Post - Web Tool',
      keywords: '送出資料, form, post, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/post.part.html') }},
    '/re': {
      ...DftPgRt,
      title: 'Regula Expression - Web Tool',
      keywords: '正規表示式, RegExp, regular expression, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/re.part.html') }},
    '/read': {
      ...DftPgRt,
      title: 'Feed Read - Web Tool',
      keywords: '閱讀器, RSS, Atom, 網頁, 工具, Web, Tool',
      js: [ '/include.js', 'hydrate.js' ],
      body: { type: 'riot', component: './SRC/component/read.riot', initialize: read }},
    '/window': {
      ...DftPgRt,
      title: 'Window Open Script - Web Tool',
      keywords: '開新視窗, window.open, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: { type: 'html', component: path.resolve(__dirname, './SRC/component/window.part.html') }},
    '/': DftPgRt
  },
  service: {
    pathPatterm: /^\/service\//,
    case: {
      '/service/feed': {
        post: feed
      },
      '/service/transfer': {
        post: transfer
      }
    }
  },
  route: [
    // ==== resource ====

    // node_modules

    { // SEO files.
      path: /\/(favicon\.ico|robots\.txt|sitemap\.xml)/,
      type: 'resource',
      location: STTC_PTH
    },
    { // resource: Js, CSS.
      path: /\.(css|js)$/,
      type: 'resource',
      location: STTC_PTH
    },
    { // riot component js compiled in runtime.
      path: /\.riot$/,
      type: 'riot4js',
      location: './component'
    }
  ]
};

App.Build(RHC, 'mjs').Initialize(RHC).Run();
// App.Build(RHC, 'mjs');
