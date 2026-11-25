import path from 'path';
import { fileURLToPath } from 'url';

import feed from './SRC/service/feed.mjs';
// import payment from './SRC/component/payment.mjs';
import read from './SRC/component/read.mjs';
import transfer from './SRC/service/transfer.mjs';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const STTC_PTH = path.resolve(dirname, './WEB');
const TMP_PTH = path.resolve(dirname, './DAT/temp');

const defaultPageRoute = { // here should handle 404.
  title: 'Web Tool',
  favicon: '',
  meta: [
    { name: 'author', content: 'RZ Fang' },
    { name: 'description', content: '網頁工具。tools for web engineer life easier.' },
    { name: 'keywords', content: '網頁, 工具, Web, Tool' },
  ],
  css: [ './SRC/css.css' ],
  js: [],
};

const config = {
  port: 9001,
  uploadFilePath: TMP_PTH,
  page: {
    // '/chat': { // v3
    //   ...defaultPageRoute,
    //   title: 'Moment Chat - Web Tool',
    //   keywords: '聊天, chat, websocket, Web, Tool, Program, Develop',
    //   body: [ 'header.tag', 'chat.tag', 'component/footer.part.html' ]},
    '/colors': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '顏色, 色票, 樣式, color, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Color Conside - Web Tool',
      body: { component: './SRC/component/page-colors.riot' },
    },
    '/convert': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '轉換, 換算, 查表, convert, list, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Convert Table - Web Tool',
      body: { component: './SRC/component/page-convert.riot' },
    },
    '/countdown': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '倒數計時, 計時, countdown, 工具, Tool' },
      ],
      title: 'Countdown Notify - Web Tool',
      body: { component: './SRC/component/page-countdown.riot' },
    },
    '/datauri': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '資料, 轉換, datauri, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'File to Data URI - Web Tool',
      body: { component: './SRC/component/page-datauri.riot' },
    },
    '/datetime': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '時間格式轉換, datetime transform, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Datetime Transform - Web Tool',
      body: { component: './SRC/component/page-datetime.riot' },
    },
    '/endecode': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '編碼, 解碼, encoding, decoding, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'String Encode/Decode - Web Tool',
      body: { component: './SRC/component/page-endecode.riot' },
    },
    '/ipv426': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: 'ipv6, 工具, 程式, 開發, Web, Tool, Develop' },
      ],
      title: 'IPv4 to v6 convert - Web Tool',
      body: { component: './SRC/component/page-ipv426.riot' },
    },
    '/json': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: 'JSON, edit, 編輯, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'JSON Edit - Web Tool',
      body: { component: './SRC/component/page-json.riot' },
    },
    '/keycode': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '鍵盤代碼, keyboard, keyCode, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Key Code Detect - Web Tool',
      body: { component: './SRC/component/page-keycode.riot' },
    },
    '/payment': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: 'payment, 記帳, 編輯, 網頁, 工具, Web, Tool' },
      ],
      title: 'Payment - Web Tool',
      body: {
        component: './SRC/component/page-payment.riot',
        // initialize: payment,
      },
    },
    '/post': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '送出資料, form, post, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Form Post - Web Tool',
      body: { component: './SRC/component/page-post.riot' },
    },
    '/re': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '正規表示式, RegExp, regular expression, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Regula Expression - Web Tool',
      body: { component: './SRC/component/page-re.riot' },
    },
    '/read': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '閱讀器, RSS, Atom, 工具, Web, Tool' },
      ],
      title: 'Feed Read - Web Tool',
      body: { component: './SRC/component/page-read.riot', initialize: read },
    },
    // '/transmit': {
    //   ...defaultPageRoute,
    //   meta: [
    //     ...defaultPageRoute.meta,
    //     { name: '', content: '' },
    //   ],
    //   title: 'File Transmit - Web Tool',
    //   body: { component: './SRC/component/page-transmit.riot' },
    // },
    '/url': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '網址比對, url, compare, 工具, Web, Tool' },
      ],
      title: 'URL Compare - Web Tool',
      body: { component: './SRC/component/page-url.riot' },
    },
    '/window': {
      ...defaultPageRoute,
      meta: [
        ...defaultPageRoute.meta,
        { name: 'keywords', content: '開新視窗, window.open, 工具, 開發, Web, Tool, Develop' },
      ],
      title: 'Window Open Script - Web Tool',
      body: { component: './SRC/component/page-window.riot' },
    },
    '/': { // as keycode
      ...defaultPageRoute,
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
