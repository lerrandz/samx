/**
 *
 * @example:
 *  import { LocalState } from "samx"
 *
 *  const { state, setState } = LocalState({
 *    schema: {
 *    },
 *    setter: (mutation) => {
 *      return mutation
 *    },
 *    getter: (state) => {
 *      return state
 *    },
 *  })
 * */

import { observable, set } from "mobx"

const LocalStateError = (msg) => new Error(msg)

const Errors = {
  setter: {
    InvalidMutation: LocalStateError("Invalid Mutation"),
    notAllowed: LocalStateError("Operation not allowed"),
  },
  setState: {
    args: {
      one: LocalStateError("Invalid arguments. First argument should be either a string prop name or a mutation object"),
      two: LocalStateError("Invalid arguments. First argument must be a string, second must be an object/number/string"),
      invalid: LocalStateError("Invalid argument list.")
    }
  },
  Constructor: {
    InvalidArgs: {
      first: {
        schema: LocalStateError("Schema must be an object"),
      }
    }
  },
  getter: {
    prop: {
      invalid: LocalStateError("Invalid property access. No such property is defined in the getter."),
    }
  },
}

/**
 * Encapsulated Mobx.set for validation and interfacing purposes
 * 
 * @param {Mobx.observable} observable 
 * @param {Object} mutation 
 */
const Setter = (interceptor) =>  (observableState, mutation) => {
  console.log(observableState, mutation)
  Object.keys(mutation).forEach(
    (key) => {
      if (typeof mutation[key] === "function") {
        throw Errors.setter.InvalidMutation
      }
    }
  )

  if (typeof interceptor === "function") {
    const newMutation = interceptor(toJS(observableState), mutation)
    set(observableState, newMutation)
  } else {
    set(observableState, mutation)
  }
  
  return true
}

/**
 * 
 * @example:
 *  first:
 *    setState({ property: value })
 * 
 *  second:
 *    setState("property")(value)
 * 
 *  third:
 *    setState("property", value)
 */
const SetState = (observableState, interceptor) => (...args) => {
  const interceptedSetter = Setter(interceptor)
  const argsLength = args.length

  switch (argsLength) {
    case 1:
      const arg = args[0]
      if (typeof arg === "object") {
        return interceptedSetter(observableState, arg)
      } else if (typeof arg === "string") {
        return (mutation) => interceptedSetter(observableState, mutation)
      } else throw Errors.setState.args.one

    case 2 || argsLength > 2:
      const [ first, second ] = args

      if (
        typeof first === "string"
        && (
          typeof second === "object"
          || typeof second === "string"
          || typeof second === "number"
        )
      ) {
        return interceptedSetter(observableState, {
          [first]: second,
        })
      } else throw Errors.setState.args.two
    
    default:
      throw Errors.setState.args.invalid
  }
}

/**
 * 
 * @param {Object} opts
 * @param {Object} opts.schema
 * @optional {Function} opts.setter
 * @optional {Function} opts.getter
 *
 */
const LocalState = (opts) => {
  const options = {}

  if (typeof opts.schema !== "object") {
    throw Errors.Constructor.InvalidArgs.first.schema
  }

  options.schema = opts.schema

  if (opts.setter && typeof opts.setter === "Function") {
    options.setter = opts.setter
  }

  if (opts.getter && typeof opts.getter === "Function") {
    options.getter = opts.getter
  }

  const observableState = observable(options.schema)

  const state = new Proxy({
    __data: observableState,

    getCurrentState() {
      return toJS(observableState)
    },

    __getObservable() {
      return observableState
    },

  }, {
    get(target, prop) {
      console.log({ target, prop })
      if (typeof target[prop] === "function") {
        const r = Reflect.get(...arguments)
        console.log({ target, prop, value: target[prop], r })
        return r
      }

      if (options.getter) {
        const currentValue = options.getter(target.__data)

        if (prop in Object.keys(currentValue)) {
          return currentValue[prop]
        } else {
          throw Errors.getter.prop.invalid
        }
      } else {
        return target.__data[prop]
      }
    },

    set() {
      throw Errors.setter.notAllowed
    }
  })

  const setState = SetState(state.__getObservable(), options.setter || undefined)

  return {
    state,
    setState,
  }
}

export {
  LocalState,
}
