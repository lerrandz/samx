import debug from 'debug'
import { reduceMapToObject } from './helpers'

const d = debug('samx:Store')
const modelsMap = new Map()

const getModel = name => modelsMap.get(name)

const registerModel = (name, model) => {
  d(`Model ${name} registered.`)
  modelsMap.set(name, model)
}

const getModels = () => reduceMapToObject(modelsMap)({})

export {
  getModel,
  getModels,
  registerModel,
}
