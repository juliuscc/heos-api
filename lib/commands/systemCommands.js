const { sendCommand, enumOnOrOff } = require('../utils/sendCommand')
const { bindResponse } = require('../bindEvent')

exports.register_for_change_event = (connection, enable) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'register_for_change_event', resolve)

		const message = `system/register_for_change_events?enable=${enumOnOrOff(
			enable
		)}`
		sendCommand(connection, message)
	})

exports.check_account = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'check_account', resolve)

		const message = 'system/check_account'
		sendCommand(connection, message)
	})

exports.sign_in = (connection, { username, password }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'sign_in', resolve)

		const message = `system/sign_in?un=${username}&pw=${password}`
		sendCommand(connection, message)
	})

exports.sign_out = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'sign_out', resolve)

		const message = 'system/sign_out'
		sendCommand(connection, message)
	})

exports.heart_beat = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'heart_beat', resolve)

		const message = 'system/heart_beat'
		sendCommand(connection, message)
	})

exports.reboot = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'reboot', resolve)

		const message = 'system/reboot'
		sendCommand(connection, message)
	})

exports.prettify_json_response = (connection, enable) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'prettify_json_response', resolve)

		const message = `system/prettify_json_response?enable=${enumOnOrOff(
			enable
		)}`
		sendCommand(connection, message)
	})
