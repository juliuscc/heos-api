const {
	breakCommand,
	parseMessage,
	createDataHandler
} = require('../lib/dataHandler')

describe('Incoming data is correctly processed and handled', () => {
	describe('Break command parses commands correctly', () => {
		const mockCommand = 'command_group/command'

		it('Returns the raw command in its original form', () => {
			expect(breakCommand(mockCommand).rawCommand).toEqual(mockCommand)
		})

		it('Returns a copy of the raw command and not just a pointer', () => {
			let otherMock = 'command_group/command'
			const result = breakCommand(otherMock)
			otherMock = 'test'
			expect(result.rawCommand).not.toBe(otherMock)
		})

		it('Returns the correct command_group', () => {
			expect(breakCommand(mockCommand).command_group).toBe('command_group')
		})

		it('Returns the correct command', () => {
			expect(breakCommand(mockCommand).command).toBe('command')
		})

		it('Does not throw even if the input is incorrect', () => {
			expect(() => breakCommand('test')).not.toThrow()
		})

		it('Valid input implies falsy error parameter', () => {
			expect(breakCommand(mockCommand).error).toBeFalsy()
		})

		it('Undefined input implies truthy error parameter', () => {
			expect(breakCommand().error).toBeTruthy()
		})

		it('Input being empty string implies truthy error parameter', () => {
			expect(breakCommand('').error).toBeTruthy()
		})

		it('Input not being string implies truthy error parameter', () => {
			expect(breakCommand(2).error).toBeTruthy()
			expect(breakCommand(false).error).toBeTruthy()
			expect(breakCommand(true).error).toBeTruthy()
			expect(breakCommand([]).error).toBeTruthy()
			expect(breakCommand({}).error).toBeTruthy()
		})

		it('Any other invalid input implies truthy error parameter', () => {
			expect(breakCommand('/').error).toBeTruthy()
			expect(breakCommand('test').error).toBeTruthy()
			expect(breakCommand('test/').error).toBeTruthy()
			expect(breakCommand('/test').error).toBeTruthy()
			expect(breakCommand('/test/').error).toBeTruthy()
			expect(breakCommand('test/test/test').error).toBeTruthy()
		})

		it('Returns a correct error reason if error is truthy', () => {
			expect(breakCommand().error).toEqual('Input missing')
			expect(breakCommand('').error).toEqual('Input missing')

			expect(breakCommand(2).error).toEqual('Command must be a string')
			expect(breakCommand(false).error).toEqual('Command must be a string')
			expect(breakCommand(true).error).toEqual('Command must be a string')
			expect(breakCommand([]).error).toEqual('Command must be a string')
			expect(breakCommand({}).error).toEqual('Command must be a string')

			expect(breakCommand('/').error).toMatch(
				/Command group missing|Command missing/
			)

			expect(breakCommand('test/').error).toEqual('Command missing')

			expect(breakCommand('/test').error).toEqual('Command group missing')

			expect(breakCommand('/test/').error).toEqual(
				'Undefined error parsing command'
			)
			expect(breakCommand('test/test/test').error).toEqual(
				'Undefined error parsing command'
			)
		})
	})

	describe('Parse message parses messages correctly', () => {
		const mockMessages = [
			'signed_out',
			'pid=player_id',
			'pid=player_id&name=playlist_name'
		]

		it('Returns the raw message', () => {
			expect(parseMessage(mockMessages[0]).rawMessage).toEqual(mockMessages[0])
		})

		it('Returns a copy of the raw command and not just a pointer', () => {
			let otherMock = 'command under process'
			const result = parseMessage(otherMock)
			otherMock = 'test'
			expect(result.rawCommand).not.toBe(otherMock)
		})

		it('Returns a string if the message only is one, non attribute-value, parameter', () => {
			expect(typeof parseMessage(mockMessages[0]).message).toBe('string')
		})

		it('Returns an object if the message is divided into attribute-value pairs', () => {
			expect(typeof parseMessage(mockMessages[1]).message).toBe('object')
			expect(typeof parseMessage(mockMessages[2]).message).toBe('object')
		})

		it('Divides the parameters into correct attribute-value pairs, if the message is divided into one attribute-value pair', () => {
			expect(parseMessage(mockMessages[1]).message).toEqual({
				pid: 'player_id'
			})
		})

		it('Divides the parameters into correct attribute-value pairs, if the message is divided into multiple attribute-value pairs', () => {
			expect(parseMessage(mockMessages[2]).message).toEqual({
				pid: 'player_id',
				name: 'playlist_name'
			})
		})

		it('Returns undefined if there is no message', () => {
			expect(parseMessage(undefined)).toEqual(undefined)
		})
	})

	const mockConnection = { test: 'I am a connection' }
	const mockResponse = `{
		"heos": {
			"command": "browse/set_service_option",
			"result": "success",
			"message": "sid=source_id&option=option_id&mid=media_id"
		}, "payload": [
			{
				 "play": [
							   {
									"id": 11,
								   "name": "Thumbs Up"
							   },
							   {
									 "id": 12,
									 "name": "Thumbs Down"
							   }
						  ]
			}
		  ]
	}\r\n`
	const mockEvent = `{
		"heos": {
			"command": "event/sources_changed"
		}
	}\r\n`

	it('Triggers event or / and response when called', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler({}, new Buffer(mockResponse))

		expect(
			mockTriggerEvent.mock.calls.length + mockUseOneResponse.mock.calls.length
		).toBeGreaterThanOrEqual(1)
	})

	it('Calls triggerEvent when given an event', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler({}, new Buffer(mockEvent))

		expect(mockTriggerEvent).toHaveBeenCalledTimes(1)
		expect(mockUseOneResponse).toHaveBeenCalledTimes(0)
	})

	it('Calls useOneResponse when given a response', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler({}, new Buffer(mockResponse))

		expect(mockUseOneResponse).toHaveBeenCalledTimes(1)
		expect(mockTriggerEvent).toHaveBeenCalledTimes(0)
	})

	it('Calls useOneResponse / triggerEvent with the correct connection', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		expect(mockUseOneResponse).toHaveBeenCalledWith(
			mockConnection,
			expect.anything(),
			expect.anything()
		)
		expect(mockTriggerEvent).toHaveBeenCalledWith(
			mockConnection,
			expect.anything(),
			expect.anything()
		)
	})

	it('Calls useOneResponse / triggerEvent with the correct response / event', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		expect(mockUseOneResponse).toHaveBeenCalledWith(
			expect.anything(),
			'browse/set_service_option',
			expect.anything()
		)
		expect(mockTriggerEvent).toHaveBeenCalledWith(
			expect.anything(),
			'event/sources_changed',
			expect.anything()
		)
	})

	it('Calls useOneResponse / triggerEvent with a data object', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		const responseData = mockUseOneResponse.mock.calls[0][2]
		const eventData = mockTriggerEvent.mock.calls[0][2]

		expect(typeof responseData).toBe('object')
		expect(typeof eventData).toBe('object')
	})

	it('Calls useOneResponse / triggerEvent with a data object, with a message parameter', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		const responseData = mockUseOneResponse.mock.calls[0][2]
		const eventData = mockTriggerEvent.mock.calls[0][2]

		expect(responseData).toHaveProperty('message')
		expect(eventData).toHaveProperty('message')
	})

	it('Calls useOneResponse / triggerEvent with a data object, with a correctly parsed message parameter', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		const responseData = mockUseOneResponse.mock.calls[0][2]
		const eventData = mockTriggerEvent.mock.calls[0][2]

		expect(responseData.message).toEqual({
			sid: 'source_id',
			option: 'option_id',
			mid: 'media_id'
		})
		expect(eventData.message).toEqual(undefined)
	})

	it('Calls useOneResponse / triggerEvent with a data object, with a correctly parsed payload parameter', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		dataHandler(mockConnection, new Buffer(mockResponse))
		dataHandler(mockConnection, new Buffer(mockEvent))

		const responseData = mockUseOneResponse.mock.calls[0][2]
		const eventData = mockTriggerEvent.mock.calls[0][2]

		expect(responseData.payload).toEqual([
			{
				play: [{ id: 11, name: 'Thumbs Up' }, { id: 12, name: 'Thumbs Down' }]
			}
		])
		expect(eventData.payload).toEqual(undefined)
	})

	it('Can handle two responses / events from the same buffer', () => {
		const mockTriggerEvent = jest.fn()
		const mockUseOneResponse = jest.fn()
		const dataHandler = createDataHandler(mockTriggerEvent, mockUseOneResponse)

		const mockBigBuffer = new Buffer(mockResponse + mockEvent)

		dataHandler(mockConnection, mockBigBuffer)

		expect(mockUseOneResponse).toHaveBeenCalledWith(
			mockConnection,
			'browse/set_service_option',
			{
				message: {
					sid: 'source_id',
					option: 'option_id',
					mid: 'media_id'
				},
				payload: [
					{
						play: [
							{ id: 11, name: 'Thumbs Up' },
							{ id: 12, name: 'Thumbs Down' }
						]
					}
				]
			}
		)
		expect(mockTriggerEvent).toHaveBeenCalledWith(
			mockConnection,
			'event/sources_changed',
			{ message: undefined, payload: undefined }
		)
	})

	it('Can handle errors')
})
