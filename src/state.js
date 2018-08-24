import debug from 'debug'

import { reaction } from 'mobx'
import { inject } from 'mobx-react'

const d = debug('mobx-sam:State')

/**
 * A State factory that returns a Represent function that's used to bind viewing
 * components to the the Model -> State chain.
 * Can receive and pass actions as well
 *
 * @param {Function} getModels  The function to get the model from the store
 * @param {Function} fn  Pure function that takes models as argument and outputs
 *                       a state representation.
 * @param {Function} nap Pure function that takes state as argument.
 * @returns {function} sdfsdfs
 * 
 * @example
 * const userState = State(({ models, actions }) => ({
 *   name: `${models.user.lastName.toUpperCase()}, ${models.user.firstName}`,
 *   older: models.user.age >= 18,
 * }))
 *
 */
export const buildStateFactory = getModels => (fn, nap) => {
  d('New State registered.')

  // Set up the NAP as an observable of the State.
  // The NAP is then called everytime a model update impacts this State.
  // NAPs need to call Actions in order to mutate the model.
  if (nap) reaction(() => fn(getModels()), models => nap(models))

  // Return a Represent function, which is a State obvservable injector.
  // This injector takes a render function as an argument and returns the
  // observable View function of the State.

  const computeState = ({ models }) => ({ state: fn(models) })

  return component => inject(computeState)(component)
}
