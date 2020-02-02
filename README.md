# heos-api

[![npm](https://img.shields.io/npm/v/heos-api.svg?style=flat-square)](https://www.npmjs.com/package/heos-api)
[![npm](https://img.shields.io/npm/dm/heos-api.svg?style=flat-square)](https://www.npmjs.com/package/heos-api)
[![license](https://img.shields.io/github/license/juliuscc/heos-api.svg?style=flat-square)](https://github.com/juliuscc/heos-api/blob/master/LICENSE)
[![Coverage Status](https://img.shields.io/coveralls/github/juliuscc/heos-api.svg?style=flat-square)](https://coveralls.io/github/juliuscc/heos-api?branch=master)
[![Travis](https://img.shields.io/travis/juliuscc/heos-api/master.svg?style=flat-square)](https://travis-ci.org/juliuscc/heos-api)

A zero-dependency low level Node.js api-wrapper for communicating with HEOS devices. It enables developers to find, connect to, and communicate with HEOS devices.

## Features

-   🔎 **Discover devices:** Dead simple discovery of HEOS devices.
-   🎯 **Send any command:** Send commands with a simple api.
-   🛰 **Event handling:** React to anything that happens to your HEOS control system, by binding any event to one or more callbacks.
-   🚫 **Zero dependency:** Don't worry about any `left-pad` or `event-stream` vulnerabilities, with this zero-dependency library.
-   ✨ **Intellisense:** Really nice intellisense suggestions.

## Table of Contents

-   [Example](#example)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Connecting to devices](#connecting-to-devices)
        -   [heos.discoverDevices(timeout, onDiscover[, onTimeout])](#heosdiscoverdevicestimeout-ondiscover-ontimeout)
        -   [heos.discoverOneDevice([timeout])](#heosdiscoveronedevicetimeout)
        -   [heos.discoverAndConnect([timeout])](#heosdiscoverandconnecttimeout)
        -   [heos.connect(address)](#heosconnectaddress)
    -   [HeosConnection](#heosconnection)
        -   [connection.write(commandGroup, command[, attributes])](#connectionwritecommandgroup-command-attributes)
        -   [connection.on(event, listener)](#connectiononevent-listener)
        -   [connection.once(event, listener)](#connectiononceevent-listener)
        -   [connection.onAll(listener)](#connectiononalllistener)
        -   [connection.onClose(listener)](#connectiononcloselistener)
        -   [connection.onError(listener)](#connectiononerrorlistener)
        -   [HeosEvent and HeosResponse](#heosevent-and-heosresponse)
-   [Documentation](#documentation)
-   [Contributing](#contributing)

## Example

```js
const heos = require('heos-api')

heos.discoverAndConnect().then(connection =>
    connection
        .onAll(console.log)
        .on(
            {
                commandGroup: 'event',
                command: 'player_volume_changed'
            },
            console.info
        )
        .write('system', 'prettify_json_response', { enable: 'on' })
        .write('system', 'heart_beat')
        .write('player', 'set_volume', { pid: 1, level: 20 })
)
```

## Installation

Install heos-api using `npm`:

```
npm install heos-api
```

## Usage

The library is very simple and easy to use. There exists three functions to discover HEOS devices and establish a connection with a HEOS device. When a connection is established the HeosConnection object provides three methods to communicate with a HEOS device.

### Connecting to devices

The `heos` object has two ways of finding devices and one way to connect to a device:

-   `heos.discoverDevices()`
-   `heos.discoverOneDevice()`
-   `heos.connect()`

#### heos.discoverDevices(options, onDiscover[, onTimeout])

-   `options`: { timeout?: number, port?: number, address?: string } || number
-   `onDiscover`: (address: string) => void
-   `onTimeout`: (addresses: string[]) => void

Tries to discover all available HEOS devices in the network. `port` and `address` of `options` is for connecting to a user specified network interface. When `options.timeout` or `options` (type `number`) milliseconds have passed the search will end. Every time a HEOS device is discovered `onDiscover(address)` will be triggered, where `address` is the ip-address of the device found. When the search ends `onTimeout(addresses[])` will be triggered with an array with all the devices found.

The function does not return a value.

```js
heos.discoverDevices({ timeout: 3000 }, console.log, () => {})
// Logs out the addresses of every HEOS device in the network, and will end search after 3 seconds
```

#### heos.discoverOneDevice([options])

-   `options`: { timeout?: number, port?: number, address?: string } || number

Finds one HEOS device in the network. `port` and `address` of `options` is for connecting to a user specified network interface. A promise is returned that will resolve when the first device is found, or reject if no devices are found before `options.timeout` or `options` (type `number`) milliseconds have passed. If the function resolves it will resolve with the address of the HEOS device found.

`heos.discoverDevices()` is used under the hood

```js
heos.discoverOneDevice().then(console.log)
// Logs out the address of a HEOS device
```

#### heos.discoverAndConnect([options])

-   `options`: { timeout?: number, port?: number, address?: string } || number

Finds one HEOS device in the network, and connects to it. `port` and `address` of `options` is for connecting to a user specified network interface. A promise is returned that will resolve when the first device is found, or reject if no devices are found before `options.timeout` or `options` (type `number`) milliseconds have passed. If the function resolves it will resolve with a HeosConnection.

```js
heos.discoverAndConnect().then(console.log)
// Logs out the HeosConnection object
```

#### heos.connect(address)

-   `address`: string

Establishes a connection with a HEOS device, and will return a promise. The promise resolves with a [HeosConnection](#HeosConnection) that can be used to communicate with a HEOS device.

Use this function when you know the address of a HEOS device. It is recommended to use `heos.discoverOneDevice()` to find out an address, or simply use `heos.discoverAndConnect()`.

```js
heos.discoverOneDevice().then(address => heos.connect(address))
// Connects to a HEOS device
```

### HeosConnection

`HeosConnection` is an object representing a connection with a HEOS device, and provides methods to communicate with the connected HEOS device. All the methods returns a `HeosConnection` which means that they are chainable.

-   `connection.write()`
-   `connection.on()`
-   `connection.once()`

#### connection.write(commandGroup, command[, attributes])

-   `commandGroup`: string
-   `command`: string
-   `attributes`: object

Sends a command to the connected HEOS device. A command consists of a `commandGroup` and a `command`. Some commands take `attributes` as well. Check the [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf) to learn all the commands that can be sent.

```js
connection.write('player', 'set_volume', { pid: 2, level: 15 })
// Sends heos://player/set_volume?pid=2&level=15
```

#### connection.on(event, listener)

-   `event`: { command: string, commandGroup: string }
-   `listener`: (message: [HeosEvent](#HeosEvent-and-HeosResponse) | [HeosResponse](#HeosEvent-and-HeosResponse)) => void

Adds listener to event listener in `HeosConnection`. When the event happens the listener will be triggered with the response.

```js
connection.on({ commandGroup: 'event', command: 'player_volume_changed' }, console.log)
// If the player volume is changed on the connected HeosDevice the event will be logged
```

#### connection.once(event, listener)

-   `event`: { command: string, commandGroup: string }
-   `listener`: (message: [HeosEvent](#HeosEvent-and-HeosResponse) | [HeosResponse](#HeosEvent-and-HeosResponse)) => void

Exactly like [`connection.on()`](<#connection.on(event,-listener)>) but will only trigger the listener the first time the event happens.

#### connection.onAll(listener)

-   `listener`: (message: [HeosEvent](#HeosEvent-and-HeosResponse) | [HeosResponse](#HeosEvent-and-HeosResponse)) => void

Exactly like [`connection.on()`](<#connection.on(event,-listener)>) but will trigger the listener for every response or event. It is useful for logging or debugging purposes. These listeners are triggered before any other as they can be useful for understanding why other listeners might be faulty.

#### connection.onClose(listener)

-   `listener`: (hadError: boolean) => void

Adds an event listener for when the connection is closed. `hadError` is true if there was a transmission error.

```js
connection.onClose(hadError => {
    if (hadError) {
        console.error('There was a transmission error and the connection closed.')
    } else {
        console.log('Connection closed')
    }
})
```

#### connection.onError(listener)

-   `listener`: (error: Error) => void

Adds an event listener for when an error occurs.

```js
connection.onError(error => {
    console.error(error)
})
```

#### HeosEvent and HeosResponse

The responses to commands are objects like this example:

```js
{
  heos: {
    command: {
      commandGroup: 'system',
      command: 'heart_beat'
    },
    result: 'success',
    message: {
      unparsed: ''
    }
  },
  payload: {},
  options: {}
}
```

Sometimes there is no `payload` or `options` depending on the command. The responses sent from HEOS devices are JSON formatted and are very similar to `HeosResponse` with the only difference being that the command is differently formatted.

If you subscribe to _Unsolicited Responses_ (by sending the `system/register_for_change_events` command) you will receive them as a `HeosEvent`. They are formatted like this example:

```js
  heos: {
    command: {
      commandGroup: 'event',
      command: 'player_now_playing_changed'
    },
    message: {
      unparsed: 'pid=5458',
      parsed: {
        pid: 5458
      }
    }
  }
```

`message` can also be `{}` or have only `unparsed` attribute.

```ts
export type HeosResponse = {
    heos: {
        command: {
            commandGroup: string
            command: string
        }
        result: string
        message: {
            unparsed: string,
            parsed?: {
                [key: string]: string | number
            }
        } | {}
    }
    payload?: object | any[]
    options?: object
}

export type HeosEvent = {
    heos: {
        command: {
            commandGroup: string
            command: string
        }
        message: {
            unparsed: string,
            parsed?: {
                [key: string]: string | number
            }
        } | {}
    }
}
```

## Documentation

Learn more about using heos-api at:

-   [The GitHub page](https://github.com/juliuscc/heos-api)
-   [HEOS CLI Protocol Specification](http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf)

## Contributing

Please send issues and pull requests with your problems or ideas!
