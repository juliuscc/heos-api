# heos-api

[![npm](https://img.shields.io/npm/v/heos-api.svg?style=flat-square)](https://www.npmjs.com/package/heos-api)
[![npm](https://img.shields.io/npm/dm/localeval.svg?style=flat-square)](https://www.npmjs.com/package/heos-api)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/juliuscc/heos-api/blob/master/LICENSE)
[![Codecov](https://img.shields.io/codecov/c/github/codecov/example-python.svg?style=flat-square)](https://codecov.io/gh/juliuscc/heos-api)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](https://travis-ci.org/juliuscc/heos-api)

A Node.js API wrapper for the Heos CLI API.

* 💯 **All commands suported:** heos-api supports every specified Heos CLI API command, implemented according to the [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf).
* 🎉 **Promise based wrappers:** Every command sent, gets coupled with the response in an easy to handle promise, saving headaches trying to figure out which response belongs to which command.
* 🔥 **Enums and constants:** All enumerations and constants are predefined, so that you don't have to figure out how to send commands with valid parameters.
* 🛰 **Event handling:** React to anything that happens to your heos control system, by binding any event to one or more callbacks.

## Getting started

Install heos-api using `npm`:

```
npm install --save heos-api
```

Or via `yarn`:
```
yarn add heos-api
```

Let's get started with connecting to a heos control system:

```js
const heos = require('heos-api')

heos.discoverAndCreateConnection()
  .then(() => console.log('Connection established! 🌈'))
```

To send a command just use one of the predefined heos-api functions. The response will resolve the promise:

```js
const heos = require('heos-api')

heos.discoverAndCreateConnection()
  .then(connection =>
    heos.commands.player.get_players(connection)
  )
  .then(players =>
    console.log(`The available players are: ${players}`)
  )
```

Commands that require parameters works as well:

```js
const heos = require('heos-api')

heos.discoverAndCreateConnection()
  .then(connection =>
    heos.commands.system.sign_in(
      connection,
      'user@gmail.com',
      'hunter2'
    )
  )
```

To use enums or constants just use `heos.constants`:

```js
const heos = require('heos-api')
const { repeat_state, shuffle_state } = heos.constants

heos.discoverAndCreateConnection()
  .then(connection => 
    heos.commands.player.get_players(connection)
      .then(players => players[0])
      .then(player =>
        heos.commands.player.set_play_mode(
          connection,
          player.pid,
          repeat_state.on_one,
          shuffle_state.off
        )
      ))
```

## Documentation
Learn more about using heos-api at:
* ~~API reference~~ 🚧 Under construction 🚧
* ~~Guides~~ 🚧 Under construction 🚧
* [The GitHub page](https://github.com/JuliusCC/heos-api)
* [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf)

## Contributing
Send issues and pull requests with your problems or ideas.
