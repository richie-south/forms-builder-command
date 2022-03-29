import { useEffect } from 'react'
import ContentEditable from 'react-contenteditable'

export function useDisableArrowUpDown(
  inputRef: React.RefObject<ContentEditable>,
  disable = true
) {
  useEffect(() => {
    if (disable) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !document.activeElement ||
        (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
      ) {
        return
      }

      event.preventDefault()
    }

    inputRef.current?.el?.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.el?.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [disable])
}
