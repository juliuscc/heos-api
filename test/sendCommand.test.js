const createSender = require('../lib/utils/sendCommand').createSender

describe('Create sender works as expected', () => {
	it('createSender(...) returns a closure', () =>
		expect(createSender()).toBeInstanceOf(Function))

	it('Calls sendCommand one time', () => {
		const mockSendCommand = jest.fn()
		const send = createSender('', mockSendCommand)
		send()
		expect(mockSendCommand).toHaveBeenCalledTimes(1)
	})

	it('Calls sendCommand with the correct fullCommand', () => {
		const commandGroups = ['player', 'browse']
		const commands = ['volume_up', 'get_players']

		expect.assertions(4)

		commandGroups.forEach(commandGroup =>
			commands.forEach(command => {
				const mockSendCommand = jest.fn()
				const send = createSender(commandGroup, mockSendCommand)

				const expectedFullCommand = commandGroup + '/' + command

				send({}, command)
				expect(mockSendCommand).toHaveBeenCalledWith(
					expect.anything(),
					expectedFullCommand,
					expect.anything()
				)
			})
		)
	})

	it('Calls sendCommand with the correct output (witout parameters)', () => {
		const mockSendCommand = jest.fn()
		const send = createSender('system', mockSendCommand)

		send({}, 'reboot')
		let expectedOutput = 'heos://system/reboot\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)

		send({}, 'heart_beat')
		expectedOutput = 'heos://system/heart_beat\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)

		expect(mockSendCommand).not.toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			'heos://system/heart_beat'
		)

		expect.assertions(3)
	})

	it(`Calls sendCommand with the correct output (with object as 'parameters' parameter)`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'volume_up', { pid: 2, step: 5 })
		const expectedOutput = 'heos://player/volume_up?pid=2&step=5\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it(`Calls sendCommand with the correct output (with string as 'parameters' parameter)`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'volume_up', 'pid=2&step=5')
		const expectedOutput = 'heos://player/volume_up?pid=2&step=5\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it(`Can handle empty object as 'parameters' parameter`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'get_players', {})
		const expectedOutput = 'heos://player/get_players\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it(`Can handle empty string as 'parameters' parameter`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'get_players', '')
		const expectedOutput = 'heos://player/get_players\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it(`Can handle one parameter as 'parameters' parameter (in string format)`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'get_player_info', 'pid=player_id')
		const expectedOutput = 'heos://player/get_player_info?pid=player_id\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it(`Can handle one parameter as 'parameters' parameter (in object format)`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'get_player_info', { pid: 'player_id' })
		const expectedOutput = 'heos://player/get_player_info?pid=player_id\r\n'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})
})
