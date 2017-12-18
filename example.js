const util = require('util')

const api = require('./index')
const commands = require('./lib/commands')

api.getConnection().then(connection => api.commands.heart_beat(connection))
// .then(connection =>
// 	console.log(
// 		`This is the connection: ${util.inspect(connection, false, null)}`
// 	)
// )

// Hack to keep process alive
setInterval(() => {}, 1000000000)
