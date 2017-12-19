const discover = require('./discover')
const connect = require('./connect')
const commands = require('./commands')
const { bindEvent, unbindEvent } = require('./bindEvent')

exports.getConnection = () => discover().then(device => connect(device))

exports.commands = commands
exports.bindEvent = bindEvent
exports.unbindEvent = unbindEvent
