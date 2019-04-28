import { HeosResponse, HeosEvent, HeosCommand } from '../types'
import { EventEmitter } from 'events'
import { generateHeosCommandString } from './heosCommand'
import { HeosConnection } from '../connection/heosConnection'

export type HeosConnectionAllEventEmitter = (
	listener: (message: HeosResponse | HeosEvent) => void
) => HeosConnection

/**
 * @param event The event to trigger the listener on.
 * @param listener A callback function that will be triggered when the event happens.
 * @returns A HeosConnection
 */
export type HeosConnectionEventEmitter = (
	event: HeosCommand,
	listener: (message: HeosResponse | HeosEvent) => void
) => HeosConnection

/**
 * @param event The event to trigger the listener on.
 * @returns A HeosConnection
 */
export type HeosAllEventEmitter = (
	listener: (message: HeosResponse | HeosEvent) => void
) => ResponseEventHandler

export type HeosEventEmitter = (
	event: HeosCommand,
	listener: (message: HeosResponse | HeosEvent) => void
) => ResponseEventHandler

export class ResponseEventHandler {
	constructor() {
		this.emitter = new EventEmitter()
		this.listenersOnAll = []
	}

	emitter: EventEmitter
	listenersOnAll: ((message: HeosResponse | HeosEvent) => void)[]

	put(message: HeosResponse | HeosEvent): void {
		const eventString = generateHeosCommandString(message.heos.command)
		this.listenersOnAll.forEach(listener => listener(message))
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

	onAll(listener: (message: HeosResponse | HeosEvent) => void): ResponseEventHandler {
		this.listenersOnAll = [...this.listenersOnAll, listener]
		return this
	}
}
