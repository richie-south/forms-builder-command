import { useEffect, useState } from 'react'

export function useContextMenu(inputRef: React.RefObject<HTMLInputElement>) {
  const [contextMenuStartIndex, setContextMenuStartIndex] = useState<number>(-1)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)

  const openContextMenu = () => {
    setContextMenuStartIndex(inputRef.current?.selectionStart ?? -1)
    setShowContextMenu(true)
  }

  const closeContextMenu = () => {
    setContextMenuStartIndex(-1)
    setShowContextMenu(false)
  }

  useEffect(() => {
    if (!showContextMenu) {
      return
    }

    const cursorPositionChange = () => {
      const position = inputRef.current?.selectionStart ?? -1
      if (position < contextMenuStartIndex) {
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
  }, [showContextMenu, contextMenuStartIndex])

  const onInputValueChangeContextMenu = (value: string) => {
    const position = (inputRef.current?.selectionStart ?? 1) - 1

    if (value === '/' || (value[position] === '/' && !showContextMenu)) {
      openContextMenu()
    } else if (showContextMenu && value[contextMenuStartIndex - 1] !== '/') {
      closeContextMenu()
    }
  }

  return {
    openContextMenu,
    closeContextMenu,
    onInputValueChangeContextMenu,
    contextMenuStartIndex,
    showContextMenu,
  }
}
