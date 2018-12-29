const messageDelimiter = '\r\n'

export class HeosResponseParser {
	constructor(callback: (message: object) => void) {
		this.callback = callback
	}

	callback: (message: object) => void
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
				.filter(row => row.length > 0)
				.map(message => JSON.parse(message))
				.forEach(object => this.callback(object))
		} catch {
			console.log('Error parsing incoming messages. Flushing buffer.')
			this.buffer = ''
		}
	}
}
