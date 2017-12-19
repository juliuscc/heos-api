exports.bindEvent = (connection, event, callback) => {
	connection.events[event] = connection.events[event]
		? [...connection.events[event], callback]
		: [callback]
}

exports.unbindEvent = (connection, response, callback) => {}

exports.bindResponse = (connection, response, callback) => {
	connection.responses[response] = connection.responses[response]
		? [...connection.responses[response], callback]
		: [callback]
}
