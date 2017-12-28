const { createSender, createSendCommand } = require('../lib/sendCommand')
const {
	bindResponse,
	resolveOneResponse,
	rejectOneResponse
} = require('../lib/eventHandler')

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
		let expectedOutput = 'system/reboot'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)

		send({}, 'heart_beat')
		expectedOutput = 'system/heart_beat'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)

		expect(mockSendCommand).not.toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			'system'
		)

		expect.assertions(3)
	})

	it(`Calls sendCommand with the correct output (with object as 'parameters' parameter)`, () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'volume_up', { pid: 2, step: 5 })
		const expectedOutput = 'player/volume_up?pid=2&step=5'
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
		const expectedOutput = 'player/volume_up?pid=2&step=5'
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
		const expectedOutput = 'player/get_players'
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
		const expectedOutput = 'player/get_players'
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
		const expectedOutput = 'player/get_player_info?pid=player_id'
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
		const expectedOutput = 'player/get_player_info?pid=player_id'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})

	it('Can transform an array parameter to a comma seperated list', () => {
		const mockSendCommand = jest.fn()
		const send = createSender('player', mockSendCommand)

		send({}, 'remove_from_queue', { pid: '12', qid: [12, '4', 3, 23] })
		const expectedOutput = 'player/remove_from_queue?pid=12&qid=12,4,3,23'
		expect(mockSendCommand).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expectedOutput
		)
	})
})

describe('Send command works as expected', () => {
	const mockConnection = { connection: { write: jest.fn() } }

	const mockBinder = (connection, response, resolve, reject) => {
		bindResponse(connection, response, resolve, reject)
		setTimeout(() => resolveOneResponse(connection, response, 'test-data'), 10)
	}

	const mockErrorBinder = (connection, response, resolve, reject) => {
		bindResponse(connection, response, resolve, reject)
		setTimeout(() => rejectOneResponse(connection, response, 'test-error'), 10)
	}

	const sendCommand = createSendCommand(mockBinder)

	it('Calls connection.connection.write', () => {
		const connection = { connection: { write: jest.fn() } }

		expect.assertions(1)

		return sendCommand(connection, '').then(() => {
			expect(connection.connection.write).toHaveBeenCalled()
		})
	})

	it('Calls connection.connection.write with the correct commandMessage', () => {
		const write = jest.fn()
		const connection = { connection: { write } }

		expect.assertions(1)

		return sendCommand(connection, undefined, 'test').then(() => {
			expect(write).toHaveBeenCalledWith('heos://test\r\n')
		})
	})

	it('Binds the response correctly', () => {
		const send = createSendCommand(mockBinder)
		const connection = { connection: { write: jest.fn() } }

		expect.assertions(6)

		const prom = send(connection, 'test-command').then(data => {
			expect(data).toBe('test-data')
			expect(connection).toHaveProperty('responses.test-command')
			expect(connection.responses['test-command']).toEqual([])
		})

		expect(connection).not.toHaveProperty('events')
		expect(connection).toHaveProperty('responses')
		expect(connection.responses).not.toEqual([])

		return prom
	})

	it('Binds the response to a reject correctly', () => {
		const send = createSendCommand(mockErrorBinder)
		const connection = { connection: { write: jest.fn() } }

		return send(connection, 'test-command').catch(error => {
			expect(error).toBe('test-error')
		})
	})
})
