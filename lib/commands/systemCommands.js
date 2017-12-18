const { sendCommand, enumOnOrOff } = require('../utils/sendCommand')

exports.register_for_change_event = (connection, enable) => {
	const message = `system/register_for_change_events?enable=${enumOnOrOff(
		enable
	)}`
	sendCommand(connection, message)
}

exports.check_account = connection => {
	const message = 'system/check_account'
	sendCommand(connection, message)
}

exports.sign_in = (connection, { username, password }) => {
	const message = `system/sign_in?un=${username}&pw=${password}`
	sendCommand(connection, message)
}

exports.sign_out = connection => {
	const message = 'system/sign_out'
	sendCommand(connection, message)
}

exports.heart_beat = connection => {
	const message = 'system/heart_beat'
	sendCommand(connection, message)
}

exports.reboot = connection => {
	const message = 'system/reboot'
	sendCommand(connection, message)
}

exports.prettify_json_response = (connection, enable) => {
	const message = `system/prettify_json_response?enable=${enumOnOrOff(enable)}`
	sendCommand(connection, message)
}
