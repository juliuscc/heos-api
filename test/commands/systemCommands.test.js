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

describe('Integration test: Can send correct system commands', () => {
	it('register_for_change_events works', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.register_for_change_events(connection, enums.enable.on)
			expect(write).toHaveBeenCalledWith(
				'heos://system/register_for_change_events?enable=on\r\n'
			)
		})
	})

	it('check_account', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.check_account(connection)
			expect(write).toHaveBeenCalledWith('heos://system/check_account\r\n')
		})
	})

	it('sign_in', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.sign_in(connection, 'user@gmail.com', '12345')
			expect(write).toHaveBeenCalledWith(
				'heos://system/sign_in?un=user@gmail.com&pw=12345\r\n'
			)
		})
	})

	it('sign_out', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.sign_out(connection)
			expect(write).toHaveBeenCalledWith('heos://system/sign_out\r\n')
		})
	})

	it('heart_beat', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.heart_beat(connection)
			expect(write).toHaveBeenCalledWith('heos://system/heart_beat\r\n')
		})
	})

	it('reboot', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.reboot(connection)
			expect(write).toHaveBeenCalledWith('heos://system/reboot\r\n')
		})
	})

	it('prettify_json_response', () => {
		expect.assertions(1)

		const write = jest.fn()

		return mockConnect(write).then(connection => {
			commands.system.prettify_json_response(connection, enums.enable.off)
			expect(write).toHaveBeenCalledWith(
				'heos://system/prettify_json_response?enable=off\r\n'
			)
		})
	})
})
