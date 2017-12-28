const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('player', defaultSendCommand)

exports.get_players = (connection, params) =>
	send(connection, 'get_players', params)

exports.get_player_info = (connection, params) =>
	send(connection, 'get_player_info', params)

exports.get_play_state = (connection, params) =>
	send(connection, 'get_play_state', params)

exports.set_play_state = (connection, params) =>
	send(connection, 'set_play_state', params)

exports.get_now_playing_media = (connection, params) =>
	send(connection, 'get_now_playing_media', params)

exports.get_volume = (connection, params) =>
	send(connection, 'get_volume', params)

exports.set_volume = (connection, params) =>
	send(connection, 'set_volume', params)

exports.volume_up = (connection, params) =>
	send(connection, 'volume_up', params)

exports.volume_down = (connection, params) =>
	send(connection, 'volume_down', params)

exports.get_mute = (connection, params) => send(connection, 'get_mute', params)

exports.set_mute = (connection, params) => send(connection, 'set_mute', params)

exports.toggle_mute = (connection, params) =>
	send(connection, 'toggle_mute', params)

exports.get_play_mode = (connection, params) =>
	send(connection, 'get_play_mode', params)

exports.set_play_mode = (connection, params) =>
	send(connection, 'set_play_mode', params)

exports.get_queue = (connection, params) =>
	send(connection, 'get_queue', params)

// play_queue // Different name
exports.play_queue_item = (connection, params) =>
	send(connection, 'play_queue', params)

exports.remove_from_queue = (connection, params) =>
	send(connection, 'remove_from_queue', params)

// save_queue // Different name
exports.save_queue_as_playlist = (connection, params) =>
	send(connection, 'save_queue', params)

exports.clear_queue = (connection, params) =>
	send(connection, 'clear_queue', params)

exports.move_queue_item = (connection, params) =>
	send(connection, 'move_queue_item', params)

exports.play_next = (connection, params) =>
	send(connection, 'play_next', params)

exports.play_previous = (connection, params) =>
	send(connection, 'play_previous', params)

exports.set_quickselect = (connection, params) =>
	send(connection, 'set_quickselect', params)

exports.play_quickselect = (connection, params) =>
	send(connection, 'play_quickselect', params)

exports.get_quickselect = (connection, params) =>
	send(connection, 'get_quickselect', params)
