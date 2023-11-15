import { createRib, edit } from './rib'

describe('rib', () => {
  describe('object', () => {
    test('tracks prop updates', () => {
      const state = { a: 1, b: 2 } as any
      const stateSetter = jest.fn()

      const so = createRib(state, stateSetter)
      edit(so, (so) => {
        so.b = 3
      })
      expect(state).toEqual({ a: 1, b: 2 }) // Unchanged state
      expect(so).toEqual({ a: 1, b: 2 }) // Unchaged rib
      expect(stateSetter).toHaveBeenCalledTimes(1) // Single state update
      expect(stateSetter).lastCalledWith({ a: 1, b: 3 }) // b updated

      edit(so, (so) => {
        so.b = 3
        so.c = 4
      })
      expect(state).toEqual({ a: 1, b: 2 }) // State remains unchanged
      expect(so).toEqual({ a: 1, b: 2 }) // Rib remains unchanged
      expect(stateSetter).toHaveBeenCalledTimes(2) // Single new state update
      expect(stateSetter).lastCalledWith({ a: 1, b: 3, c: 4 }) // new b and c
    })

    test('state must remain unchanged upon update', () => {
      const state = { a: 1, b: 2 } as any
      const stateSetter = jest.fn()

      const so = createRib(state, stateSetter)
      edit(so, so => {
        so.b = 3
        so.c = 4
      })

      expect(state).toEqual({ a: 1, b: 2 })
      expect(so).toEqual({ a: 1, b: 2 })
    })

    test('delete support', () => {
      const state = { a: 1, b: 2 } as any
      const stateSetter = jest.fn()

      const so = createRib(state, stateSetter)
      edit(so, so => {
        delete so.a
      })

      expect(state).toEqual({ a: 1, b: 2 })
      expect(stateSetter).toBeCalledWith({ b: 2 })
    })

    test('throws Exception on unsupported value', () => {
      const state = 1
      const setter = jest.fn()
      expect(() => createRib(state, setter)).toThrow(
        'RIB: Ribs can only be plain objects or plain arrays. ' +
        '(typeof value: number)',
      )
    })
  })

  describe('nested objects', () => {
    test('track updates on nested objects', () => {
      const state = { a: { a1: 1, a2: 2 }, b: { b1: 3, b2: 4 } }
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        s.a.a1 = 10
      })

      expect(state).toEqual({ a: { a1: 1, a2: 2 }, b: { b1: 3, b2: 4 } })
      expect(stateSetter)
        .toBeCalledWith({ a: { a1: 10, a2: 2 }, b: { b1: 3, b2: 4 } })
    })

    test('track deletions on nested objects', () => {
      const state = { a: { a1: 1, a2: 2 }, b: { b1: 3, b2: 4 } } as any
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        delete s.a.a1
      })

      expect(state).toEqual({ a: { a1: 1, a2: 2 }, b: { b1: 3, b2: 4 } })
      expect(stateSetter)
        .toBeCalledWith({ a: { a2: 2 }, b: { b1: 3, b2: 4 } })
    })

    test('throws Exception on unsupported value', () => {
      const state = { a: { b: { c: { d: new Date() } } } }
      const setter = jest.fn()
      const rib = createRib(state, setter)

      expect(() => {
        edit(rib, r => {
          r.a.b.c.d.getDay()
        })
      }).toThrow(
        'RIB.a.b.c.d: Ribs can only be plain objects or plain arrays. ' +
        '(Constructor: function Date() { [native code] })',
      )
    })
  })

  describe('array', () => {
    test('track index assignment', () => {
      const state: any[] = []
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        s[0] = 'hello'
      })

      expect(state).toEqual([])
      expect(stateSetter)
        .toBeCalledWith(['hello'])
    })

    test('supports length', () => {
      const state = [1, 2, 3, 4]
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        expect(s.length).toBe(4)
      })
    })

    test('support push', () => {
      const state: any[] = []
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        s.push('hello')
      })

      expect(state).toEqual([])
      expect(stateSetter)
        .toBeCalledWith(['hello'])
    })
  })

  describe('nested arrays', () => {
    test('supports iteration', () => {
      const state: any[] = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ]
      const stateSetter = jest.fn()

      const s = createRib(state, stateSetter)
      edit(s, s => {
        for (const i of s) {
          i.value = 'new_value'
        }
      })

      expect(state).toEqual([
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ])
      expect(stateSetter).toBeCalledWith([
        { value: 'new_value' },
        { value: 'new_value' },
        { value: 'new_value' },
      ])
    })

    test('throws Exception on unsupported value', () => {
      const state = [[[[new Date()]]]]
      const setter = jest.fn()
      const rib = createRib(state, setter)

      expect(() => {
        edit(rib, r => {
          r[0][0][0][0].getDay()
        })
      }).toThrow(
        'RIB[0][0][0][0]: Ribs can only be plain objects or plain arrays. ' +
        '(Constructor: function Date() { [native code] })',
      )
    })
  })

  describe('heterogeneous nesting', () => {
    test('complex nesting', () => {
      const state = { a: [{ b: [{ c: [1] }] }] }
      const setter = jest.fn()
      const rib = createRib(state, setter)

      edit(rib, r => {
        r.a[0].b[0].c.push(2)
      })

      expect(state).toEqual({ a: [{ b: [{ c: [1] }] }] })
      expect(rib).toEqual({ a: [{ b: [{ c: [1] }] }] })
      expect(setter).lastCalledWith({ a: [{ b: [{ c: [1, 2] }] }] })
    })
  })
})
