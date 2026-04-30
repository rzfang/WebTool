import cch from 'rzjs/node/cache.mjs';

export default function read (request, urlInfo, callback) {
  let result = [];

  if (!urlInfo || !urlInfo.query || urlInfo.query.indexOf('t=') < 0) {
    return callback(1, result);
  }

  const reResult = urlInfo.query.match(/t=([^&]+)/); // regular expression result.

  if (!reResult || reResult.length < 2) {
    return callback(2, result);
  }

  const tranferingKey = reResult[1];

  if (!cch.has(tranferingKey)) {
    return callback(3, result);
  }

  result = cch.get(tranferingKey)?.split('_|_').map(one => ({ FdUrl: one, HsBnLdd: false })) || [];

  request.riotPlugin.StoreSet('FEEDS', () => result);
  callback(0, result);
}
