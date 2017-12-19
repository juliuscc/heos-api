import { reject } from '../../../../../Library/Caches/typescript/2.6/node_modules/@types/async'

const {
	sendCommand,
	enumOnOrOff,
	quick_select_id
} = require('../utils/sendCommand')
const { bindResponse } = require('../bindEvent')

exports.get_players = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_players', resolve)

		const message = 'player/get_players'
		sendCommand(connection, message)
	})

exports.get_player_info = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_player_info', resolve)

		const message = `player/get_player_info?pid=${pid}`
		sendCommand(connection, message)
	})

exports.get_play_state = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_play_state', resolve)

		const message = `player/get_play_state?pid=${pid}`
		sendCommand(connection, message)
	})

exports.get_now_playing_media = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_now_playing_media', resolve)

		const message = `player/get_now_playing_media?pid=${pid}`
		sendCommand(connection, message)
	})

exports.get_volume = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_volume', resolve)

		const message = `player/get_volume?pid=${pid}`
		sendCommand(connection, message)
	})

exports.set_volume = (connection, { pid, level }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_volume', resolve)

		const message = `player/set_volume?pid=${pid}&level=${level}`
		sendCommand(connection, message)
	})

exports.volume_up = (connection, { pid, step }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'volume_up', resolve)

		const message = `player/volume_up?pid=${pid}&step=${step}`
		sendCommand(connection, message)
	})

exports.volume_down = (connection, { pid, step }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'volume_down', resolve)

		const message = `player/volume_down?pid=${pid}&step=${step}`
		sendCommand(connection, message)
	})

exports.get_mute = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_mute', resolve)

		const message = `player/get_mute?pid=${pid}`
		sendCommand(connection, message)
	})

exports.set_mute = (connection, { pid, state }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_mute', resolve)

		const message = `player/set_mute?pid=${pid}&state=${enumOnOrOff(state)}`
		sendCommand(connection, message)
	})

exports.toggle_mute = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'toggle_mute', resolve)

		const message = `player/toggle_mute?pid=${pid}`
		sendCommand(connection, message)
	})

exports.get_play_mode = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_play_mode', resolve)

		const message = `player/get_play_mode?pid=${pid}`
		sendCommand(connection, message)
	})

exports.set_play_mode = (connection, { pid, repeat, shuffle }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_play_mode', resolve)

		const message = `player/set_play_mode?pid=${pid}&repeat=${repeat}&shuffle=${enumOnOrOff(
			shuffle
		)}`
		sendCommand(connection, message)
	})

exports.get_queue = (connection, { pid, start, end }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_queue', resolve)

		const message = `player/get_queue?pid=${pid}&range=${start},${end}`
		sendCommand(connection, message)
	})

exports.play_queue = (connection, { pid, qid }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'play_queue', resolve)

		const message = `player/play_queue?pid=${pid}&qid=${qid}`
		sendCommand(connection, message)
	})

exports.remove_from_queue = (connection, { pid, qids }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'remove_from_queue', resolve)

		const queue_ids = qids.reduce((list, qid) => `${list},${qid}`, '')

		const message = `player/remove_from_queue?pid=${pid}&qid=${queue_ids}`
		sendCommand(connection, message)
	})

exports.save_queue = (connection, { pid, name }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'save_queue', resolve)

		const message = `player/save_queue?pid=${pid}&name=${name}`
		sendCommand(connection, message)
	})

exports.clear_queue = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'clear_queue', resolve)

		const message = `player/clear_queue?pid=${pid}`
		sendCommand(connection, message)
	})

exports.move_queue_item = (connection, { pid, sqids, dqid }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'move_queue_item', resolve)

		const squeue_ids = sqids.reduce((list, qid) => `${list},${qid}`, '')

		const message = `player/move_queue_item?pid=${pid}&sqid=${squeue_ids}&dqid=${dqid}`
		sendCommand(connection, message)
	})

exports.play_next = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'play_next', resolve)

		const message = `player/play_next?pid=${pid}`
		sendCommand(connection, message)
	})

exports.play_previous = (connection, pid) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'play_previous', resolve)

		const message = `player/play_previous?pid=${pid}`
		sendCommand(connection, message)
	})

exports.set_quickselect = (connection, { pid, id }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'set_quickselect', resolve)

		const message = `player/set_quickselect?pid=${pid}&id=${quick_select_id(
			id
		)}`
		sendCommand(connection, message)
	})

exports.play_quickselect = (connection, { pid, id }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'play_quickselect', resolve)

		const message = `player/play_quickselect?pid=${pid}&id=${quick_select_id(
			id
		)}`
		sendCommand(connection, message)
	})

exports.get_quickselect = (connection, { pid, id }) =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_quickselect', resolve)

		const message = `player/get_quickselect?pid=${pid}&id=${quick_select_id(
			id
		)}`
		sendCommand(connection, message)
	})
