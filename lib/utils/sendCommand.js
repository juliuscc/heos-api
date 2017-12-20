const prefix = 'heos://'
const postfix = '\r\n'

exports.sendCommand = (connection, command) => {
	const commandMessage = prefix + command + postfix
	// console.log(`Sending following message: ${commandMessage}`)
	connection.write(commandMessage)
}

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

	const output = prefix + fullCommand + parameterString + postfix
	return sendCommand(connection, fullCommand, output)
}

exports.enumOnOrOff = value =>
	value === 'on' || value === 'off' ? value : value ? 'on' : 'off'

exports.quick_select_id = value => (value >= 1 && value <= 6 ? value : 1)
