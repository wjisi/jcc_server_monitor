'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  infoHost: '["192.168.66.254"]',
  infoPort: '1337'
})