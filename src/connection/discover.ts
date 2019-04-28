import { createSocket } from 'dgram'
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

const defaultTimeout = 5000

/**
 * Tries to discover all available HEOS devices in the network.
 * @param timeout Will stop searching for HEOS devices when `timeout` milliseconds has ellapsed.
 * @param onDiscover Will trigger every time a HEOS device is discovered.
 * @param onTimeout Will trigger when `timeout` has ellapsed.
 */
export function discoverDevices(
	timeout: number = defaultTimeout,
	onDiscover: (address: string) => void,
	onTimeout?: (addresses: string[]) => void
): () => void {
	const socket = createSocket('udp4')
	socket.bind(1900)

	socket.send(message, 1900, '239.255.255.250')

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
 * @returns A promise that will resolve when the first device is found, or reject if no devices are found before `timeout` milliseconds have passed. If the function resolves it will resolve with the address of the HEOS device found.
 */
export function discoverOneDevice(timeout: number = defaultTimeout): Promise<string> {
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

		const quit = discoverDevices(timeout, onDiscover, onTimeout)
	})
}

/**
 * Finds one HEOS device in the network, and connects to it.
 * @param timeout Will stop searching for a HEOS device when `timeout` milliseconds has ellapsed.
 * @returns A promise that will resolve when the first device is found, or reject if no devices are found before `timeout` milliseconds have passed. If the function resolves it will resolve with a HeosConnection.
 */
export function discoverAndConnect(timeout: number = defaultTimeout): Promise<HeosConnection> {
	return new Promise((resolve, reject) => {
		discoverOneDevice(timeout)
			.then(connect)
			.then(resolve)
			.catch(reject)
	})
}
