import { BindOptions, createSocket } from 'dgram'
import { connect } from './connect'
import { HeosConnection } from './heosConnection'

const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'

const message = [
	'M-SEARCH * HTTP/1.1',
	'HOST: 239.255.255.250:1900',
	`ST: ${searchTargetName}`,
	'MX: 5',
	'MAN: "ssdp:discover"',
	'\r\n'
].join('\r\n')

type RInfo = {
	address: string
	family: string
	port: number
	size: number
}

export type DiscoverOptions = {
	timeout?: number
	port?: number
	address?: string
}

const defaultTimeout = 5000

/**
 * Tries to discover all available HEOS devices in the network.
 * @param timeout Will stop searching for HEOS devices when `timeout` milliseconds has ellapsed.
 * @param onDiscover Will trigger every time a HEOS device is discovered.
 * @param onTimeout Will trigger when `timeout` has ellapsed.
 * @param options Options for discovering devices.
 */
export function discoverDevices(
	onDiscover: (address: string) => void,
	onTimeout?: (addresses: string[]) => void,
	options?: DiscoverOptions
): () => void {
	const timeout: number = (options && options.timeout) || defaultTimeout
	
	const socket = createSocket('udp4')
	options && options.bindOptions ? socket.bind(options.bindOptions as BindOptions) : socket.bind()

	socket.on('listening', () => {
		socket.send(message, 1900, '239.255.255.250')
	})

	let addresses: string[] = []

	socket.on('message', (msg: string, rinfo: RInfo) => {
		if (msg.includes(searchTargetName)) {
			onDiscover(rinfo.address)
			addresses.push(rinfo.address)
		}
	})

	const timeOutReferance: NodeJS.Timeout = setTimeout(quit, timeout)

	function quit() {
		socket.close()
		if (onTimeout) {
			onTimeout(addresses)
		}

		global.clearTimeout(timeOutReferance)
	}

	return quit
}

/**
 * Finds one HEOS device in the network.
 * @param timeout Will stop searching for a HEOS device when `timeout` milliseconds has ellapsed.
 * @param options Options for discovering a device.
 * @returns A promise that will resolve when the first device is found, or reject if no devices are found before `timeout` milliseconds have passed. If the function resolves it will resolve with the address of the HEOS device found.
 */
export function discoverOneDevice(
	options?: DiscoverOptions
): Promise<string> {
	return new Promise((resolve, reject) => {
		let oneDiscovered: boolean = false

		function onDiscover(adress: string): void {
			if (oneDiscovered) {
				return
			}

			oneDiscovered = true
			quit()
			resolve(adress)
		}

		function onTimeout(adresses: string[]) {
			if (!oneDiscovered) {
				reject('No devices found')
			}
		}

		const quit = discoverDevices(onDiscover, onTimeout, options)
	})
}

/**
 * Finds one HEOS device in the network, and connects to it.
 * @param timeout Will stop searching for a HEOS device when `timeout` milliseconds has ellapsed.
 * @param options Options for discovering a device.
 * @returns A promise that will resolve when the first device is found, or reject if no devices are found before `timeout` milliseconds have passed. If the function resolves it will resolve with a HeosConnection.
 */
export function discoverAndConnect(
	options?: DiscoverOptions
): Promise<HeosConnection> {
	return new Promise((resolve, reject) => {
		discoverOneDevice(options)
			.then(connect)
			.then(resolve)
			.catch(reject)
	})
}
