'use strict'

import debug from 'debug'
import { reduceMapToObject } from './helpers'

const d = debug('mobx-sam:Store')
const modelsMap = new Map()

export const getModel = (name) => modelsMap.get(name)
export const registerModel = (name, model) => {
  d(`Model ${name} registered.`)
  modelsMap.set(name, model)
}

export const getModels = () => reduceMapToObject(modelsMap)({})
