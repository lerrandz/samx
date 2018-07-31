'use strict'

import { configure } from 'mobx'

configure({ enforceActions: 'strict', isolatedGlobalState: true })

export { Model, Propose } from './model'
export { State } from './state'
export { Render } from './render'
