import { HeosCommand } from '../src/heosCommand'

describe('Heos commands can be correctly created', () => {
	test('A new command can be created', () => {
		const command = new HeosCommand('system', 'heart_beat')

		expect(command.asString()).toMatch(new RegExp('^heos://'))
		expect(command.asString()).toEqual('heos://system/heart_beat\r\n')
	})

	test('A command can have attributes', () => {
		const command = new HeosCommand('player', 'volume_up', {
			pid: 2,
			step: 5
		})

		expect(command.asString()).toEqual(
			'heos://player/volume_up?pid=2&step=5\r\n'
		)
	})

	test('A command can have no attributes', () => {
		const command = new HeosCommand('system', 'heart_beat', {})

		expect(command.asString()).toEqual('heos://system/heart_beat\r\n')
	})

	test('A command can have one attribute', () => {
		const command = new HeosCommand('player', 'get_volume', { pid: 1 })

		expect(command.asString()).toEqual('heos://player/get_volume?pid=1\r\n')
	})
})

console.log(HeosCommand)
