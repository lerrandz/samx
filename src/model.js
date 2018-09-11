import debug from 'debug'
import { observable, set, runInAction, toJS } from 'mobx'
import { get } from 'lodash/fp'
import { registerModel, getModel } from './store'
import { actionify } from './helpers'

const d = debug('mobx-sam:Model')
const isUndefined = v => v === undefined

export const modelGetter = model => actionify(() => toJS(model))

export const Model = (name, { schema, acceptor }) => {
  const modelObservable = observable(schema, {}, { name, deep: true })
  const modelSetter = ({ name: proposition, key, value }) => {
    let target
    if (key) {
      target = get(key)(modelObservable)
      if (! target) throw new Error(`Couldn't find ${key} in model ${name}.`)
    } else {
      target = modelObservable
    }
    runInAction(name, () => {
      set(target, value)
      d(`Proposition accepted: ${proposition}`, toJS(target))
    })
  }

  modelObservable.propose = arg => {
    const currentModelState = modelGetter(modelObservable)
    const proposition = arg instanceof Function ? arg(currentModelState) : arg

    if (isUndefined(acceptor)) return modelSetter(proposition)

    d(`Calling acceptor for ${name}`)
    return acceptor(modelSetter, proposition, currentModelState)
  }

  registerModel(name, modelObservable)
}

export const Propose = (name, proposition) => {
  const model = getModel(name)
  if (model === undefined) throw Error(`Couldn't find model ${name}.`)
  return isUndefined(proposition) ? model.propose : model.propose(proposition)
}
