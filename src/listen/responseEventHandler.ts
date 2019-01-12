import { HeosResponse, HeosEvent, HeosCommand } from '../types'
import { EventEmitter } from 'events'
import { generateHeosCommandString } from './heosCommand'

export class ResponseEventHandler {
	constructor() {
		this.emitter = new EventEmitter()
	}

	emitter: EventEmitter

	put(message: HeosResponse | HeosEvent): void {
		const eventString = generateHeosCommandString(message.heos.command)

		this.emitter.emit(eventString)
	}

	on(
		event: HeosCommand,
		listener: (message: HeosResponse | HeosEvent) => void
	): ResponseEventHandler {
		const eventString = generateHeosCommandString(event)

		this.emitter.on(eventString, listener)

		return this
	}
}
