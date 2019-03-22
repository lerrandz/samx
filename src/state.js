import debug from 'debug'

import { reaction, observable, set } from 'mobx'
import { createTransformer } from "mobx-utils"
import { pick, keys } from "lodash/fp"
import { getModels } from './store'

const d = debug('samx:State')

const State = (transformState, nap = undefined) => ({
  name = "",
  onlyTrack,
} = {}) => {
  d(`New state '${name || transformState.name}' registered.`)

  if (typeof transformState !== 'function') {
    throw Error("SAMX: state aggregator must be a function")
  }

  if (nap && typeof nap !== 'function') {
    throw Error("SAMX: state next action predicate must be a function")
  }

  if (onlyTrack && !Array.isArray(onlyTrack)) {
    throw Error("SAMX: onlyTrack option on state must be an array of strings")
  }

  const aggregateStateRepresentation = createTransformer(transformState)
  const updateStateRepresentationEffectFn = (stateRepresentation) => models => {
    d(`State: ${name || transformState.name } updating...`)
    const state = aggregateStateRepresentation(models)
    set(stateRepresentation, state)
  }

  const models = getModels()
  const modelNames = keys(models)

  let retrieveModels = getModels

  if (onlyTrack) {
    
    retrieveModels = () => {
      onlyTrack.forEach(
        (trackedModel) => {
          if (!modelNames.includes(trackedModel)) {
            throw Error("SAMX: unknown model provided to state for specific tracking", {
              modelsToTrack: onlyTrack,
              definedModels: modelNames,
              stateName: name || transformState.name,
            })
          }
        }
      )

      return pick(onlyTrack)(models)
    }
  }

  const initialState = aggregateStateRepresentation(retrieveModels())
  const stateRepresentation = observable(initialState)

  const retrieveDataFn = () => transformState(retrieveModels())
  reaction(
    retrieveDataFn,
    () => {
      console.log('fired reaction')
      updateStateRepresentationEffectFn(stateRepresentation)(retrieveModels())
    }
  )

  if (nap) {
    const nextActionPredicateEffectFn = (stateRepresentation) => (models) => () => {
      nap(stateRepresentation, models)
    }

    reaction(
      retrieveDataFn,
      nextActionPredicateEffectFn(stateRepresentation)(retrieveModels())
    )
  }

  return stateRepresentation
}

export {
  State,
}