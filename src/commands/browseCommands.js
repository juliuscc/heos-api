const { defaultSendCommand, createSender } = require('../sendCommand')
const send = createSender('browse', defaultSendCommand)

exports.get_music_sources = connection => send(connection, 'get_music_sources')

exports.get_source_info = (connection, sid) =>
	send(connection, 'get_source_info', { sid })

// browse_source (browse) // TODO

// browse_source_containers (browse) // TODO

exports.get_search_criteria = (connection, sid) =>
	send(connection, 'get_search_criteria', { sid })

exports.search = (connection, sid, search, scid) =>
	send(connection, 'search', { sid, search, scid })

// play_stream // Different name
exports.play_station = (connection, pid, sid, cid, mid, station_name) =>
	send(connection, 'play_stream', { pid, sid, cid, mid, name: station_name })

// play_preset // Different name
exports.play_preset_station = (connection, pid, preset) =>
	send(connection, 'play_preset', { pid, preset })

// play_input // Different name // TODO fix 2 jsdocs
exports.play_input_source = (connection, pid, spid_or_input, input) => {
	input
		? send(connection, 'play_input', { pid, spid: spid_or_input, input })
		: send(connection, 'play_input', { pid, input: spid_or_input })
}

// play_stream // Different name
exports.play_url = (connection, pid, url) =>
	send(connection, 'play_stream', { pid, url })

// add_to_queue // Different name
exports.add_container_to_queue = (connection, pid, sid, cid, aid) =>
	send(connection, 'add_to_queue', { pid, sid, cid, aid })

// add_to_queue // Different name
exports.add_track_to_queue = (connection, pid, sid, cid, mid, aid) =>
	send(connection, 'add_to_queue', { pid, sid, cid, mid, aid })

// get_playlist // TODO

exports.rename_playlist = (connection, sid, cid, name) =>
	send(connection, 'rename_playlist', { sid, cid, name })

exports.delete_playlist = (connection, sid, cid) =>
	send(connection, 'delete_playlist', { sid, cid })

// get_history // TODO

exports.retrieve_metadata = (connection, sid, cid) =>
	send(connection, 'retrieve_metadata', { sid, cid })

exports.set_service_option = (connection, params) =>
	send(connection, 'set_service_option', params)
