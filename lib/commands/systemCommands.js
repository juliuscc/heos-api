const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('system', defaultSendCommand)

exports.register_for_change_events = (connection, enable) =>
	send(connection, 'register_for_change_events', { enable })

exports.check_account = connection => send(connection, 'check_account')

exports.sign_in = (connection, username, password) =>
	send(connection, 'sign_in', { un: username, pw: password })

exports.sign_out = connection => send(connection, 'sign_out')

exports.heart_beat = connection => send(connection, 'heart_beat')

exports.reboot = connection => send(connection, 'reboot')

exports.prettify_json_response = (connection, enable) =>
	send(connection, 'prettify_json_response', { enable })
