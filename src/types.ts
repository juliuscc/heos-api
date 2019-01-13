import { Socket } from 'net'
import { HeosEventEmitter } from './listen/responseEventHandler'

export type HeosCommandAttribute = {
    [key: string]: string | number
}

export type HeosCommand = {
    commandGroup: string
    command: string
    attributes?: HeosCommandAttribute
}

export type HeosEvent = {
    heos: {
        command: HeosCommand
        message: string
    }
}

export type HeosResponse = {
    heos: {
        command: HeosCommand
        result: string
        message: string
    }
    payload?: object | any[]
    options?: object
}

export type HeosConnection = {
    write: Socket['write']
    on: HeosEventEmitter
    once: HeosEventEmitter
}
