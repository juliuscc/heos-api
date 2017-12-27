const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('system', defaultSendCommand)

exports.register_for_change_events = (connection, params) =>
	send(connection, 'register_for_change_events', params)

exports.check_account = connection => send(connection, 'check_account')

exports.sign_in = (connection, params) => send(connection, 'sign_in', params)

exports.sign_out = connection => send(connection, 'sign_out')

exports.heart_beat = connection => send(connection, 'heart_beat')

exports.reboot = connection => send(connection, 'reboot')

exports.prettify_json_response = (connection, params) =>
	send(connection, 'prettify_json_response', params)
