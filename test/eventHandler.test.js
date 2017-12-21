const { bindEvent, bindResponse, unbindEvent } = require('../lib/eventHandler')

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

	describe('Use callback works', () => {})

	describe('Trigger callbacks works', () => {})
})
