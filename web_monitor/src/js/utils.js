export const getClientHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

export const getClientWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export const getStyle = (key) => {
  let map = new Map([
    ["disconnected", "background:#fbded1"],
    ["connected", "background:#f2f3fd"],
    ["syncing", "background:#f2f3fd"],
    ["tracking", "background:#f2f3fd"],
    ["full", "background:#d9ffe9"],
    ["validating", "background:#f2f3fd"],
    ["proposing", "background:#d9ffe9"],
    ["error", "background:#fbded1"]
  ])
  return map.get(key);
}