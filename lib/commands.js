const sendCommand = require('./utils/sendCommand').sendCommand
const systemCommands = require('./commands/systemCommands')

// System Commands
exports.register_for_change_events = systemCommands.register_for_change_events
exports.check_account = systemCommands.check_account
exports.sign_in = systemCommands.sign_in
exports.sign_out = systemCommands.sign_out
exports.heart_beat = systemCommands.heart_beat
exports.reboot = systemCommands.reboot
exports.prettify_json_response = systemCommands.prettify_json_response
