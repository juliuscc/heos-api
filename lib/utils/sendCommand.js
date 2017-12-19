exports.sendCommand = (connection, command) => {
	const prefix = 'heos://'
	const postfix = '\r\n'
	const commandMessage = prefix + command + postfix
	// console.log(`Sending following message: ${commandMessage}`)
	connection.write(commandMessage)
}

exports.enumOnOrOff = value =>
	value === 'on' || value === 'off' ? value : value ? 'on' : 'off'

exports.quick_select_id = value => (value >= 1 && value <= 6 ? value : 1)
