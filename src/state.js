import debug from 'debug'
import { reaction, observable, set } from 'mobx'
import { getModels } from './store'

const d = debug('mobx-sam:State')

const State = fn => {
  d(`New state '${fn.name}' registered.`)
  const stateEvaluator = fn(getModels())
  const stateObservable = observable(stateEvaluator())
  reaction(stateEvaluator, data => {
    d(`State '${fn.name}' recalculated.`)
    set(stateObservable, data)
  })
  return stateObservable
}

export {
  State,
}
