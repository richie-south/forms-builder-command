import { useEffect, useState } from 'react'
import ContentEditable from 'react-contenteditable'

export function useContextMenu(inputRef: React.RefObject<ContentEditable>) {
  const [contextMenuStartIndex, setContextMenuStartIndex] = useState<number>(-1)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)

  const openContextMenu = () => {
    const selection = window.getSelection()
    const position = selection?.getRangeAt(0)?.startOffset ?? -1

    setContextMenuStartIndex(position)
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
      const selection = window.getSelection()
      const position = (selection?.getRangeAt(0)?.startOffset ?? 1) - 1
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

    inputRef.current?.el?.current?.addEventListener(
      'click',
      cursorPositionChange
    )
    inputRef.current?.el?.current?.addEventListener('keyup', onKeyUp)
    inputRef.current?.el?.current?.addEventListener('keydown', onKeyDown)

    return () => {
      inputRef.current?.el?.current?.removeEventListener(
        'click',
        cursorPositionChange
      )
      inputRef.current?.el?.current?.removeEventListener('keyup', onKeyUp)
      inputRef.current?.el?.current?.removeEventListener('keydown', onKeyDown)
    }
  }, [showContextMenu, contextMenuStartIndex])

  const onInputValueChangeContextMenu = () => {
    const selection = window.getSelection()
    const value = selection?.focusNode?.textContent ?? ''
    const position = (selection?.getRangeAt(0)?.startOffset ?? 1) - 1

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
