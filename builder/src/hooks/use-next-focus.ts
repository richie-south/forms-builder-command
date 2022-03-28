import { useEffect } from 'react'

type Options = {
  disable?: boolean
  querySelector?: string
  disableFocusPoint?: boolean
}

function baseProps(options: Options) {
  return {
    disable: options.disable ?? false,
    querySelector: options.querySelector ?? '.creator-input',
    disableFocusPoint: options.disableFocusPoint ?? false,
  }
}

export function useNextFocus(
  inputRef: React.RefObject<HTMLInputElement>,
  _options: Options
) {
  const options = baseProps(_options)

  const setFocusPoint = (element: HTMLInputElement) => {
    if (element.selectionStart) {
      const elementContentLength = element.value.length
      setTimeout(() => {
        element.setSelectionRange(elementContentLength, elementContentLength)
        element.selectionStart = elementContentLength
        element.selectionEnd = elementContentLength
      })
    }
  }

  const nextFocus = (direction: 'ArrowUp' | 'ArrowDown' = 'ArrowUp') => {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLButtonElement
    >(options.querySelector)

    const inputsArray = Array.from(inputs)
    const activeIndex = inputsArray.indexOf(document.activeElement as any)

    if (activeIndex === -1) {
      return
    }

    if (activeIndex === inputsArray.length - 1) {
      direction = 'ArrowUp'
    }

    if (direction === 'ArrowUp') {
      const nextIndex = activeIndex > 0 ? activeIndex - 1 : 0

      const element = inputsArray[nextIndex]

      if (!options.disableFocusPoint && element.nodeName === 'INPUT') {
        setFocusPoint(element as HTMLInputElement)
      }

      element.focus()
    } else if (direction === 'ArrowDown') {
      const nextIndex =
        activeIndex + 1 < inputsArray.length ? activeIndex + 1 : activeIndex

      const element = inputsArray[nextIndex]
      if (!options.disableFocusPoint && element.nodeName === 'INPUT') {
        setFocusPoint(element as HTMLInputElement)
      }

      element.focus()
    }
  }

  useEffect(() => {
    if (options.disable) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !document.activeElement ||
        (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
      ) {
        return
      }
      nextFocus(event.key)
    }

    inputRef.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [options.disable])

  return [nextFocus]
}
