const discover = require('./discover')
const connect = require('./connect')
const commands = require('./commands')

exports.getConnection = () => discover().then(device => connect(device))

exports.commands = commands
