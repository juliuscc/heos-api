const messageDelimiter = '\r\n'

export class HeosResponseParser {
	callback: () => any

	constructor(callback: any) {
		this.callback = callback
	}

	put(data: string) {
		if (data.includes(messageDelimiter)) {
			const rows = data.split(messageDelimiter)
			const messages = rows.filter(row => row.length > 0)
			messages.forEach(this.callback)
		}
	}
}
