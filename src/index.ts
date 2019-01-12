import './types'

import { discoverDevices, discoverOneDevice } from './connection/discover'
import { connect } from './connection/connection'

exports.discoverDevices = discoverDevices
exports.discoverOneDevice = discoverOneDevice

exports.connect = connect
