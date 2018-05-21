const commands = require('../lib/commands/commands')

const mockConnect = write =>
	new Promise(resolve => {
		const connection = {
			connection: {
				write
			}
		}
		resolve(connection)
	})

describe('Integration test: Can send commands', () => {
	it('Sends command', () => {
		expect.assertions(2)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.heart_beat(connection)
			expect(write).toHaveBeenCalled()
			expect(write).toHaveBeenCalledWith('heos://system/heart_beat\r\n')
		})
	})
})
