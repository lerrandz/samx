import { reduce } from 'lodash/fp'
import { action as MobxAction } from 'mobx'

export const reduceMapToObject = map => obj => {
  const keys = [...map.keys()]
  const reducer = (accumObj, entry) => {
    const action = map.get(entry)
    return Object.assign(accumObj, {
      [entry]: action,
    })
  }

  return reduce(reducer, obj)(keys)
}

export const actionify = fn => MobxAction(fn)()
