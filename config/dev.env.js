var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URI: '"http://localhost:5000/jenkinsadmin/us-central1/api"',
})
