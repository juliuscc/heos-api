import './types'

const prefix: string = 'heos://'
const postfix: string = '\r\n'

export type HeosCommandAttribute = {
	[key: string]: string | number
}

function attributeString(attributes?: HeosCommandAttribute): string {
	if (!attributes || Object.entries(attributes).length < 1) {
		return ''
	} else {
		return (
			'?' +
			Object.entries(attributes)
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

export function generateHeosCommand(
	commandGroup: string,
	command: string,
	attributes?: HeosCommandAttribute
): string {
	if (!commandGroup || !command) {
		throw new Error('Missing arguments when creating HeosCommand')
	}

	return [
		prefix,
		commandGroup,
		'/',
		command,
		attributeString(attributes),
		postfix
	].join('')
}
