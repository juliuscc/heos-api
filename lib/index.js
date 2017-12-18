const discover = require('/discover')
const connect = require('/connect')

exports.connect = discover().then(info => connect(info))
