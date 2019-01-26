import { connect } from '../../src/connection/connection'
import net from 'net'

jest.mock('net')

describe('Establishing a connection to a heos device', () => {
	test('Connect resolves => Mocking works', () => {
		expect.assertions(1)
		return connect('192.168.0.5').then(() => {
			expect(true).toBeTruthy()
		})
	})

	test('Connect returns correct object', () => {
		expect.assertions(3)
		return connect('192.168.0.5').then(connection => {
			expect(connection).toHaveProperty('write')
			expect(connection).toHaveProperty('on')
			expect(connection).toHaveProperty('once')
		})
	})

	test('Connect.on works', () => {
		// @ts-ignore
		net.__setOnData((callback: Function) =>
			setTimeout(
				() =>
					callback(
						'{"heos": {"command": "system/heart_beat", "result": "success", "message": "m"}}\r\n'
					),
				100
			)
		)

		return connect('192.168.0.5').then(connection =>
			connection.on({ commandGroup: 'system', command: 'heart_beat' }, message =>
				expect(message).toHaveProperty('heos')
			)
		)
	})
})
