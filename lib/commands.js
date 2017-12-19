const sendCommand = require('./utils/sendCommand').sendCommand
const systemCommands = require('./commands/systemCommands')
const playerCommands = require('./commands/playerCommands')

// System Commands
exports.register_for_change_events = systemCommands.register_for_change_events
exports.check_account = systemCommands.check_account
exports.sign_in = systemCommands.sign_in
exports.sign_out = systemCommands.sign_out
exports.heart_beat = systemCommands.heart_beat
exports.reboot = systemCommands.reboot
exports.prettify_json_response = systemCommands.prettify_json_response

// Player Commands
exports.get_players = playerCommands.get_players
exports.get_player_info = playerCommands.get_player_info
exports.get_play_state = playerCommands.get_play_state
exports.get_now_playing_media = playerCommands.get_now_playing_media
exports.get_volume = playerCommands.get_volume
exports.set_volume = playerCommands.set_volume
exports.volume_up = playerCommands.volume_up
exports.volume_down = playerCommands.volume_down
exports.get_mute = playerCommands.get_mute
exports.set_mute = playerCommands.set_mute
exports.toggle_mute = playerCommands.toggle_mute
exports.get_play_mode = playerCommands.get_play_mode
exports.set_play_mode = playerCommands.set_play_mode
exports.get_queue = playerCommands.get_queue
exports.play_queue = playerCommands.play_queue
exports.remove_from_queue = playerCommands.remove_from_queue
exports.save_queue = playerCommands.save_queue
exports.clear_queue = playerCommands.clear_queue
exports.move_queue_item = playerCommands.move_queue_item
exports.play_next = playerCommands.play_next
exports.play_previous = playerCommands.play_previous
exports.set_quickselect = playerCommands.set_quickselect
exports.play_quickselect = playerCommands.play_quickselect
exports.get_quickselect = playerCommands.get_quickselect
