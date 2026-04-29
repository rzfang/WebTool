import crypto from 'crypto';

const codeMap = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq0Rr1Ss2Tt3Uu4Vv5Ww6Xx7Yy8Zz9'; // code map string.

/*
  @ seed.
  < an key string. */
export function keyGenerate (seed) {
  const hash = crypto.createHash('md5').update(seed).digest('base64'); // hash string.

  let key = '';

  for (let i = 0; i < hash.length; i += 4) {
    let char = hash.charCodeAt(i) + hash.charCodeAt(i + 1) + hash.charCodeAt(i + 2) + hash.charCodeAt(i + 3);

    char = parseInt(char, 10);
    key += codeMap.charAt(char % codeMap.length);
  }

  return key;
}
