import { formatTitlePattern } from './entity'

describe('entity.ts - formatTitlePattern', () => {
  test('happy path', () => {
    expect(
      formatTitlePattern(
        {
          name: 'User', fields: {
            first_name: {},
            last_name: {},
          }
        } as any,
        { first_name: 'Dave', last_name: 'Matthews' },
        '#{first_name}-#{last_name}',
      )
    ).toBe('Dave-Matthews')
  })

  test('ref unknown field', () => {
    expect(() =>
      formatTitlePattern(
        { name: 'Feature', fields: {/* No fields */ } } as any,
        {},
        '#{code}',
      )
    ).toThrow(
      'Unable to format title for entity type \'Feature\': ' +
      'Field \'code\' mentioned in formatting pattern not found. ' +
      'Pattern: \'#{code}\''
    )
  })
})
