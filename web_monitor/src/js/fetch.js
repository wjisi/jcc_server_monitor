import axios from 'axios';

const fetch = axios.create({
  withCredentials: true,
  timeout: 30000
})

// server's url and port
const infoHost = process.env.infoHost
const infoPort = process.env.infoPort

const getInfoHost = () => {
  let uri = "";
  if (process.env.NODE_ENV === "production") {
    uri = "http://" + infoHost + ":" + infoPort;
  }
  return uri;
}

/** get a list of 10 nodes infomation
 * @param {number} page (Which page to get；the default = 1)
 * @param {String} state (Which state to show；the default = 'full')
 * @param {String} server (Which server's info to get；the default = "")
 *  */
export const getNodeList = async (data) => {
  let datas = {
    page: data.page || 1,
    state: data.state || '',
    server: data.server || '',
    server_ID: data.server_ID || ''
  }
  let res = await fetch({
    url: getInfoHost() + `/homepage`,
    method: "post",
    data: datas
  })
  return res;
}

/** get a list of 10 nodes infomation
 * @param {number} page (Which page to get；the default = 1)
 * @param {String} state (Which state to show；the default = 'full')
 * @param {String} start (Which server's info to get；the default = "")
 * @param {String} end (Which server's info to get；the default = "")
 *  */

export const getNodeHistoryList = async (data) => {
  let datas = {
    server: data.server || "",
    state: data.state || '',
    start: data.start || '',
    end: data.end || '',
    page: data.page || 1
  }
  let res = await fetch({
    url: getInfoHost() + `/history`,
    method: "post",
    data: datas
  })
  return res;
}