const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('group', defaultSendCommand)

exports.get_groups = connection => send(connection, 'get_groups')

exports.get_group_info = (connection, gid) =>
	send(connection, 'get_group_info', { gid })

const set_group = (connection, leader, otherPids = []) =>
	send(connection, 'set_group', { pid: [leader, ...otherPids] })

exports.set_group = set_group
exports.create_group = set_group
exports.modify_group = set_group
exports.delete_group = (connection, leader) => set_group(connection, leader)

// get_volume // Different name
exports.get_group_volume = (connection, gid) =>
	send(connection, 'get_volume', { gid })

// set_volume // Different name
exports.set_group_volume = (connection, gid, level) =>
	send(connection, 'set_volume', { gid, level })

// volume_up // Different name
exports.group_volume_up = (connection, gid, step) =>
	send(connection, 'volume_up', { gid, step })

// volume_down // Different name
exports.group_volume_down = (connection, gid, step) =>
	send(connection, 'volume_down', { gid, step })

// get_mute // Different name
exports.get_group_mute = (connection, gid) =>
	send(connection, 'get_mute', { gid })

// set_mute // Different name
exports.set_group_mute = (connection, gid, state) =>
	send(connection, 'set_mute', { gid, state })

// toggle_mute // Different name
exports.toggle_group_mute = (connection, gid) =>
	send(connection, 'toggle_mute', { gid })
