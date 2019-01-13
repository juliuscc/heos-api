import { HeosCommand } from '../types'

export function generateHeosCommandString(command: HeosCommand): string {
	return command.commandGroup + '/' + command.command
}

export function parseHeosCommandString(commandString: string): HeosCommand {
	const [commandGroup, command] = commandString.split('/')

	return { commandGroup, command }
}
