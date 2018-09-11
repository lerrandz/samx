'use strict'

import debug from 'debug'
import { observable, set, runInAction, toJS } from 'mobx'
import { get } from 'lodash/fp'
import { registerModel, getModel } from './store'
import { actionify } from './helpers'
import { getModels } from './store'

const d = debug('mobx-sam:Model')
const isUndefined = v => v === undefined

export const modelGetter = model => actionify(() => toJS(model))

/**
 * Register a new Model in the APP.
 * @param {string} name         Model's name.
 * @param {Object} definition   Model's metadata.
 * @param {object} definition.schema       Model's structure that is going to be observed.
 * @param {function} [definition.acceptor] Optional: custom logic for accepting/denying
 *                              proposals to the Model.
 *                              This function is called with the setter()
 *                              function of the model.
 *                              The default acceptor() accepts every proposal.
 * @example
 * Model('user', { schema: { firstName: '', lastName: '', age: 0 }})
 */
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

/**
 * Proposes changes to specified model or returns its proposer
 * @param {string} name   Models name to propose values.
 * @param {value} [proposition] Optional: Object containing key/proposition you want to
 *                        update in the model.
 * @example
 * Propose('user', { firstName: 'Leo' })
 */
export const Propose = (name, proposition) => {
  const model = getModel(name)

  if (model === undefined) {
    throw Error('proposing to a non existing model')
  }

  return isUndefined(proposition) ? model.propose : model.propose(proposition)
}
