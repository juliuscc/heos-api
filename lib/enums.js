module.exports = {
	enable: {
		on: 'on',
		off: 'off'
	},
	network_type: {
		wired: 'wired',
		wifi: 'wifi'
	},
	lineout: {
		variable: 1,
		fixed: 2
	},
	control: {
		none: 1,
		ir: 2,
		trigger: 3,
		network: 4
	},
	play_state: {
		play: 'play',
		pause: 'pause',
		stop: 'stop'
	},
	mute_state: {
		on: 'on',
		off: 'off'
	},
	repeat_state: {
		on_all: 'on_all',
		on_one: 'on_one',
		off: 'off'
	},
	shuffle_state: {
		on: 'on',
		off: 'off'
	},
	now_playing_media_options: {
		thumbs_down: 11,
		thumbs_down: 12,
		add_station_to_favourites: 19
	},
	// browse_source_options: {
	// 	create_new_station: 13,
	// 	remove_from_favourites: 20
	// },
	volume_level: level => (level < 0 || level > 100 ? 10 : level),
	volume_step: step => (step < 0 || step > 10 ? 5 : step),
	quick_select_id: id => (id < 0 || id > 6 ? 0 : id)
}
