import { HeosEventEmitter } from '../listen/responseEventHandler'
import { HeosCommandAttribute } from '../types'
import { generateHeosCommand } from '../write/heosCommand'

export class HeosConnection {
	constructor(
		on: HeosEventEmitter,
		once: HeosEventEmitter,
		socketWrite: (message: string) => any
	) {
		this.on = on
		this.once = once
		this.socketWrite = socketWrite
	}

	on: HeosEventEmitter
	once: HeosEventEmitter
	private socketWrite: (message: string) => any

	write(
		commandGroup: string,
		command: string,
		attributes?: HeosCommandAttribute
	): HeosConnection {
		this.socketWrite(generateHeosCommand(commandGroup, command, attributes))
		return this
	}
}
