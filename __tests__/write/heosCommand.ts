import { generateHeosCommand } from '../../src/write/heosCommand'

describe('Heos commands can be correctly created', () => {
	test('A new command can be created', () => {
		const command = generateHeosCommand('system', 'heart_beat')

		expect(command).toMatch(new RegExp('^heos://'))
		expect(command).toEqual('heos://system/heart_beat\r\n')
	})

	test('A command can have attributes', () => {
		const command = generateHeosCommand('player', 'volume_up', {
			pid: 2,
			step: 5
		})

		expect(command).toEqual('heos://player/volume_up?pid=2&step=5\r\n')
	})

	test('A command can have zero attributes', () => {
		const command = generateHeosCommand('system', 'heart_beat', {})

		expect(command).toEqual('heos://system/heart_beat\r\n')
	})

	test('A command can have one attribute', () => {
		const command = generateHeosCommand('player', 'get_volume', { pid: 1 })

		expect(command).toEqual('heos://player/get_volume?pid=1\r\n')
	})

	test('Strings are correctly encoded', () => {
		const command = generateHeosCommand('system', 'register_for_change_events', {
			enable: 'on'
		})

		expect(command).toEqual('heos://system/register_for_change_events?enable=on\r\n')
	})
})
