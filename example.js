// Hack to keep process alive
setInterval(() => {}, 1000000000)
// Hack end

const heos = require('./lib/index.js')

heos.discoverAndCreateConnection().then(console.log)

// heos.getConnection().then(connection => {
// 	heos.commands
// 		.get_players(connection)
// 		.then(player => player.payload[0].pid)
// 		.then(pid => heos.commands.get_now_playing_media(connection, pid))
// 		.then(console.log)
// })
