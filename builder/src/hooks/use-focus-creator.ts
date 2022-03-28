import { useEffect } from 'react'
import { selectNrOfFields, useFieldStore } from '../lib/store/field-store'

export function useFocusCreator(): [
  (direction?: 'ArrowUp' | 'ArrowDown') => void
] {
  const nrOfFields = useFieldStore(selectNrOfFields)

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
    const inputs = document.querySelectorAll<HTMLInputElement>('.creator-input')
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
      setFocusPoint(element)
      element.focus()
    } else if (direction === 'ArrowDown') {
      const nextIndex =
        activeIndex + 1 < inputsArray.length ? activeIndex + 1 : activeIndex

      const element = inputsArray[nextIndex]
      setFocusPoint(element)
      element.focus()
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !document.activeElement ||
        (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
      ) {
        return
      }
      nextFocus(event.key)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [nrOfFields])

  return [nextFocus]
}
