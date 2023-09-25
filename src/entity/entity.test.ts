import { Field, formatTitlePattern } from './entity'

describe('entity.ts', () => {
  test('example', () => {
    expect(
      formatTitlePattern(
        { name: 'User' } as any,
        { first_name: new Field({} as any, 'Dave'), last_name: new Field({} as any, 'Matthews') },
        '#{first_name}-#{last_name}',
      )
    ).toBe('Dave-Matthews')
  })
})
