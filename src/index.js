'use strict'

import { configure } from 'mobx'
import { config } from './config'

configure(config[process.env.NODE_ENV] || config.development)

export { Model, Propose } from './model'
export { State } from './state'
export { Render } from './render'