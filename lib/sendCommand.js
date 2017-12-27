const { bindResponse } = require('./eventHandler')

const prefix = 'heos://'
const postfix = '\r\n'

const createSendCommand = responseBinder => (connection, command) => {
	return new Promise((resolve, reject) => {
		responseBinder(connection, command, resolve, reject)

		const commandMessage = prefix + command + postfix

		if (process.env.NODE_ENV === 'development')
			console.log(`Sending following message: ${commandMessage}`)

		connection.connection.write(commandMessage)
	})
}

exports.createSendCommand = createSendCommand
exports.defaultSendCommand = createSendCommand(bindResponse)

exports.createSender = (commandGroup, sendCommand) => (
	connection,
	command,
	parameters = {}
) => {
	const fullCommand = `${commandGroup}/${command}`

	const parameterString =
		typeof parameters === 'string'
			? parameters.length === 0 ? '' : '?' + parameters
			: Object.keys(parameters).length === 0
				? ''
				: '?' +
					Object.entries(parameters)
						.map(([attribute, value]) => `${attribute}=${value}`)
						.reduce((ack, parameter) => `${ack}&${parameter}`)

	const output = fullCommand + parameterString
	return sendCommand(connection, fullCommand, output)
}
