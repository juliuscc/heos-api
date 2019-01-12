import { HeosResponse, HeosEvent, HeosCommand } from '../types'
import { EventEmitter } from 'events'
import { generateHeosCommandString } from './heosCommand'

export type HeosEventEmitter = (
	event: HeosCommand,
	listener: (message: HeosResponse | HeosEvent) => void
) => ResponseEventHandler

export class ResponseEventHandler {
	constructor() {
		this.emitter = new EventEmitter()
	}

	emitter: EventEmitter

	put(message: HeosResponse | HeosEvent): void {
		const eventString = generateHeosCommandString(message.heos.command)
		this.emitter.emit(eventString, message)
	}

	on(
		event: HeosCommand,
		listener: (message: HeosResponse | HeosEvent) => void
	): ResponseEventHandler {
		const eventString = generateHeosCommandString(event)
		this.emitter.on(eventString, listener)
		return this
	}

	once(
		event: HeosCommand,
		listener: (message: HeosResponse | HeosEvent) => void
	): ResponseEventHandler {
		const eventString = generateHeosCommandString(event)
		this.emitter.once(eventString, listener)
		return this
	}
}
