// Hack to keep process alive
setInterval(() => {}, 1000000000)
// Hack end

const util = require('util')

const api = require('./index')

api.getConnection().then(connection => {
	api.commands.heart_beat(connection).then(console.log)
})
