const {
	bindEvent,
	bindResponse,
	unbindEvent,
	triggerEvent,
	useOneResponse
} = require('../lib/eventHandler')

describe('Event handler works', () => {
	describe('Bind callbacks works', () => {
		it('Binds an event to a connection with an empty predefined events object', () => {
			const connection = { events: {} }

			bindEvent(connection, 'volume_changed', 'callback')
			expect(connection.events['volume_changed']).toEqual(['callback'])
		})

		it('Binds an event to a completely empty object', () => {
			const connection = {}

			bindEvent(connection, 'volume_changed', 'callback')
			expect(connection.events['volume_changed']).toEqual(['callback'])
		})

		it('Binds an event to a connection with a nonempty events object', () => {
			const connection = { events: { shuffle_mode_changed: ['anything'] } }

			bindEvent(connection, 'volume_changed', 'callback')
			expect(connection.events.volume_changed).toEqual(['callback'])
			expect(connection.events.shuffle_mode_changed).toEqual(['anything'])
			expect(connection.events.shuffle_mode_changed).not.toEqual(['callback'])
			expect(connection.events).toEqual({
				volume_changed: ['callback'],
				shuffle_mode_changed: ['anything']
			})
		})

		it('Adds a callback to a nonempty event, without deleting the old callback', () => {
			const connection = { events: { shuffle_mode_changed: ['anything'] } }

			bindEvent(connection, 'shuffle_mode_changed', 'callback')
			expect(connection.events.shuffle_mode_changed).toEqual([
				'anything',
				'callback'
			])
		})

		it('Prioritises old callbacks', () => {
			const connection = { events: { shuffle_mode_changed: ['anything'] } }

			bindEvent(connection, 'shuffle_mode_changed', 'callback')
			bindEvent(connection, 'shuffle_mode_changed', 'test')
			expect(connection.events.shuffle_mode_changed).toEqual([
				'anything',
				'callback',
				'test'
			])
		})
	})

	describe('Unbind callback works', () => {
		function test1() {}
		function test2() {}
		function test3() {}
		function test4() {}

		it('Removes an event from an object with one event', () => {
			const connection = {}
			bindEvent(connection, 'data', test1)
			unbindEvent(connection, 'data', test1)
			expect(connection).toEqual({ events: { data: [] } })
		})

		it('Removes only the specified event', () => {
			const connection1 = { events: { data: [test1, test2] } }
			unbindEvent(connection1, 'data', test1)
			expect(connection1).toEqual({ events: { data: [test2] } })

			const connection2 = { events: { data: [test1, test2] } }
			unbindEvent(connection2, 'data', test2)
			expect(connection2).toEqual({ events: { data: [test1] } })

			const connection3 = {
				events: { data: [test1, test2], volume_up: [test3, test4] }
			}
			unbindEvent(connection3, 'data', test2)
			expect(connection3).toEqual({
				events: { data: [test1], volume_up: [test3, test4] }
			})
		})

		it('Removes multiple events if only one event is specified', () => {
			const connection = {
				events: { data: [test1, test2], volume_up: [test3, test4] }
			}
			unbindEvent(connection, 'data')

			expect(connection).toHaveProperty('events')
			expect(connection).toHaveProperty('events.volume_up')
			expect(connection).toHaveProperty('events.data')

			expect(connection.events.data).toEqual([])
			expect(connection.events.volume_up).toEqual([test3, test4])
		})
	})

	describe('Trigger callbacks works', () => {
		it('Triggers a callback if it is the only one', () => {
			const mockCallback = jest.fn()
			const connection = {
				events: { data: [mockCallback] }
			}

			triggerEvent(connection, 'data')
			expect(mockCallback).toHaveBeenCalled()
		})

		it('Does nothing if the event has no callbacks, and does not break', () => {
			const mockCallback = jest.fn()
			const connection = {
				events: { data: [mockCallback] }
			}

			triggerEvent(connection, 'volume_up')
			expect(mockCallback).not.toHaveBeenCalled()
		})

		it('Only triggers the specified event', () => {
			const mockCallbacks = [jest.fn(), jest.fn()]
			const connection = {
				events: { data: [mockCallbacks[0]], volume_up: [mockCallbacks[1]] }
			}

			triggerEvent(connection, 'data')
			expect(mockCallbacks[0]).toHaveBeenCalled()
			expect(mockCallbacks[1]).not.toHaveBeenCalled()
		})

		it('Triggers the callback with correct data', () => {
			const mockData = { message: 'Hello world!' }
			const connection = {}
			const mockCallback = jest.fn()

			bindEvent(connection, 'heart_beat', mockCallback)
			triggerEvent(connection, 'heart_beat', mockData)

			expect(mockCallback).toHaveBeenCalledWith(mockData)
		})

		it('Triggers all callbacks for an event once and only once', () => {
			const mockCallbacks = [jest.fn(), jest.fn(), jest.fn()]
			const connection = {
				events: {
					data: [mockCallbacks[0], mockCallbacks[2], mockCallbacks[0]],
					volume_up: [mockCallbacks[1]]
				}
			}

			triggerEvent(connection, 'data')
			expect(mockCallbacks[0]).toHaveBeenCalled()
			expect(mockCallbacks[1]).not.toHaveBeenCalled()
			expect(mockCallbacks[2]).toHaveBeenCalled()

			expect(mockCallbacks[0]).toHaveBeenCalledTimes(1)
			expect(mockCallbacks[1]).toHaveBeenCalledTimes(0)
			expect(mockCallbacks[2]).toHaveBeenCalledTimes(1)
		})

		it('Triggers all callbacks in the correct order', () => {
			const called = Array(5).fill(false)

			const mockCallbacks = [
				jest.fn(() => {
					called[0] = true
					expect(called[2]).not.toBe(true)
				}),
				jest.fn(() => {
					expect(called[0]).toBe(true)
					called[1] = true
				}),
				jest.fn(() => {
					expect(called[1]).toBe(true)
					called[2] = true
				}),
				jest.fn(() => {
					expect(called[2]).toBe(true)
					called[3] = true
				}),
				jest.fn()
			]
			const connection = {}

			bindEvent(connection, 'data', mockCallbacks[0])
			bindEvent(connection, 'data', mockCallbacks[1])
			bindEvent(connection, 'volume_up', mockCallbacks[1])
			bindEvent(connection, 'data', mockCallbacks[2])
			bindEvent(connection, 'data', mockCallbacks[0])
			bindEvent(connection, 'data', mockCallbacks[3])
			bindEvent(connection, 'volume_up', mockCallbacks[4])

			triggerEvent(connection, 'data')
		})
	})

	describe('Use one response works', () => {
		it('Triggers a callback if it is the only one', () => {
			const connection = {}
			const mockCallback = jest.fn()
			bindResponse(connection, 'heart_beat', mockCallback)

			useOneResponse(connection, 'heart_beat')

			expect(mockCallback).toHaveBeenCalled()
		})

		it('Only triggers the first response', () => {
			const connection = {}
			const mockCallbacks = [jest.fn(), jest.fn(), jest.fn()]

			bindResponse(connection, 'volume_up', mockCallbacks[0])
			bindResponse(connection, 'heart_beat', mockCallbacks[1])
			bindResponse(connection, 'volume_up', mockCallbacks[2])

			useOneResponse(connection, 'heart_beat')

			expect(mockCallbacks[0]).not.toHaveBeenCalled()
			expect(mockCallbacks[1]).toHaveBeenCalled()
			expect(mockCallbacks[1]).toHaveBeenCalledTimes(1)
			expect(mockCallbacks[2]).not.toHaveBeenCalled()
		})

		it('Removes a callback after using it', () => {
			const connection = {}
			const mockCallbacks = [jest.fn(), jest.fn()]

			bindResponse(connection, 'heart_beat', mockCallbacks[0])
			bindResponse(connection, 'heart_beat', mockCallbacks[1])

			useOneResponse(connection, 'heart_beat')

			expect(mockCallbacks[0]).toHaveBeenCalled()
			expect(mockCallbacks[1]).not.toHaveBeenCalled()

			expect(connection).toEqual({
				responses: { heart_beat: [mockCallbacks[1]] }
			})
		})

		it('Triggers the callback with correct data', () => {
			const mockData = { message: 'Hello world!' }
			const connection = {}
			const mockCallback = jest.fn()

			bindResponse(connection, 'heart_beat', mockCallback)
			useOneResponse(connection, 'heart_beat', mockData)

			expect(mockCallback).toHaveBeenCalledWith(mockData)
		})

		it('Throws an error if the response has no callbacks', () => {
			let connection = {}
			expect(() => useOneResponse(connection, 'heart_beat')).toThrowError(
				'Unexpected response received'
			)

			connection = {}
			bindResponse(connection, 'heart_beat', () => {})
			useOneResponse(connection, 'heart_beat')
			expect(() => useOneResponse(connection, 'heart_beat')).toThrowError(
				'Unexpected response received'
			)
		})
	})
})
