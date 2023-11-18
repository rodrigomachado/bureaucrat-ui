/**
 * RIB - React Imperative Bridge
 */

import { useState } from 'react'

const SetterSymbol = Symbol('RibSetter')
const rootPath = 'RIB'

export function useRib<T>(initialValue: T): T {
  const [state, stateSetter] = useState(initialValue)
  return createRib(state, stateSetter)
}

export function createRib<T>(value: T, setter: StateSetter<T>): T {
  validateRibValue(rootPath, value)
  Object.defineProperty(value, SetterSymbol, {
    configurable: true, value: setter,
  })
  return value
}

export function edit<T>(value: T, editor: (value: T) => void) {
  validateRibValue(rootPath, value)

  const setter = (
    value as { [SetterSymbol]: ((value: T) => void) | undefined }
  )[SetterSymbol]
  if (!setter) throw new Error(
    'Value is no Rib. Did you forget to `useRib(…)` | `createRib(…)`?',
  )

  let edited: (T | null) = null
  const saveFn = (v: T) => edited = v
  editor(createRibNestedValue(rootPath, value, saveFn))
  if (edited === null) return
  setter(edited)
}

function validateRibValue<T>(path: string, value: T) {
  if (value === null) throw new Error(
    `${path}: Ribs can only be plain objects or plain arrays. (value === null)`,
  )
  if (typeof (value) !== 'object') throw new Error(
    `${path}: Ribs can only be plain objects or plain arrays. ` +
    `(typeof value: ${typeof (value)})`,
  )
  if (
    Object.getPrototypeOf(value) !== Object.prototype &&
    Object.getPrototypeOf(value) !== Array.prototype
  ) throw new Error(
    `${path}: Ribs can only be plain objects or plain arrays. ` +
    `(Constructor: ${value.constructor})`,
  )
}

function createRibNestedValue<T>(
  path: string, value: T, setter: StateSetter<T>,
): T {
  if (value === null || value === undefined || typeof value in [
    'boolean', 'number', 'bigint', 'string', 'symbol',
  ]) return value // Immutable primitive value

  validateRibValue(path, value)

  switch (Object.getPrototypeOf(value)) {
    case Object.prototype: return createRibObject(
      path, { ...value as StateObject }, setter,
    ) as T
    case Array.prototype: return createRibArray(
      path, [...value as StateArray], setter,
    ) as T
    default: throw new Error(
      `${path}: Unsupported inner state value. ` +
      `Constructor of '${path}': ${value.constructor}`
    )
  }
}


function createRibObject(
  path: string, state: StateObject, stateSetter: StateSetter<any>,
): StateObject {
  return new Proxy(state, {
    get(_: StateObject, prop: string) {
      return createRibNestedValue(
        `${path}.${prop}`,
        state[prop],
        (value: any) => {
          state[prop] = value
          stateSetter(state)
        },
      )
    },

    set(_: StateObject, prop: string, value: any) {
      state[prop] = value
      stateSetter(state)
      return true
    },

    deleteProperty(_: StateObject, prop: string) {
      delete state[prop]
      stateSetter(state)
      return true
    },
  })
}

function createRibArray(
  path: string, state: StateArray, stateSetter: StateSetter<any>,
): StateArray {
  const supportedProps: any = {
    // Other useful array properties may be added here.
    // Be careful, some properties return array items (like `shift` or `pop`),
    // or provide access to them via callback (such as `map` and `forEach`).
    // These items must be wrapped before handing them to the user.

    get length() {
      return state.length
    },

    push(item: any) {
      state.push(item)
      stateSetter(state)
    },
  }

  return new Proxy(state, {
    get(_: StateArray, prop: string | symbol) {
      if (typeof prop === 'symbol') {
        if (prop !== Symbol.iterator) throw new Error(
          `${path}: Property not supported ${prop.toString()}`
        )
        return function* ribIterator() {
          for (let propInt = 0; propInt < state.length; propInt++) {
            yield createRibNestedValue(
              `${path}[${propInt}]`,
              state[propInt],
              (value: unknown) => {
                state[propInt] = value
                stateSetter(state)
              }
            )
          }
        }
      }

      if (!/^\d+$/.test(prop)) {
        const supportedProp = supportedProps[prop]
        if (supportedProp !== undefined) return supportedProp
        throw new Error(`${path}: Property not supported: ${prop}`)
      }

      const propInt = parseInt(prop)
      return createRibNestedValue(
        `${path}[${prop}]`,
        state[propInt],
        (value: unknown) => {
          state[propInt] = value
          stateSetter(state)
        },
      )
    },

    set(_: StateArray, prop: string | symbol, value: any) {
      if (typeof prop === 'symbol') throw new Error(
        `${path}: Assigning value to symbol ${prop.toString()} not supported.`,
      )
      state[parseInt(prop)] = value
      stateSetter(state)
      return true
    },

    deleteProperty(_: StateArray, prop: string | symbol) {
      if (typeof prop === 'symbol') throw new Error(
        `${path}: Assigning value to symbol ${prop.toString()} not supported.`,
      )
      delete state[parseInt(prop)]
      stateSetter(state)
      return true
    },
  })
}

type StateObject = { [key: string | symbol]: unknown }
type StateArray = unknown[]
type StateSetter<T> = (value: T) => void
