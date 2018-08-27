import debug from 'debug'

import { observable, set, runInAction, toJS } from 'mobx'
import { actionify } from './helpers'

import { InvalidArgError } from './errors'

const d = debug('mobx-sam:Model')
const isUndefined = v => v === undefined
const modelGetter = model => actionify(() => toJS(model))
const modelSetter = model => log => mutation => {
  return runInAction(log, () => {
    set(model, mutation)
    return modelGetter(model)
  })
}

/**
 * @description
 * sdfsdf
 *
 * @param {* } model xcvxc
 * @param {*} acceptor v xcvxcv
 * @param {*} proposition  xcvxcv
 *
 * @return {*} what ever is returned from the acceptor.
 */
export const proposeToModel = model => acceptor => proposition => {
  const applyMutation = ({
    name: propName,
    value: propValue,
  }) => {
    d(`Proposition accepted for ${propName}`, propValue)

    if (propName === undefined) {
      throw Error('proposition must have a name')
    }

    if (propValue === undefined) {
      throw Error('proposition must have a value')
    }

    return modelSetter(model)(propName)(propValue)
  }

  const currentModel = modelGetter(model)

  const mutation = proposition instanceof Function ?
    proposition(currentModel) :
    proposition

  if (isUndefined(acceptor)) return applyMutation(mutation)

  return acceptor(applyMutation, mutation, currentModel)
}

/**
 * @description
 * Register a new Model in the APP.
 *
 * @param {Function} registerModel The function that will persist the model to the store with its name.
 * @param {String} name         Model's name.
 * @param {Object} definition   Model's metadata.
 * @param {object} definition.schema       Model's structure that is going to be observed.
 * @param {Function}[definition.acceptor] Optional: custom logic for accepting / denying
 *                              proposals to the Model.
 *                              This function is called with the setter()
 *                              function of the model.
 *                              The default acceptor() accepts every proposal.
 *
 * @returns {*}         Whatever is returned from the acceptor
 *
 * @example
 * Model('user', { schema: { firstName: '', lastName: '', age: 0 }})
 *
 */

export const buildModelFactory = modelProposer => registerModel => (name, { schema, acceptor }) => {
  if (! modelProposer || typeof modelProposer !== 'function') {
    throw InvalidArgError('Expecting a function to propose to models')
  }

  if (! registerModel || typeof registerModel !== 'function') {
    throw InvalidArgError('Expecting a function to register models to the store')
  }

  if (! name || name === '' || typeof name !== 'string') {
    throw InvalidArgError('Expecting a model name, received none')
  }

  if (! (typeof schema === 'object' && ! Array.isArray(schema))) {
    throw InvalidArgError('Expecting a model schema, received none')
  }

  const isAcceptorValid = acceptorFn => ! isUndefined(acceptorFn) && typeof acceptorFn === 'function'

  const model = observable(schema)
  d(`Calling acceptor for ${name}`)

  model.propose = isAcceptorValid(acceptor)
    ? modelProposer(model)((...args) => {
      d(`Calling acceptor for ${name}`)
      return acceptor(...args)
    })
    : modelProposer(model)()

  return registerModel(name, model)
}

/**
 * @description
 * Proposes changes to specified model or returns its proposer
 *
 * @param { Function } getModel The function to get the models from the store
 * @param {String} name   Models name to propose values.
 * @param {Object} [proposition] Optional: Object containing key/proposition you want to
 *                        update in the model.
 *
 * @returns {*} Whatever is returned from the propose function.
 *
 * @example
 * Propose('user', { firstName: 'Leo' })
 *
 */
export const buildProposerFactory = getModel => {
  if (typeof getModel !== 'function') {
    throw InvalidArgError('Expecting a models getter as the first curried argument')
  }

  return (name, proposition) => {

    const model = getModel(name)

    if (model === undefined) {
      throw Error('proposing to a non existing model')
    }

    return isUndefined(proposition)
      ? model.propose // auto-curry
      : model.propose(proposition)
  }
}
