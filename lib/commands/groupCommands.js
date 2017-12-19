const { sendCommand, enumOnOrOff } = require('../utils/sendCommand')
const { bindResponse } = require('../bindEvent')

exports.get_groups = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_groups', resolve)

		const message = 'group/get_groups'
		sendCommand(connection, message)
	})

exports.get_group_info = (connection, gid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_group_info', resolve)

		const message = `group/get_group_info?gid=${gid}`
		sendCommand(connection, message)
	})

exports.set_group_info = (connection, { leader_pid, pids = [] }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_group_info', resolve)

		const player_ids =
			pids.length === 0
				? ''
				: pids.map(pid => `${pid}`).reduce((list, pid) => `${list},${pid}`, ',')

		const message = `group/set_group_info?pid=${leader_pid}${player_ids}`
		sendCommand(connection, message)
	})

exports.get_volume = (connection, gid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_volume', resolve)

		const message = `group/get_volume?gid=${gid}`
		sendCommand(connection, message)
	})

exports.set_volume = (connection, { gid, level }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_volume', resolve)

		const message = `group/set_volume?gid=${gid}&level=${level}`
		sendCommand(connection, message)
	})

exports.volume_up = (connection, { gid, step = 5 }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'volume_up', resolve)

		const message = `group/volume_up?gid=${gid}&step=${step}`
		sendCommand(connection, message)
	})

exports.volume_down = (connection, { gid, step = 5 }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'volume_down', resolve)

		const message = `group/volume_down?gid=${gid}&step=${step}`
		sendCommand(connection, message)
	})

exports.get_mute = (connection, gid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_mute', resolve)

		const message = `group/get_mute?gid=${gid}`
		sendCommand(connection, message)
	})

exports.get_volume = (connection, { gid, state }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_volume', resolve)

		const message = `group/get_volume?gid=${gid}&state=${enumOnOrOff(state)}`
		sendCommand(connection, message)
	})

exports.toggle_mute = (connection, gid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'toggle_mute', resolve)

		const message = `group/toggle_mute?gid=${gid}`
		sendCommand(connection, message)
	})
