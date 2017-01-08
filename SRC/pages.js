module.exports = {
  '/re': {
    title: 'Regula Expression - Web Tool',
    keywords: '正規表示式, RegExp, regular expression, 網頁, 工具, 程式, 開發, Web, Tool, Program, Develop',
    js: [
      '/resource/z.min.js',
      'https://cdn.jsdelivr.net/riot/3.0/riot.min.js'
    ],
    body: [
      'header.part.html',
      're.part.html',
      'footer.part.html'
    ]
  },
  default: {
    title: 'Web Tool',
    description: '程式開發輔助工具，尤其是網頁開發。program develop tool, especially in web design.',
    keywords: '網頁, 工具, 程式, 開發, Web, Tool, Program, Develop, HTML, Javascript, CSS',
    author: 'RZ Fang',
    favicon: '',
    css: ['/resource/css.css'],
    js: [],
    body: []
  }
}