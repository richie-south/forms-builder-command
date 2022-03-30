import { useEffect, useState } from 'react'
import ContentEditable from 'react-contenteditable'

function getCaretCharacterOffsetWithin(element: HTMLElement) {
  const selection = window.getSelection()
  if ((selection?.rangeCount ?? 0) > 0) {
    const range = selection?.getRangeAt(0)
    const preCaretRange = range?.cloneRange()
    preCaretRange?.selectNodeContents(element)

    if (range?.endContainer) {
      preCaretRange?.setEnd(range.endContainer, range.endOffset)
      return preCaretRange?.toString().length ?? 0
    }
  }

  return 0
}

export function useContextMenu(inputRef: React.RefObject<ContentEditable>) {
  const [contextMenuStartNodeIndex, setContextMenuStartNodeIndex] =
    useState<number>(-1)
  const [contextMenuStartElementIndex, setContextMenuStartElementIndex] =
    useState<number>(-1)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)

  const openContextMenu = () => {
    const selection = window.getSelection()
    const position = selection?.getRangeAt(0)?.startOffset ?? -1

    setContextMenuStartNodeIndex(position)
    setContextMenuStartElementIndex(
      getCaretCharacterOffsetWithin(inputRef.current?.el?.current)
    )
    setShowContextMenu(true)
  }

  const closeContextMenu = () => {
    setContextMenuStartNodeIndex(-1)
    setContextMenuStartElementIndex(-1)
    setShowContextMenu(false)
  }

  useEffect(() => {
    if (!showContextMenu) {
      return
    }

    const cursorPositionChange = () => {
      const selection = window.getSelection()
      const position = (selection?.getRangeAt(0)?.startOffset ?? 1) - 1
      if (position < contextMenuStartNodeIndex) {
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
  }, [showContextMenu, contextMenuStartNodeIndex])

  const onInputValueChangeContextMenu = () => {
    const selection = window.getSelection()
    const value = selection?.focusNode?.textContent ?? ''
    const position = (selection?.getRangeAt(0)?.startOffset ?? 1) - 1

    if (value === '/' || (value[position] === '/' && !showContextMenu)) {
      openContextMenu()
    } else if (
      showContextMenu &&
      value[contextMenuStartNodeIndex - 1] !== '/'
    ) {
      closeContextMenu()
    }
  }

  return {
    openContextMenu,
    closeContextMenu,
    onInputValueChangeContextMenu,
    contextMenuStartNodeIndex,
    contextMenuStartElementIndex,
    showContextMenu,
  }
}
