function triggerEvent(connection, event, message, payload) {
	const callbacks = connection.events[event] || []
	callbacks.forEach(callback => callback({ event, message, payload }))
}

function triggerResponse(connection, event, message, payload = {}) {
	const [callback, ...rest] = connection.responses[event]
	connection.responses[event] = [rest]
	callback({ event, message, payload })
}

function breakCommand(command) {
	const [type, event] = command.split('/')
	return { _rawCommand: command, type, event }
}

function parseMessage(message) {
	const attributes = message.split('&').map(information => {
		const [type, value] = information.split('=')
		return { type, value }
	})
	return { _rawMessage: message, attributes }
}

module.exports = (buffer, connection) => {
	const messages = buffer
		.toString()
		.split('\r\n')
		.filter(line => line.length !== 0)

	messages.forEach(message => {
		const { heos, payload = {} } = JSON.parse(message)

		const { type, event } = breakCommand(heos.command)
		const parsedMessage = parseMessage(heos.message)

		type === 'event'
			? triggerEvent(connection, event, parsedMessage, payload)
			: triggerResponse(connection, event, parsedMessage, payload)
	})
}
