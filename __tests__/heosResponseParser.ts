import { HeosResponseParser } from '../src/heosResponseParser'

describe('Heos response messages can be correctly parsed', () => {
	test('When receiving a message it triggers a callback', () => {
		const mockCallback = jest.fn()

		const messageParser: HeosResponseParser = new HeosResponseParser(
			mockCallback
		)

		messageParser.put('{}\r\n')

		expect(mockCallback.mock.calls.length).toBe(1)
	})

	test('Delimiters are used correctly', () => {
		const mockCallback = jest.fn()

		const messageParser: HeosResponseParser = new HeosResponseParser(
			mockCallback
		)

		messageParser.put('{')
		messageParser.put('}\r\n')

		expect(mockCallback.mock.calls.length).toBe(1)

		messageParser.put('{}\r\n{}\r\n')
		expect(mockCallback.mock.calls.length).toBe(3)
	})
})
