import { useEffect } from 'react'

type KeyboardShortcut = {
  shift?: boolean,
  alt?: boolean,
  ctrl?: boolean,
  meta?: boolean,
  key: string,
}
export function useKeyboardShortcut(
  shortcuts: KeyboardShortcut[], callback: () => void,
) {
  if (!shortcuts.length) throw new Error('Expected at least one shortcut.')
  for (const s of shortcuts) {
    s.shift = !!s.shift
    s.alt = !!s.alt
    s.ctrl = !!s.ctrl
    s.meta = !!s.meta
  }

  useEffect(() => {
    const keydownListener: (this: Window, ev: KeyboardEvent) => void = (e) => {
      const {
        key, shiftKey: shift, altKey: alt, ctrlKey: ctrl, metaKey: meta, repeat,
      } = e
      if (repeat) return
      for (const s of shortcuts) {
        if (
          s.shift === shift &&
          s.alt === alt &&
          s.ctrl === ctrl &&
          s.meta === meta &&
          s.key === key
        ) {
          e.preventDefault()
          callback()
          return
        }
      }
    }
    window.addEventListener('keydown', keydownListener)

    return () => window.removeEventListener('keydown', keydownListener)
  }, [shortcuts, callback])
}
