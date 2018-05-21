const commands = require('../../lib/commands/commands')
const enums = require('../../lib/enums')

const mockConnect = write =>
	new Promise(resolve => {
		const connection = {
			connection: {
				write
			}
		}
		resolve(connection)
	})

describe('Integration test: Can send correct player commands', () => {
	it('get_players works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_players(connection)
			expect(write).toHaveBeenCalledWith('heos://player/get_players\r\n')
		})
	})

	it('get_player_info works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_player_info(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_player_info?pid=12\r\n'
			)
		})
	})

	it('get_play_state works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_play_state(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_play_state?pid=12\r\n'
			)
		})
	})

	it('set_play_state works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.set_play_state(connection, 12, 'play')
			expect(write).toHaveBeenCalledWith(
				'heos://player/set_play_state?pid=12&state=play\r\n'
			)
		})
	})

	it('get_now_playing_media works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_now_playing_media(
				connection,
				12,
				enums.now_playing_media_options.add_station_to_favourites
			)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_now_playing_media?pid=12&id=19\r\n'
			)
		})
	})

	it('get_volume works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_volume(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://player/get_volume?pid=12\r\n')
		})
	})

	it('set_volume works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.set_volume(connection, 12, 35)
			expect(write).toHaveBeenCalledWith(
				'heos://player/set_volume?pid=12&level=35\r\n'
			)
		})
	})

	it('volume_up works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.volume_up(connection, 12, 8)
			expect(write).toHaveBeenCalledWith(
				'heos://player/volume_up?pid=12&step=8\r\n'
			)
		})
	})

	it('volume_down works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.volume_down(connection, 12, 8)
			expect(write).toHaveBeenCalledWith(
				'heos://player/volume_down?pid=12&step=8\r\n'
			)
		})
	})

	it('get_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_mute(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://player/get_mute?pid=12\r\n')
		})
	})

	it('set_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.set_mute(connection, 12, enums.mute_state.on)
			expect(write).toHaveBeenCalledWith(
				'heos://player/set_mute?pid=12&state=on\r\n'
			)
		})
	})

	it('toggle_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.toggle_mute(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://player/toggle_mute?pid=12\r\n')
		})
	})

	it('get_play_mode works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_play_mode(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_play_mode?pid=12\r\n'
			)
		})
	})

	it('set_play_mode works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.set_play_mode(
				connection,
				1,
				enums.repeat_state.on_all,
				enums.shuffle_state.off
			)
			expect(write).toHaveBeenCalledWith(
				'heos://player/set_play_mode?pid=1&repeat=on_all&shuffle=off\r\n'
			)
		})
	})

	it('get_queue works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_queue(connection, 12, 0, 10)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_queue?pid=12&range=0,10\r\n'
			)
		})
	})

	it('play_queue_item works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.play_queue_item(connection, 12, 10)
			expect(write).toHaveBeenCalledWith(
				'heos://player/play_queue?pid=12&qid=10\r\n'
			)
		})
	})

	it('remove_from_queue works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.remove_from_queue(connection, 12, 10)
			expect(write).toHaveBeenCalledWith(
				'heos://player/remove_from_queue?pid=12&qid=10\r\n'
			)
		})
	})

	it('save_queue_as_playlist works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.save_queue_as_playlist(connection, 12, 'best playlist')
			expect(write).toHaveBeenCalledWith(
				'heos://player/save_queue?pid=12&name=best playlist\r\n'
			)
		})
	})

	it('clear_queue works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.clear_queue(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://player/clear_queue?pid=12\r\n')
		})
	})

	it('move_queue_item works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.move_queue_item(connection, 12, [16, 12, 321, 5], 15)
			expect(write).toHaveBeenCalledWith(
				'heos://player/move_queue_item?pid=12&sqid=16,12,321,5&dqid=15\r\n'
			)
		})
	})

	it('play_next works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.play_next(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://player/play_next?pid=12\r\n')
		})
	})

	it('play_previous works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.play_previous(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://player/play_previous?pid=12\r\n'
			)
		})
	})

	it('set_quickselect works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.set_quickselect(connection, 12, 2)
			expect(write).toHaveBeenCalledWith(
				'heos://player/set_quickselect?pid=12&id=2\r\n'
			)
		})
	})

	it('play_quickselect works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.play_quickselect(connection, 12, 2)
			expect(write).toHaveBeenCalledWith(
				'heos://player/play_quickselect?pid=12&id=2\r\n'
			)
		})
	})

	it('get_quickselect works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.player.get_quickselect(connection, 12, 2)
			expect(write).toHaveBeenCalledWith(
				'heos://player/get_quickselect?pid=12&id=2\r\n'
			)
		})
	})
})
