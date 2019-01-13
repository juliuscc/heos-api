import { HeosResponse, HeosEvent } from '../types'

const messageDelimiter = '\r\n'

function isHeosResponse(response: any): response is HeosResponse {
	if (response.hasOwnProperty('heos')) {
		const heos: any = response.heos

		if (
			heos.hasOwnProperty('command') &&
			heos.hasOwnProperty('result') &&
			heos.hasOwnProperty('message')
		) {
			if (
				typeof heos.command === 'string' &&
				typeof heos.result === 'string' &&
				typeof heos.message === 'string'
			) {
				return true
			}
		}
	}
	return false
}

function isHeosEvent(response: any): response is HeosEvent {
	if (response.hasOwnProperty('heos')) {
		const heos: any = response.heos

		if (heos.hasOwnProperty('command')) {
			if (typeof heos.command === 'string') {
				if (heos.hasOwnProperty('message')) {
					return typeof heos.message === 'string'
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
					if (isHeosResponse(response) || isHeosEvent(response)) {
						return response
					} else {
						throw new TypeError()
					}
				})
				.forEach(this.callback)
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
