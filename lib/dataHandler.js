function triggerEvent(connection, event, message, payload) {
	// console.log(`Trigger event: ${event} with message ${splitMessage(message)}`)
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

function splitMessage(message) {
	return message.split('&').map(information => {
		const [type, value] = information.split('=')
		return { _rawMessage: message, type, value }
	})
}

module.exports = (buffer, connection) => {
	const messages = buffer
		.toString()
		.split('\r\n')
		.filter(line => line.length !== 0)

	messages.forEach(message => {
		const { heos, payload = {} } = JSON.parse(buffer.toString())

		const { type, event } = breakCommand(heos.command)

		type === 'event'
			? triggerEvent(connection, event, heos.message, payload)
			: triggerResponse(connection, event, heos.message, payload)
	})
}
