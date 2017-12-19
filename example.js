// Hack to keep process alive
setInterval(() => {}, 1000000000)
// Hack end

const util = require('util')

const api = require('./index')

api.getConnection().then(connection => {
	api.commands.register_for_change_events(connection, 'on')
	api.bindEvent(connection, 'player_volume_changed', console.log)
})
