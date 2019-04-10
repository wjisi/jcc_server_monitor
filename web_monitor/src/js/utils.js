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
export const getMonth = (key) => {
  let map = new Map([
    ["Jan", "01"], ["Feb", "02"], ["Mar", "03"], ["Apr", "04"], ["May", "05"], ["Jun", "06"], ["Jul", "07"], ["Aug", "08"], ["Spt", "09"], ["Oct", "10"], ["Nov", "11"], ["Dec", "12"]
  ])
  return map.get(key);
}