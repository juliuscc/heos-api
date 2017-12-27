const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('system', defaultSendCommand)

// register_for_change_events
exports.register_for_change_events = (connection, params) =>
	send(connection, 'register_for_change_events', params)

// check_account
exports.check_account = connection => send(connection, 'check_account')

// sign_in
exports.sign_in = (connection, params) => send(connection, 'sign_in', params)

// sign_out
exports.sign_out = connection => send(connection, 'sign_out')

// heart_beat
exports.heart_beat = connection => send(connection, 'heart_beat')

// reboot
exports.reboot = connection => send(connection, 'reboot')

// prettify_json_response
exports.prettify_json_response = (connection, params) =>
	send(connection, 'prettify_json_response', params)
