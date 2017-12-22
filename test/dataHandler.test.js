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
})
