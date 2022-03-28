import { useEffect } from 'react'

export function useDisableArrowUpDown(
  inputRef: React.RefObject<HTMLInputElement>,
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

    inputRef.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [disable])
}
