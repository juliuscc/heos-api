const {
	triggerEvent,
	resolveOneResponse,
	rejectOneResponse
} = require('./eventHandler')

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
	if (error) return { rawCommand, error }

	const [command_group, command] = rawCommand.split('/')

	if (command_group.length === 0)
		return { rawCommand, error: 'Command group missing' }
	if (command.length === 0) return { rawCommand, error: 'Command missing' }

	return { rawCommand, command_group, command }
}

const parseMessage = rawMessage => {
	if (!rawMessage) return undefined
	if (!rawMessage.includes('=')) return { rawMessage, message: rawMessage }
	const parameters = rawMessage
		.split('&')
		.map(parameter => {
			const [attribute, value] = parameter.split('=')
			return { attribute, value }
		})
		.reduce((list, parameter) => {
			list[parameter.attribute] = parameter.value
			return list
		}, {})

	return { rawMessage, message: parameters }
}

/**
 * TODO: Add 'options' next to message and payload
 *
 */
const createDataHandler = (
	triggerEvent,
	resolveOneResponse,
	rejectOneResponse
) => (connection, buffer) => {
	const responses = buffer
		.toString()
		.split('\r\n')
		.filter(row => row.length > 0)
	responses.forEach(commandResponse => {
		const response = JSON.parse(commandResponse)
		const commandGroup = breakCommand(response.heos.command).command_group
		if (commandGroup === 'event')
			triggerEvent(connection, response.heos.command, {
				message: parseMessage(response.heos.message)
					? parseMessage(response.heos.message).message
					: undefined,
				payload: response.payload
			})
		else if (!response.heos.result || response.heos.result !== 'fail')
			resolveOneResponse(connection, response.heos.command, {
				message: parseMessage(response.heos.message)
					? parseMessage(response.heos.message).message
					: undefined,
				payload: response.payload
			})
		else
			rejectOneResponse(connection, response.heos.command, {
				message: parseMessage(response.heos.message)
					? parseMessage(response.heos.message).message
					: undefined
			})
	})
}

const dataEventHandler = createDataHandler(
	triggerEvent,
	resolveOneResponse,
	rejectOneResponse
)

module.exports = {
	breakCommand,
	parseMessage,
	createDataHandler,
	dataEventHandler
}
