import { cx } from './classnames'

describe('classnames#cx', () => {
  test('Single classname', () => {
    expect(cx('title'))
      .toBe('title')
  })

  test('Multiple strings', () => {
    expect(cx('title', 'bold', 'italic'))
      .toBe('title bold italic')
  })

  test('Single object with multiple entries', () => {
    expect(cx({ 'title': true, 'bold': false, 'italic': true }))
      .toBe('title italic')
  })

  test('Multiple objects', () => {
    expect(cx(
      { title: true },
      { bold: false, italic: true },
      { heading: true },
    ))
      .toBe('title italic heading')
  })

  test('Strings and Objects', () => {
    expect(cx(
      'title',
      { bold: true },
      'italic',
      { heading: false },
    ))
      .toBe('title bold italic')
  })

  test('Falsy', () => {
    expect(cx('title', null))
      .toBe('title')
  })

  test('Empty', () => {
    expect(cx())
      .toBe(undefined)
  })
})
