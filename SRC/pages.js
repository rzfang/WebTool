const header = require('./component/header.tag');

module.exports = {
  '/colors': {
    title: 'Color Conside - Web Tool',
    keywords: '顏色, 色票, 樣式, color, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/colors.part.html',
      'component/footer.part.html' ]},
  '/convert': {
    title: 'Convert Table - Web Tool',
    keywords: '轉換, 換算, 查表, convert, list, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/convert.part.html',
      'component/footer.part.html' ]},
  '/datauri': {
    title: 'File to Data URI - Web Tool',
    keywords: '資料, 轉換, datauri, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/datauri.part.html',
      'component/footer.part.html' ]},
  '/datetime': {
    title: 'Datetime Transform - Web Tool',
    keywords: '時間格式轉換, datetime transform, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/datetime.part.html',
      'component/footer.part.html' ]},
  '/endecode': {
    title: 'String Encode/Decode - Web Tool',
    keywords: '編碼, 解碼, encoding, decoding, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/endecode.part.html',
      'component/footer.part.html' ]},
  '/ipv426': {
    title: 'IPv4 to v6 convert - Web Tool',
    keywords: 'ipv6, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/ipv426.part.html',
      'component/footer.part.html' ]},
  '/json': {
    title: 'JSON Edit - Web Tool',
    keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/json.part.html',
      'component/footer.part.html' ]},
  '/keycode': {
    title: 'Key Code Detect - Web Tool',
    keywords: '鍵盤代碼, keyboard, keyCode, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/keycode.part.html',
      'component/footer.part.html' ]},
  '/payment': {
    title: 'Payment - Web Tool',
    keywords: 'JSON, edit, 編輯, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      { type: 'riot', source: require('./component/payment.tag') },
      'component/footer.part.html' ]},
  '/post': {
    title: 'Form Post - Web Tool',
    keywords: '送出資料, form, post, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/post.part.html',
      'component/footer.part.html' ]},
  '/re': {
    title: 'Regula Expression - Web Tool',
    keywords: '正規表示式, RegExp, regular expression, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/re.part.html',
      'component/footer.part.html' ]},
  '/read': {
    title: 'Feed Read - Web Tool',
    keywords: '閱讀器, RSS, Atom, 網頁, 工具, Web, Tool',
    body: [
      { type: 'riot', source: header },
      { type: 'riot', source: require('./component/read.tag') },
      'component/footer.part.html' ]},
  '/window': {
    title: 'Window Open Script - Web Tool',
    keywords: '開新視窗, window.open, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    body: [
      { type: 'riot', source: header },
      'component/window.part.html',
      'component/footer.part.html' ]},
  default: {
    title: 'Web Tool',
    description: '程式開發輔助工具，尤其是網頁開發。program develop tool, especially in web design.',
    keywords: '網頁, 工具, 程式, 開發, Web, Tool, Program, Develop, HTML, Javascript, CSS',
    author: 'RZ Fang',
    favicon: '',
    css: [ '/resource/css.css' ],
    js: [
      'https://cdn.jsdelivr.net/riot/3.3/riot+compiler.min.js',
      '/resource/include.js' ],
    body: [
      { type: 'riot', source: header },
      'component/keycode.part.html',
      'component/footer.part.html' ]}
};
