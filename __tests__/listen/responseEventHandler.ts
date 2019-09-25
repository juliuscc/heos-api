import { ResponseEventHandler } from '../../src/listen/responseEventHandler'
import { HeosResponse } from '../../src/types'

describe('Heos responses can be correctly subscribed to', () => {
	const message: HeosResponse = {
		heos: {
			command: {
				commandGroup: 'system',
				command: 'heart_beat',
				attributes: {
					pid: 2,
					step: 5
				}
			},
			result: 'success',
			message: {}
		}
	}

	const strippedMessage: HeosResponse = {
		heos: {
			command: {
				commandGroup: 'system',
				command: 'heart_beat'
			},
			result: 'success',
			message: {}
		}
	}

	test('A message can be added (smoke test)', () => {
		const eventHandler: ResponseEventHandler = new ResponseEventHandler()

		eventHandler.put(strippedMessage)
	})

	test('An event can be listened to', () => {
		const eventHandler: ResponseEventHandler = new ResponseEventHandler()

		const mock = jest.fn()
		eventHandler.on(strippedMessage.heos.command, mock)

		eventHandler.put(strippedMessage)

		expect(mock).toBeCalled()
	})

	test('Attributes in response are ignored', () => {
		const eventHandler: ResponseEventHandler = new ResponseEventHandler()

		const mock = jest.fn()

		eventHandler.on(strippedMessage.heos.command, mock)

		eventHandler.put(message)

		expect(mock).toBeCalled()
	})

	test('Once and on works as expected', () => {
		const eventHandler: ResponseEventHandler = new ResponseEventHandler()

		const onceMock = jest.fn()
		const mock = jest.fn()

		eventHandler.on(strippedMessage.heos.command, mock)
		eventHandler.once(strippedMessage.heos.command, onceMock)

		eventHandler.put(message)
		eventHandler.put(message)
		eventHandler.put(message)

		expect(onceMock.mock.calls.length).toBe(1)
		expect(mock.mock.calls.length).toBe(3)
	})

	test('The responce is returned', () => {
		const eventHandler: ResponseEventHandler = new ResponseEventHandler()

		const mock = jest.fn()

		eventHandler.on(strippedMessage.heos.command, mock)

		eventHandler.put(message)

		expect(mock.mock.calls[0][0]).toEqual(message)
	})
})
