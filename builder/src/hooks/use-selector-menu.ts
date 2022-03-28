import { useEffect, useState } from 'react'

export function useSelectorMenu(inputRef: React.RefObject<HTMLInputElement>) {
  const [selectorMenuStartIndex, setSelectorMenuStartIndex] =
    useState<number>(-1)
  const [showSelectorMenu, setShowSelectorMenu] = useState<boolean>(false)

  const openContextMenu = () => {
    setSelectorMenuStartIndex(inputRef.current?.selectionStart ?? -1)
    setShowSelectorMenu(true)
  }

  const closeContextMenu = () => {
    setSelectorMenuStartIndex(-1)
    setShowSelectorMenu(false)
  }

  useEffect(() => {
    if (!showSelectorMenu) {
      return
    }

    const cursorPositionChange = () => {
      const position = inputRef.current?.selectionStart ?? -1
      if (position < selectorMenuStartIndex) {
        closeContextMenu()
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (
        !document.activeElement ||
        (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
      ) {
        return
      }

      cursorPositionChange()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!document.activeElement || event.key !== 'Escape') {
        return
      }
      closeContextMenu()
    }

    inputRef.current?.addEventListener('click', cursorPositionChange)
    inputRef.current?.addEventListener('keyup', onKeyUp)
    inputRef.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.removeEventListener('click', cursorPositionChange)
      inputRef.current?.removeEventListener('keyup', onKeyUp)
      inputRef.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [showSelectorMenu, selectorMenuStartIndex])

  const onInputValueChangeContextMenu = (value: string) => {
    const position = (inputRef.current?.selectionStart ?? 1) - 1

    if (value === '/' || (value[position] === '/' && !showSelectorMenu)) {
      openContextMenu()
    } else if (showSelectorMenu && value[selectorMenuStartIndex - 1] !== '/') {
      closeContextMenu()
    }
  }

  return {
    openContextMenu,
    closeContextMenu,
    onInputValueChangeContextMenu,
    selectorMenuStartIndex,
    showSelectorMenu,
  }
}
