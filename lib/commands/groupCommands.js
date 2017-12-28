const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('group', defaultSendCommand)

exports.get_groups = connection => send(connection, 'get_groups')

exports.get_group_info = (connection, params) =>
	send(connection, 'get_group_info', params)

exports.set_group = (connection, params) =>
	send(connection, 'set_group', params)

// get_volume // Different name
exports.get_group_volume = (connection, params) =>
	send(connection, 'get_volume', params)

// set_volume // Different name
exports.set_group_volume = (connection, params) =>
	send(connection, 'set_volume', params)

// volume_up // Different name
exports.group_volume_up = (connection, params) =>
	send(connection, 'volume_up', params)

// volume_down // Different name
exports.group_volume_down = (connection, params) =>
	send(connection, 'volume_down', params)

// get_mute // Different name
exports.get_group_mute = (connection, params) =>
	send(connection, 'get_mute', params)

// set_mute // Different name
exports.set_group_mute = (connection, params) =>
	send(connection, 'set_mute', params)

// toggle_mute // Different name
exports.toggle_group_mute = (connection, params) =>
	send(connection, 'toggle_mute', params)
