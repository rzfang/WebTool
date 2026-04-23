export function debounce (action, ms = 100) {
  let id = -1;

  return function debounceAction (...params) {
    clearTimeout(id);

    id = setTimeout(() => action(...params), ms);
  }
}
