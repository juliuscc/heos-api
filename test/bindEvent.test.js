const { bindEvent, unbindEvent, bindResponse } = require('../lib/bindEvent.js')

describe('Bind callbacks works', () => {
	it('Binds an event to a connection with an empty predefined events object', () => {
		const connection = { events: {} }

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
