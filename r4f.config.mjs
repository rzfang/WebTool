import path from 'path';
import { fileURLToPath } from 'url';

import feed from './SRC/service/feed.mjs';
// import payment from './SRC/component/payment.mjs';
import read from './SRC/component/read.mjs';
import transfer from './SRC/service/transfer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STTC_PTH = path.resolve(__dirname, './WEB');
const TMP_PTH = path.resolve(__dirname, './DAT/temp');

const DftPgRt = { // here should handle 404.
  title: 'Web Tool',
  description: '網頁工具。tools for web engineer life easier.',
  keywords: '網頁, 工具, Web, Tool',
  author: 'RZ Fang',
  favicon: '',
  css: [ './SRC/css.css' ],
  js: [
    { // for google ads.
      async: '',
      crossorigin: 'anonymous',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5447666979551687',
    },
  ],
};

const config = {
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
      keywords: '顏色, 色票, 樣式, color, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-colors.riot' }},
    '/convert': {
      ...DftPgRt,
      title: 'Convert Table - Web Tool',
      keywords: '轉換, 換算, 查表, convert, list, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-convert.riot' }},
    '/countdown': {
      ...DftPgRt,
      title: 'Countdown Notify - Web Tool',
      keywords: '倒數計時, 計時, countdown, 工具, Tool',
      body: { component: './SRC/component/page-countdown.riot' }},
    '/datauri': {
      ...DftPgRt,
      title: 'File to Data URI - Web Tool',
      keywords: '資料, 轉換, datauri, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-datauri.riot' }},
    '/datetime': {
      ...DftPgRt,
      title: 'Datetime Transform - Web Tool',
      keywords: '時間格式轉換, datetime transform, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-datetime.riot' }},
    '/endecode': {
      ...DftPgRt,
      title: 'String Encode/Decode - Web Tool',
      keywords: '編碼, 解碼, encoding, decoding, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-endecode.riot' }},
    '/ipv426': {
      ...DftPgRt,
      title: 'IPv4 to v6 convert - Web Tool',
      keywords: 'ipv6, 工具, 程式, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-ipv426.riot' }},
    '/json': {
      ...DftPgRt,
      title: 'JSON Edit - Web Tool',
      keywords: 'JSON, edit, 編輯, 工具, 開發, Web, Tool, Develop',
      js: [ 'https://unpkg.com/json5@^2.0.0/dist/index.min.js' ],
      body: { component: './SRC/component/page-json.riot' }},
    '/keycode': {
      ...DftPgRt,
      title: 'Key Code Detect - Web Tool',
      keywords: '鍵盤代碼, keyboard, keyCode, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-keycode.riot' }},
    '/payment': {
      ...DftPgRt,
      title: 'Payment - Web Tool',
      keywords: 'payment, 記帳, 編輯, 網頁, 工具, Web, Tool',
      body: {
        component: './SRC/component/page-payment.riot',
        // initialize: payment,
      }},
    '/post': {
      ...DftPgRt,
      title: 'Form Post - Web Tool',
      keywords: '送出資料, form, post, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-post.riot' }},
    '/re': {
      ...DftPgRt,
      title: 'Regula Expression - Web Tool',
      keywords: '正規表示式, RegExp, regular expression, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-re.riot' }},
    '/read': {
      ...DftPgRt,
      title: 'Feed Read - Web Tool',
      keywords: '閱讀器, RSS, Atom, 工具, Web, Tool',
      body: { component: './SRC/component/page-read.riot', initialize: read }},
    '/url': {
      ...DftPgRt,
      title: 'URL Compare - Web Tool',
      keywords: '網址比對, url, compare, 工具, Web, Tool',
      body: { component: './SRC/component/page-url.riot' }},
    '/window': {
      ...DftPgRt,
      title: 'Window Open Script - Web Tool',
      keywords: '開新視窗, window.open, 工具, 開發, Web, Tool, Develop',
      body: { component: './SRC/component/page-window.riot' }},
    '/': { // as keycode
      ...DftPgRt,
      body: { component: './SRC/component/page-keycode.riot' },
    },
  },
  service: {
    '/service/feed': {
      post: feed,
    },
    '/service/transfer': {
      post: transfer,
    },
  },
  route: [
    // ==== resource ====

    { // SEO files.
      path: /\/(favicon\.ico|robots\.txt|sitemap\.xml)/,
      type: 'resource',
      location: STTC_PTH,
    },
    {
      path: /css\.css$/,
      location: './SRC',
      nameOnly: true,
    },
  ],
};

export default config;
