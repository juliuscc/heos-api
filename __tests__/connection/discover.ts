import { discoverOneDevice } from '../../src/connection/discover'
import dgram from 'dgram'

jest.mock('dgram')

describe('discoverOneDevice()', () => {
	beforeAll(() => {})

	test('One device can be discovered', () => {
		expect.assertions(1)
		return expect(discoverOneDevice()).resolves.toEqual('192.168.0.5')
	})

	test('One device can be discovered with options', () => {
		expect.assertions(1)
		return expect(discoverOneDevice({ address: '192.168.0.1', timeout: 10 })).resolves.toEqual(
			'192.168.0.5'
		)
	})

	test('Discover fails when no devices are found', () => {
		expect.assertions(1)
		// @ts-ignore
		dgram.__setOn(() => {})

		return expect(discoverOneDevice({ timeout: 10 })).rejects.toEqual('No devices found')
	})

	test('discoverOneDevice only returns one address even if multiple devices are found', () => {
		expect.assertions(2)

		// @ts-ignore
		dgram.__setOn((_event: string, callback: Function) => {
			process.nextTick(() =>
				callback('urn:schemas-denon-com:device:ACT-Denon:1', { address: '192.168.0.5' })
			)
			process.nextTick(() => {})
			process.nextTick(() => {})
			process.nextTick(() =>
				callback('urn:schemas-denon-com:device:ACT-Denon:1', { address: '192.168.0.2' })
			)
		})

		return discoverOneDevice().then(address => {
			expect(address).toBe('192.168.0.5')
			expect(address).not.toBe('192.168.0.2')
		})
	})

	test('discoverOneDevice will only resolve a heos device', () => {
		expect.assertions(2)

		// @ts-ignore
		dgram.__setOn((_event: string, callback: Function) => {
			process.nextTick(() =>
				callback('urn:schemas-denon-com:device:OTHER:2', { address: '192.168.0.5' })
			)
			process.nextTick(() => {})
			process.nextTick(() => {})
			process.nextTick(() =>
				callback('urn:schemas-denon-com:device:ACT-Denon:1', { address: '192.168.0.2' })
			)
		})

		return discoverOneDevice().then(address => {
			expect(address).toBe('192.168.0.2')
			expect(address).not.toBe('192.168.0.5')
		})
	})
})
