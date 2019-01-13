import { parseHeosCommandString } from '../../src/listen/heosCommand'

describe('Testing that parsing and generating heos commands works', () => {
	it('Can recognize a simple command', () => {
		expect(parseHeosCommandString('system/heart_beat')).toEqual({
			commandGroup: 'system',
			command: 'heart_beat'
		})
	})
})
