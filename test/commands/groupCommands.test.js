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

describe('Integration test: Can send correct group commands', () => {
	it('get_groups works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.get_groups(connection)
			expect(write).toHaveBeenCalledWith('heos://group/get_groups\r\n')
		})
	})

	it('get_group_info works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.get_group_info(connection, 12)
			expect(write).toHaveBeenCalledWith(
				'heos://group/get_group_info?gid=12\r\n'
			)
		})
	})

	it('set_group works', () => {
		expect.assertions(3)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.set_group(connection, 12, [13, 42, 3])
			commands.group.set_group(connection, 12)
			commands.group.set_group(connection, 12, [])
			expect(write.mock.calls[0][0]).toEqual(
				'heos://group/set_group?pid=12,13,42,3\r\n'
			)
			expect(write.mock.calls[1][0]).toEqual(
				'heos://group/set_group?pid=12\r\n'
			)
			expect(write.mock.calls[2][0]).toEqual(
				'heos://group/set_group?pid=12\r\n'
			)
		})
	})

	it('get_group_volume works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.get_group_volume(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://group/get_volume?gid=12\r\n')
		})
	})

	it('set_group_volume works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.set_group_volume(connection, 12, enums.volume_level(10))
			expect(write).toHaveBeenCalledWith(
				'heos://group/set_volume?gid=12&level=10\r\n'
			)
		})
	})

	it('group_volume_up works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.group_volume_up(connection, 12, enums.volume_step(8))
			expect(write).toHaveBeenCalledWith(
				'heos://group/volume_up?gid=12&step=8\r\n'
			)
		})
	})

	it('group_volume_down works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.group_volume_down(connection, 12, enums.volume_step(8))
			expect(write).toHaveBeenCalledWith(
				'heos://group/volume_down?gid=12&step=8\r\n'
			)
		})
	})

	it('get_group_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.get_group_mute(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://group/get_mute?gid=12\r\n')
		})
	})

	it('set_group_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.set_group_mute(connection, 12, enums.mute_state.off)
			expect(write).toHaveBeenCalledWith(
				'heos://group/set_mute?gid=12&state=off\r\n'
			)
		})
	})

	it('toggle_group_mute works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.group.toggle_group_mute(connection, 12)
			expect(write).toHaveBeenCalledWith('heos://group/toggle_mute?gid=12\r\n')
		})
	})
})
