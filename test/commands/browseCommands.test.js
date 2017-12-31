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

describe('Integration test: Can send correct browse commands', () => {
	it('get_music_sources works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.get_music_sources(connection)
			expect(write).toHaveBeenCalledWith('heos://browse/get_music_sources\r\n')
		})
	})

	it('get_source_info works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.get_source_info(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/get_source_info?sid=12\r\n'
			)
		})
	})

	it('get_search_criteria works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.get_search_criteria(connection, 3)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/get_search_criteria?sid=3\r\n'
			)
		})
	})

	it('search works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.search(connection, 3, 'U2', 1)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/search?sid=3&search=U2&scid=1\r\n'
			)
		})
	})

	it('play_station works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.play_station(connection, 1, 2, 'CID-55', 15376, 'Q95')
			expect(write).toHaveBeenCalledWith(
				'heos://browse/play_stream?pid=1&sid=2&cid=CID-55&mid=15376&name=Q95\r\n'
			)
		})
	})

	it('play_preset_station works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.play_preset_station(connection, 1, 2)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/play_preset?pid=1&preset=2\r\n'
			)
		})
	})

	it('play_input_source works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.play_input_source(connection, 1234, 'inputs/aux_in_1')
			commands.browse.play_input_source(
				connection,
				1234,
				9876,
				'inputs/aux_in_1'
			)

			expect(write.mock.calls[0][0]).toEqual(
				'heos://browse/play_input?pid=1234&input=inputs/aux_in_1\r\n'
			)

			expect(write.mock.calls[1][0]).toEqual(
				'heos://browse/play_input?pid=1234&spid=9876&input=inputs/aux_in_1\r\n'
			)
		})
	})

	it('play_url works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.play_url(
				connection,
				1,
				'http://10.110.25.159:49152/web/138.mp3'
			)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/play_stream?pid=1&url=http://10.110.25.159:49152/web/138.mp3\r\n'
			)
		})
	})

	it('add_container_to_queue works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.add_container_to_queue(
				connection,
				1,
				5,
				'Artist/All',
				enums.add_to_queue_options.play_next
			)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/add_to_queue?pid=1&sid=5&cid=Artist/All&aid=2\r\n'
			)
		})
	})

	it('add_track_to_queue works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.add_track_to_queue(
				connection,
				1,
				8,
				'Artists/All',
				9,
				enums.add_to_queue_options.play_now
			)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/add_to_queue?pid=1&sid=8&cid=Artists/All&mid=9&aid=1\r\n'
			)
		})
	})

	it('rename_playlist works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.rename_playlist(connection, 1, 234, 'soft jazz')
			expect(write).toHaveBeenCalledWith(
				'heos://browse/rename_playlist?sid=1&cid=234&name=soft jazz\r\n'
			)
		})
	})

	it('delete_playlist works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.delete_playlist(connection, 1, 234)
			expect(write).toHaveBeenCalledWith(
				'heos://browse/delete_playlist?sid=1&cid=234\r\n'
			)
		})
	})

	it('retrieve_metadata works', () => {
		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.browse.retrieve_metadata(connection, 2, 'Alb.184664171')
			expect(write).toHaveBeenCalledWith(
				'heos://browse/retrieve_metadata?sid=2&cid=Alb.184664171\r\n'
			)
		})
	})
})
