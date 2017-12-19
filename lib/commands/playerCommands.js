const { sendCommand, enumOnOrOff } = require('../utils/sendCommand')
const { bindResponse } = require('../bindEvent')

exports.get_players = connection =>
	new Promise((resolve, reject) => {
		bindResponse(connection, 'get_players', resolve)

		const message = 'player/get_players'
		sendCommand(connection, message)
	})
