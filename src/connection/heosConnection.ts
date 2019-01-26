import { HeosEventEmitter, HeosConnectionEventEmitter } from '../listen/responseEventHandler'
import { HeosCommandAttribute } from '../types'
import { generateHeosCommand } from '../write/heosCommand'

export class HeosConnection {
	constructor(
		on: HeosEventEmitter,
		once: HeosEventEmitter,
		socketWrite: (message: string) => any
	) {
		this.on = (event, listener) => {
			on(event, listener)
			return this
		}
		this.once = (event, listener) => {
			once(event, listener)
			return this
		}
		this.socketWrite = socketWrite
	}

	on: HeosConnectionEventEmitter
	once: HeosConnectionEventEmitter
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
