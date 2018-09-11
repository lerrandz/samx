import { reduce } from 'lodash/fp'
import { action } from 'mobx'

const reduceMapToObject = map => obj => {
  const keys = [...map.keys()]
  const reducer = (target, entry) => {
    const value = map.get(entry)
    return Object.assign(target, {
      [entry]: value,
    })
  }

  return reduce(reducer, obj)(keys)
}

const actionify = fn => action(fn)()

export {
  actionify,
  reduceMapToObject,
}
