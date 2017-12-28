const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('player', defaultSendCommand)

exports.get_players = (connection, gid, network, lineout, control) =>
	send(connection, 'get_players', { gid, network, lineout, control })

exports.get_player_info = (connection, pid, gid, network, lineout, control) =>
	send(connection, 'get_player_info', { pid, gid, network, lineout, control })

exports.get_play_state = (connection, pid) =>
	send(connection, 'get_play_state', { pid })

exports.set_play_state = (connection, pid, state) =>
	send(connection, 'set_play_state', { pid, state })

exports.get_now_playing_media = (connection, pid, id) =>
	send(connection, 'get_now_playing_media', { pid, id })

exports.get_volume = (connection, pid) =>
	send(connection, 'get_volume', { pid })

exports.set_volume = (connection, pid, level) =>
	send(connection, 'set_volume', { pid, level })

exports.volume_up = (connection, pid, step = 5) =>
	send(connection, 'volume_up', { pid, step })

exports.volume_down = (connection, pid, step = 5) =>
	send(connection, 'volume_down', { pid, step })

exports.get_mute = (connection, pid) => send(connection, 'get_mute', { pid })

exports.set_mute = (connection, pid, state) =>
	send(connection, 'set_mute', { pid, state })

exports.toggle_mute = (connection, pid) =>
	send(connection, 'toggle_mute', { pid })

exports.get_play_mode = (connection, pid) =>
	send(connection, 'get_play_mode', { pid })

exports.set_play_mode = (connection, pid, repeat, shuffle) =>
	send(connection, 'set_play_mode', { pid, repeat, shuffle })

exports.get_queue = (connection, pid, range_start, range_end) =>
	send(connection, 'get_queue', { pid, range: `${range_start},${range_end}` })

// play_queue // Different name
exports.play_queue_item = (connection, pid, qid) =>
	send(connection, 'play_queue', { pid, qid })

exports.remove_from_queue = (connection, pid, qid) =>
	send(connection, 'remove_from_queue', { pid, qid })

// save_queue // Different name
exports.save_queue_as_playlist = (connection, pid, name) =>
	send(connection, 'save_queue', { pid, name })

exports.clear_queue = (connection, pid) =>
	send(connection, 'clear_queue', { pid })

exports.move_queue_item = (connection, pid, sqid, dqid) =>
	send(connection, 'move_queue_item', { pid, sqid, dqid })

exports.play_next = (connection, pid) => send(connection, 'play_next', { pid })

exports.play_previous = (connection, pid) =>
	send(connection, 'play_previous', { pid })

exports.set_quickselect = (connection, pid, id) =>
	send(connection, 'set_quickselect', { pid, id })

exports.play_quickselect = (connection, pid, id) =>
	send(connection, 'play_quickselect', { pid, id })

exports.get_quickselect = (connection, pid, id) =>
	send(connection, 'get_quickselect', { pid, id })
