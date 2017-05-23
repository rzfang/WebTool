module.exports = {
  '/colors': {
    title: 'Color Conside - Web Tool',
    keywords: '顏色, 色票, 樣式, color, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'colors.part.html',
      'footer.part.html' ]},
  '/convert': {
    title: 'Convert Table - Web Tool',
    keywords: '轉換, 換算, 查表, convert, list, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'convert.part.html',
      'footer.part.html' ]},
  '/countdown': {
    title: 'Countdown - Web Tool',
    keywords: '倒數計時, 計時, countdown, 網頁, 工具, Tool',
    body: [
      'header.tag',
      'countdown.part.html',
      'footer.part.html' ]},
  '/datauri': {
    title: 'File to Data URI - Web Tool',
    keywords: '資料, 轉換, datauri, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'datauri.part.html',
      'footer.part.html' ]},
  '/datetime': {
    title: 'Datetime Transform - Web Tool',
    keywords: '時間格式轉換, datetime transform, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'datetime.part.html',
      'footer.part.html' ]},
  '/endecode': {
    title: 'String Encode/Decode - Web Tool',
    keywords: '編碼, 解碼, encoding, decoding, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'endecode.part.html',
      'footer.part.html' ]},
  '/ipv426': {
    title: 'IPv4 to v6 convert - Web Tool',
    keywords: 'ipv6, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'ipv426.part.html',
      'footer.part.html' ]},
  '/json': {
    title: 'JSON Edit - Web Tool',
    keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'json.part.html',
      'footer.part.html' ]},
  '/keycode': {
    title: 'Key Code Detect - Web Tool',
    keywords: '鍵盤代碼, keyboard, keyCode, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'keycode.part.html',
      'footer.part.html' ]},
  '/payment': {
    title: 'Payment - Web Tool',
    keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'payment.tag',
      'footer.part.html' ]},
  '/post': {
    title: 'Form Post - Web Tool',
    keywords: '送出資料, form, post, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'post.part.html',
      'footer.part.html' ]},
  '/re': {
    title: 'Regula Expression - Web Tool',
    keywords: '正規表示式, RegExp, regular expression, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      're.part.html',
      'footer.part.html' ]},
  '/read': {
    title: 'Feed Read - Web Tool',
    keywords: '閱讀器, RSS, Atom, 網頁, 工具, Web, Tool',
    js: [
      'https://cdn.jsdelivr.net/riot/3.3/riot+compiler.min.js',
      '/include.js',
      '/coverbox.tag' ],
    body: [
      'header.tag',
      require('./component/read'),
      'footer.part.html' ]},
  '/window': {
    title: 'Window Open Script - Web Tool',
    keywords: '開新視窗, window.open, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      'header.tag',
      'window.part.html',
      'footer.part.html' ]},
  default: {
    title: 'Web Tool',
    description: '網頁工具。tools for life easier.',
    keywords: '網頁, 工具, Web, Tool',
    author: 'RZ Fang',
    favicon: '',
    css: [ '/css.css' ],
    js: [
      'https://cdn.jsdelivr.net/riot/3.3/riot+compiler.min.js',
      '/include.js' ],
    body: [
      'header.tag',
      'keycode.part.html',
      'footer.part.html' ]}
};