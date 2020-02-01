const path = require('path');

const STTC_PTH = path.resolve(__dirname, '../WEB'),
      TMP_PTH = path.resolve(__dirname, '../DAT/temp');

const DftPgRt = { // here should handle 404.
  title: 'Web Tool',
  description: '網頁工具。tools for web engineer life easier.',
  keywords: '網頁, 工具, Web, Tool',
  author: 'RZ Fang',
  favicon: '',
  css: [ '/css.css' ],
  js: [ '/include.js' ],
  body: [ 'header.tag', 'component/keycode.part.html', 'component/footer.part.html' ]
};

module.exports = {
  port: 9001,
  cdn: {
    riot3: 'https://cdn.jsdelivr.net/npm/riot@3.13/riot+compiler.min.js',
    riot4: 'https://cdn.jsdelivr.net/npm/riot@4.8/riot.min.js'
  },
  uploadFilePath: TMP_PTH,
  page: {
    '/chat': { // v3
      ...DftPgRt,
      title: 'Moment Chat - Web Tool',
      keywords: '聊天, chat, websocket, Web, Tool, Program, Develop',
      body: [ 'header.tag', 'chat.tag', 'component/footer.part.html' ]},
    '/colors': {
      ...DftPgRt,
      title: 'Color Conside - Web Tool',
      keywords: '顏色, 色票, 樣式, color, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/colors.part.html', 'component/footer.part.html' ]},
    '/convert': {
      ...DftPgRt,
      title: 'Convert Table - Web Tool',
      keywords: '轉換, 換算, 查表, convert, list, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/convert.part.html', 'component/footer.part.html' ]},
    '/countdown': {
      ...DftPgRt,
      title: 'Countdown Notify - Web Tool',
      keywords: '倒數計時, 計時, countdown, 網頁, 工具, Tool',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/countdown.part.html', 'component/footer.part.html' ]},
    '/datauri': {
      ...DftPgRt,
      title: 'File to Data URI - Web Tool',
      keywords: '資料, 轉換, datauri, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/datauri.part.html', 'component/footer.part.html' ]},
    '/datetime': {
      ...DftPgRt,
      title: 'Datetime Transform - Web Tool',
      keywords: '時間格式轉換, datetime transform, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/datetime.part.html', 'component/footer.part.html' ]},
    '/endecode': {
      ...DftPgRt,
      title: 'String Encode/Decode - Web Tool',
      keywords: '編碼, 解碼, encoding, decoding, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/endecode.part.html', 'component/footer.part.html' ]},
    '/ipv426': {
      ...DftPgRt,
      title: 'IPv4 to v6 convert - Web Tool',
      keywords: 'ipv6, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/ipv426.part.html', 'component/footer.part.html' ]},
    '/json': {
      ...DftPgRt,
      title: 'JSON Edit - Web Tool',
      keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/json.part.html', 'component/footer.part.html' ]},
    '/keycode': {
      ...DftPgRt,
      title: 'Key Code Detect - Web Tool',
      keywords: '鍵盤代碼, keyboard, keyCode, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/keycode.part.html', 'component/footer.part.html' ]},
    '/payment': {
      ...DftPgRt,
      title: 'Payment - Web Tool',
      keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [
        './component/header.riot',
        { component: './component/payment.riot', initialize: require('./component/payment') },
        'component/footer.part.html' ]},
    '/post': {
      ...DftPgRt,
      title: 'Form Post - Web Tool',
      keywords: '送出資料, form, post, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/post.part.html', 'component/footer.part.html' ]},
    '/re': {
      ...DftPgRt,
      title: 'Regula Expression - Web Tool',
      keywords: '正規表示式, RegExp, regular expression, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/re.part.html', 'component/footer.part.html' ]},
    '/read': {
      ...DftPgRt,
      title: 'Feed Read - Web Tool',
      keywords: '閱讀器, RSS, Atom, 網頁, 工具, Web, Tool',
      js: [ '/include.js', 'hydrate.js' ],
      body: [
        './component/header.riot',
        { component: './component/read.riot', initialize: require('./component/read') },
        'component/footer.part.html' ]},
    '/window': {
      ...DftPgRt,
      title: 'Window Open Script - Web Tool',
      keywords: '開新視窗, window.open, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
      js: [ 'include.js', 'hydrate.js' ],
      body: [ './component/header.riot', 'component/window.part.html', 'component/footer.part.html' ]},
    '/': DftPgRt
  },
  service: {
    pathPatterm: /^\/service\//,
    case: {
      '/service/feed': {
        post: require('./service/feed')
      },
      '/service/transfer': {
        post: require('./service/transfer')
      }
    }
  },
  route: [
    // ==== resource ====

    // node_modules
    {
      path: /hydrate\.js$/,
      type: 'resource',
      location: '../node_modules/@riotjs/hydrate'
    },

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
    { // resource: Riot tag.
      path: /\.tag$/,
      type: 'resource',
      location: './component'
    },
    { // riot component js compiled in runtime.
      path: /\.riot$/,
      type: 'riot4js',
      location: './component'
    }
  ]
};
