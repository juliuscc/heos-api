import { ResponseParser } from '../src/responseParser'

describe('Heos response messages can be correctly parsed', () => {
	test('When receiving a message it triggers a callback', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		messageParser.put(
			'{"heos": {"command": "", "result": "", "message": ""}}\r\n'
		)

		expect(mockCallback.mock.calls.length).toBe(1)
	})

	test('Delimiters are used correctly', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		messageParser.put('{"he')
		messageParser.put(
			'os": {"command": "", "result": "", "message": ""}}\r\n'
		)

		expect(mockCallback.mock.calls.length).toBe(1)

		messageParser.put(
			'{"heos": {"command": "", "result": "", "message": ""}}\r\n{"heos": {"command": "", "result": "", "message": ""}}\r\n'
		)
		expect(mockCallback.mock.calls.length).toBe(3)

		messageParser.put(
			'{"heos": {"command": "", "result": "", "message": ""}}\r\n{ "heos":'
		)
		expect(mockCallback.mock.calls.length).toBe(4)
	})

	test('The parser returns the message as an object', () => {
		const mockCallback = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const mockObject = { heos: { command: '', result: '', message: '' } }

		messageParser.put(JSON.stringify(mockObject) + '\r\n')

		expect(mockCallback.mock.calls.length).toBe(1)
		expect(mockCallback.mock.calls[0][0]).toEqual(mockObject)
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
				command: expect.any(String),
				result: expect.any(String),
				message: expect.any(String)
			}
		})
	})

	test.only('Missing parameters flushes buffer', () => {
		const mockCallback = jest.fn()

		console.log = jest.fn()

		const messageParser: ResponseParser = new ResponseParser(mockCallback)

		const errorObject = {
			heos: {
				command: 'system/heart_beat',
				result: 'success'
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
			expect(result[0]).toEqual(
				'Heos response has wrong structure. Flushing buffer.'
			)
		}
	})
})
