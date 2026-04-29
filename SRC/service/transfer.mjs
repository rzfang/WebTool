import cch from 'rzjs/node/cache.mjs';
import is from 'rzjs/is.mjs';

import { keyGenerate } from '../helper.mjs';

/*
  @ request object.
  @ response object.
  @ request info object. format as { Bd: { Ctn: '...' }}.
  @ callback function. */
export default function transfer (_request, _response, requestInfo, callback) {
  if (!requestInfo.Bd || !requestInfo.Bd.Ctn || !is.String(requestInfo.Bd.Ctn)) {
    return callback(-1, null);
  }

  const date = new Date();

  let key = keyGenerate(requestInfo.Bd.Ctn + date.getTime().toString());

  while(cch.Has(key)) {
    key = keyGenerate(key);
  }

  cch.Set(key, requestInfo.Bd.Ctn, 600);

  return callback(0, key);
}
