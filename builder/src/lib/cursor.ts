export function getCursorStartPosition(): number {
  try {
    const selection = window.getSelection()
    return selection?.getRangeAt(0)?.startOffset ?? 0
  } catch (error) {
    return -1
  }
}

export function getCursorEndPosition(): number {
  try {
    const selection = window.getSelection()
    return selection?.getRangeAt(0)?.endOffset ?? 0
  } catch (error) {
    return -1
  }
}
