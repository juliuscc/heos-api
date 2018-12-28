import './types'

const prefix: string = 'heos://'
const postfix: string = '\r\n'

export type HeosCommandAttribute = {
	[key: string]: string | number
}

export class HeosCommand {
	commandGroup: string
	command: string
	attributes?: HeosCommandAttribute

	constructor(
		commandGroup: string,
		command: string,
		attributes?: HeosCommandAttribute
	) {
		if (!commandGroup || !command) {
			throw new Error('Missing arguments when creating HeosCommand')
		}

		this.commandGroup = commandGroup
		this.command = command
		this.attributes = attributes
	}

	private attributeString(): string {
		if (!this.attributes || Object.entries(this.attributes).length < 1) {
			return ''
		} else {
			return (
				'?' +
				Object.entries(this.attributes)
					.map(([key, value]) => {
						if (typeof value === 'string') {
							return `${key}='${value}'`
						} else {
							return `${key}=${value.toString()}`
						}
					})
					.reduce((previous, current) => `${previous}&${current}`)
			)
		}
	}

	asString(): string {
		return [
			prefix,
			this.commandGroup,
			'/',
			this.command,
			this.attributeString(),
			postfix
		].join('')
	}
}
