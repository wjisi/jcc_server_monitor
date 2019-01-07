'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  infoHosts: '["192.168.66.253"]',
  infoPort: '1373'
})