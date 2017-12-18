const discover = require('./discover')
const connect = require('./connect')

exports.getConnection = () => discover().then(device => connect(device))
