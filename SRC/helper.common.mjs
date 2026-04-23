export function debounce (action, ms = 100) {
  let id = -1;

  return function debounceAction (...params) {
    clearTimeout(id);

    id = setTimeout(() => action(...params), ms);
  }
}

export function arrayUnique (array) {
  const uniqueArray = [];

  array.forEach(one => {
    if (uniqueArray.indexOf(one) < 0) {
      uniqueArray.push(one);
    }
  });

  return uniqueArray;
}

/*
  @ Date object, optional, default is now.
  @ format string, optional
  < date time string with format. */
export function dateToString (date, format = 'yyyy-mm-dd hh:ii') {
  if (!(date instanceof Date)) {
    date = new Date();
  }

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  switch (format.toLowerCase()) {
    case 'yyyy-mm':
      return `${year}-${month}`;

    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`;

    case 'yyyy-mm-dd hh:ii':
      return `${year}-${month}-${day} ${hour}:${minute}`;

    case 'yyyy-mm-dd hh:ii:ss':
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    case 'yyyymmddhhiiss':
      return `${year}${month}${day}${hour}${minute}${second}`;
  }

  return '???';
}
