// Hack to keep process alive
setInterval(() => {}, 1000000000)
// Hack end

const util = require('util')

const api = require('./index')

api.getConnection().then(connection => {
	// connection.events = ['test1', 'test2']
	// console.log(connection.events)
	api.commands.prettify_json_response(connection, 'on')
	api.commands.register_for_change_events(connection, true)
})
