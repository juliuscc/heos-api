const breakCommand = rawCommand => {
	const checkValidity = () => {
		return rawCommand === undefined
			? 'Input missing'
			: typeof rawCommand !== 'string'
				? 'Command must be a string'
				: rawCommand.length === 0
					? 'Input missing'
					: rawCommand.split('/').length !== 2
						? 'Undefined error parsing command'
						: false
	}

	const error = checkValidity()
	if (error) return { error }

	const [command_group, command] = rawCommand.split('/')

	if (command_group.length === 0) return { error: 'Command group missing' }
	if (command.length === 0) return { error: 'Command missing' }

	return { rawCommand, command_group, command }
}

const parseMessage = message => {
	const attributes = message.split('&').map(information => {
		const [type, value] = information.split('=')
		return { type, value }
	})
	return { _rawMessage: message, attributes }
}

const createDataHandler = (triggerEvent, useOneResponse) => (
	connection,
	buffer
) => {
	const messages = buffer
		.toString()
		.split('\r\n')
		.filter(line => line.length !== 0)

	messages.forEach(message => {
		const { heos, payload = {} } = JSON.parse(message)

		const { type, event } = breakCommand(heos.command)
		const parsedMessage = parseMessage(heos.message)

		// type === 'event'
		// 	? triggerEvent(connection, event, parsedMessage, payload)
		// 	: triggerResponse(connection, event, parsedMessage, payload)
	})
}

module.exports = { breakCommand, parseMessage, createDataHandler }
