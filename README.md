WebTool
=======

A website to provide many developing, daily tool.

## This project uses
* HTML, Js, CSS
* [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
* [Riot](https://riot.js.org/)
* [Sass](https://sass-lang.com/)
* [UglifyJS](http://lisperator.net/uglifyjs/)

## Open community libraries that tools uses:
* [JSON5](https://json5.org/) for [JSON Edit](https://webtool.zii.tw/json)

## To be a HTTP server, this project also uses
* [nginx](https://nginx.org/)
* [PM2](http://pm2.keymetrics.io/)

P.S. for security reason, the nginx config file and SSL cert files don't join the git.

## Set up dev environment
```
npm i; ./UTL/precompile.js;
```

## Run dev server
```
npm run dev;
```