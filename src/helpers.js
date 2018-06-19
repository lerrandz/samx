'use strict'

import { reduce } from 'lodash/fp'
import { action } from 'mobx'

export const reduceMapToObject = map => obj => {
  const keys = [...map.keys()]
  const reducer = (obj, entry) => {
    const action = map.get(entry)
    return Object.assign(obj, {
      [entry]: action
    })
  }

  return reduce(reducer, obj)(keys)
}

export const actionify = fn => action(fn)()
