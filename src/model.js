'use strict'

import debug from 'debug'
import { observable, set, runInAction, toJS } from 'mobx'
import { compose, reduce } from 'lodash/fp'
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
export const Model = (name , { schema, acceptor }) => {
  const model = observable(schema)
  const modelSetter = ({ name, value }) => {
    d(`Proposition accepted for ${name}`, value)
    runInAction(name, () => { set(model, value) })
  }

  model.propose = proposition => {
    const currentModel = modelGetter(model)
    if (proposition instanceof Function) proposition = proposition(currentModel)

    if (isUndefined(acceptor)) return modelSetter(proposition)
    else {
      d(`Calling acceptor for ${name}`)
      return acceptor(modelSetter, proposition, currentModel)
    }
  }

  registerModel(name, model)
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
