import {
	HeosEventEmitter,
	HeosConnectionEventEmitter,
	HeosAllEventEmitter,
	HeosConnectionAllEventEmitter
} from '../listen/responseEventHandler'
import { generateHeosCommand } from '../write/heosCommand'
import { HeosCommandAttribute } from '../types'

export class HeosConnection {
	constructor(
		on: HeosEventEmitter,
		once: HeosEventEmitter,
		onAll: HeosAllEventEmitter,
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

		this.onAll = listener => {
			onAll(listener)
			return this
		}

		this.socketWrite = socketWrite
	}

	on: HeosConnectionEventEmitter
	once: HeosConnectionEventEmitter
	onAll: HeosConnectionAllEventEmitter
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
