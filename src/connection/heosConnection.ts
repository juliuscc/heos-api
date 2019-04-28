import {
	HeosEventEmitter,
	HeosConnectionEventEmitter,
	HeosAllEventEmitter,
	HeosConnectionAllEventEmitter
} from '../listen/responseEventHandler'
import { generateHeosCommand } from '../write/heosCommand'
import { HeosCommandAttribute } from '../types'

/**
 * An object representing a connection with a HEOS device, and provides methods to communicate with the connected HEOS device.
 * @remark All the methods returns a HeosConnection which means that they are chainable.
 */
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

	private socketWrite: (message: string) => any

	/**
	 * Adds listener to events. When the event happens the listener will be triggered with the response.
	 * @param event The event to trigger the listener on.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	on: HeosConnectionEventEmitter

	/**
	 * Adds a **one-time** listener for an event. When the event happens the listener will be triggered with the response.
	 * @param event The event to trigger the listener on.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	once: HeosConnectionEventEmitter

	/**
	 * Adds listener to all events. When any event happens the listener will be triggered with the response.
	 * @param listener A callback function that will be triggered when the event happens.
	 * @returns A HeosConnection
	 */
	onAll: HeosConnectionAllEventEmitter

	/**
	 * Sends a command to the connected HEOS device. Check the [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf) to learn all the commands that can be sent.
	 * @param commandGroup The command group
	 * @param command The command to send
	 * @param attributes Optional attributes to include with the command
	 * @returns A HeosConnection
	 */
	write(
		commandGroup: string,
		command: string,
		attributes?: HeosCommandAttribute
	): HeosConnection {
		this.socketWrite(generateHeosCommand(commandGroup, command, attributes))
		return this
	}
}
