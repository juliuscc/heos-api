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

		it('Removes an event from an object with one event', () => {
			const connection = {}
			bindEvent(connection, 'hello', test1)
			unbindEvent(connection, 'hello', test1)
			expect(connection).toEqual({ events: {} })
		})

		// it('Removes only the specified event', () => {
		// 	const connection = { events: [test1, test2] }
		// 	unbindEvent(connection, undefined, test1)
		// 	expect(connection).toEqual({ events: [test2] })
		// })
		it('Removes multiple events if only one event is specified')
	})

	describe('Use callback works', () => {})

	describe('Trigger callbacks works', () => {})
})
