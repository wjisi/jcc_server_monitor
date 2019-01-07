export const getClientHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

export const getClientWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}