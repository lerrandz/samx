import debug from 'debug'

import { reduceMapToObject } from './helpers'

const d = debug('mobx-sam:Store')

const modelsMap = new Map()

export const getAll = () => reduceMapToObject(modelsMap)({})
export const get = name => modelsMap.get(name)
export const set = (name, model) => {
  d(`Model ${name} registered.`)
  modelsMap.set(name, model)
}

export {
  get as getModel,
  set as registerModel,
  getAll as getModels,
}
