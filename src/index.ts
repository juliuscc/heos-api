import { connect, discoverAndConnect } from './connect'
// const commands = require('./commands/commands')
const { bindEvent, unbindEvent } = require('./eventHandler')
// const enums = require('./enums')

exports.discoverAndCreateConnection = discoverAndConnect
exports.createConnection = connect
// exports.commands = commands
// exports.bindEvent = bindEvent
// exports.unbindEvent = unbindEvent

// exports.constants = enums

exports.documentation_download_link =
	'http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf'
