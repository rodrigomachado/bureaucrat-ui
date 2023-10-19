type ClassnameConf = (
  string |
  { [classname: string]: boolean } |
  null |
  undefined
)

/**
 * Generates HTML class strings for the given arguments.
 * The arguments may be:
 * - a string - These will be considered mandatory class names to be included
 *  and will always render.
 * - an object - Each of the object property names will be a potential class
 *  name to be included, depending on eather the associated value is `true` or
 *  not.
 * - a falsy value - Simply ignored.
 * 
 * Ex:
 * ```js
 *    cx('title','bold')                          // 'title bold'
 *    cx('title', { bold: false, italic: true })  // 'title italic'
 * ```
 */
export function cx(...classnames: ClassnameConf[]): string | undefined {
  const csList: string[] = []
  for (const cn of classnames) {
    if (!cn) continue
    if (typeof cn === 'string') {
      csList.push(cn)
      continue
    }
    for (const [cne, render] of Object.entries(cn)) {
      if (!render) continue
      csList.push(cne)
    }
  }
  return csList.length ? csList.join(' ') : undefined
}
