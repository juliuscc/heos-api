import { ResponseParser } from '../../src/listen/responseParser'

describe('Heos response messages can be correctly parsed', () => {
	test('When receiving a message it triggers a callback', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		messageParser.put('{"heos": {"command": "test/test", "result": "", "message": ""}}\r\n')

		expect(mockCallback).toBeCalledTimes(1)
	})

	test('Delimiters are used correctly', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		messageParser.put('{"he')
		messageParser.put('os": {"command": "test/test", "result": "", "message": ""}}\r\n')

		expect(mockCallback).toBeCalledTimes(1)

		messageParser.put(
			'{"heos": {"command": "test/test", "result": "", "message": ""}}\r\n{"heos": {"command": "test/test", "result": "", "message": ""}}\r\n'
		)
		expect(mockCallback).toBeCalledTimes(3)

		messageParser.put(
			'{"heos": {"command": "test/test", "result": "", "message": ""}}\r\n{ "heos":'
		)
		expect(mockCallback).toBeCalledTimes(4)
	})

	test('The parser returns the message as an object', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const mockObject = { heos: { command: 'test/test', result: '', message: '' } }
		const expectedObject = {
			heos: { command: { commandGroup: 'test', command: 'test' }, result: '', message: '' }
		}

		messageParser.put(JSON.stringify(mockObject) + '\r\n')

		expect(mockCallback).toBeCalledTimes(1)
		expect(mockCallback.mock.calls[0][0]).toEqual(expectedObject)
	})

	test('The parser returns the message as a HeosResponse', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const mockObject = {
			heos: {
				command: 'system/heart_beat',
				result: 'success',
				message: ''
			}
		}

		messageParser.put(JSON.stringify(mockObject) + '\r\n')

		expect(mockCallback.mock.calls[0][0]).toEqual({
			heos: {
				command: {
					commandGroup: expect.any(String),
					command: expect.any(String)
				},
				result: expect.any(String),
				message: expect.any(String)
			}
		})
	})

	test('Missing parameters flushes buffer', () => {
		const mockCallback = jest.fn()

		console.log = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const errorObject = {
			heos: {
				result: 'system/heart_beat',
				message: true
			}
		}

		const correctObject = {
			heos: {
				command: 'system/heart_beat',
				result: 'success',
				message: ''
			}
		}

		messageParser.put(JSON.stringify(errorObject) + '\r\n')
		messageParser.put(JSON.stringify(correctObject) + '\r\n')
		messageParser.put(JSON.stringify(errorObject) + '\r\n')
		messageParser.put(JSON.stringify(errorObject) + '\r\n')
		messageParser.put(JSON.stringify(correctObject) + '\r\n')

		expect(mockCallback.mock.calls.length).toBe(2)
		expect(console.log).toHaveBeenCalled()
		expect((<any>console.log).mock.calls.length).toBe(3)

		for (const result of (<any>console.log).mock.calls) {
			expect(result[0]).toEqual('Heos response has wrong structure. Flushing buffer.')
		}
	})

	test('Heos events works as well', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const mockObject = {
			heos: {
				command: 'event/sources_changed'
			}
		}

		const expectedObject = {
			heos: {
				command: { commandGroup: 'event', command: 'sources_changed' }
			}
		}

		const mockObject2 = {
			heos: {
				command: 'event/sources_changed',
				message: 'test_message'
			}
		}

		const expectedObject2 = {
			heos: {
				command: { commandGroup: 'event', command: 'sources_changed' },
				message: 'test_message'
			}
		}

		messageParser.put(JSON.stringify(mockObject) + '\r\n')
		messageParser.put(JSON.stringify(mockObject2) + '\r\n')

		expect(mockCallback).toBeCalledTimes(2)
		expect(mockCallback.mock.calls[0][0]).toEqual(expectedObject)
		expect(mockCallback.mock.calls[1][0]).toEqual(expectedObject2)
	})
})
