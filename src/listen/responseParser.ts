import { HeosResponse, HeosEvent } from '../types'
import { parseHeosCommandString } from './heosCommand'
import { parseHeosMessageString } from './heosResponse'

const messageDelimiter = '\r\n'

function isValidHeosResponseMessage(message: any): boolean {
	if (
		!Object.keys(message).length ||
		(message.hasOwnProperty('unparsed') &&
			typeof message.unparsed === 'string' &&
			(!message.hasOwnProperty('parsed') ||
				(message.hasOwnProperty('parsed') && typeof message.parsed === 'object')))
	) {
		return true
	}
	return false
}

function isCorrectResponse(response: any): boolean {
	return (
		response.hasOwnProperty('heos') &&
		response.heos.hasOwnProperty('command') &&
		typeof response.heos.command === 'string'
	)
}

function isHeosResponse(response: any): response is HeosResponse {
	if (response.hasOwnProperty('heos')) {
		const heos: any = response.heos

		if (
			heos.hasOwnProperty('command') &&
			heos.hasOwnProperty('result') &&
			heos.hasOwnProperty('message')
		) {
			if (
				typeof heos.command === 'object' &&
				typeof heos.result === 'string' &&
				typeof heos.message === 'object' &&
				isValidHeosResponseMessage(heos.message)
			) {
				if (
					heos.command.hasOwnProperty('commandGroup') &&
					heos.command.hasOwnProperty('command')
				) {
					if (
						typeof heos.command.commandGroup === 'string' &&
						typeof heos.command.command === 'string'
					) {
						return true
					}
				}
			}
		}
	}
	return false
}

function isHeosEvent(response: any): response is HeosEvent {
	if (response.hasOwnProperty('heos')) {
		const heos: any = response.heos

		if (heos.hasOwnProperty('command')) {
			if (
				typeof heos.command === 'object' &&
				heos.command.hasOwnProperty('commandGroup') &&
				heos.command.hasOwnProperty('command') &&
				typeof heos.command.commandGroup === 'string' &&
				typeof heos.command.command === 'string'
			) {
				if (heos.hasOwnProperty('message') && typeof heos.message === 'object') {
					return isValidHeosResponseMessage(heos.message)
				} else {
					return true
				}
			}
		}
	}
	return false
}

export class ResponseParser {
	constructor(callback: (message: HeosResponse | HeosEvent) => void) {
		this.callback = callback
	}

	callback: (message: HeosResponse | HeosEvent) => void
	buffer: string = ''

	put(data: string) {
		this.buffer += data

		const messages: string[] = this.buffer.split(messageDelimiter)
		const lastMessage: string | undefined = messages.pop()

		if (lastMessage === '') {
			messages.push(lastMessage)
			this.buffer = ''
		} else {
			this.buffer = lastMessage || ''
		}

		try {
			messages
				.filter((row: string) => row.length > 0)
				.map((message: string) => JSON.parse(message))
				.map((response: any) => {
					if (isCorrectResponse) {
						return response
					} else {
						throw new TypeError()
					}
				})
				.map(response => {
					const command = parseHeosCommandString(response.heos.command)
					response.heos.command = command
					return response
				})
				.map(response => {
					const message = parseHeosMessageString(response.heos.message)
					response.heos.message = message
					return response
				})
				.map((response: any) => {
					if (isHeosResponse(response) || isHeosEvent(response)) {
						return response
					} else {
						throw new TypeError()
					}
				})
				.forEach(response => {
					try {
						this.callback(response)
					} catch (error) {
						console.log('Error handling response')
					}
				})
		} catch (error) {
			if (error instanceof TypeError) {
				console.log('Heos response has wrong structure. Flushing buffer.')
			} else {
				console.log('Error parsing incoming messages. Flushing buffer.')
			}
			this.buffer = ''
		}
	}
}
