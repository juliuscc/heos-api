import { HeosResponse, HeosEvent, HeosCommand, HeosEventListener } from '../types'
import { EventEmitter } from 'events'
import { generateHeosCommandString } from './heosCommand'
import { HeosConnection } from '../connection/heosConnection'

export type HeosConnectionAllEventEmitter = (listener: HeosEventListener) => HeosConnection

/**
 * @param event The event to trigger the listener on.
 * @param listener A callback function that will be triggered when the event happens.
 * @returns A HeosConnection
 */
export type HeosConnectionEventEmitter = (
	event: HeosCommand,
	listener: HeosEventListener
) => HeosConnection

/**
 * @param event The event to trigger the listener on.
 * @returns A HeosConnection
 */
export type HeosAllEventEmitter = (listener: HeosEventListener) => ResponseEventHandler

export type HeosEventEmitter = (
	event: HeosCommand,
	listener: HeosEventListener
) => ResponseEventHandler

export class ResponseEventHandler {
	constructor() {
		this.emitter = new EventEmitter()
		this.listenersOnAll = []
	}

	emitter: EventEmitter
	listenersOnAll: (HeosEventListener)[]

	put(message: HeosResponse | HeosEvent): void {
		const eventString = generateHeosCommandString(message.heos.command)
		this.listenersOnAll.forEach(listener => listener(message))
		this.emitter.emit(eventString, message)
	}

	on(event: HeosCommand, listener: HeosEventListener): ResponseEventHandler {
		const eventString = generateHeosCommandString(event)
		this.emitter.on(eventString, listener)
		return this
	}

	once(event: HeosCommand, listener: HeosEventListener): ResponseEventHandler {
		const eventString = generateHeosCommandString(event)
		this.emitter.once(eventString, listener)
		return this
	}

	onAll(listener: HeosEventListener): ResponseEventHandler {
		this.listenersOnAll = [...this.listenersOnAll, listener]
		return this
	}
}
