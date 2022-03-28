export const isChildOverflowing = (
  child: DOMRect,
  parent: DOMRect
): boolean => {
  if (child.top < parent.top) {
    return true
  }

  if (child.bottom > parent.bottom) {
    return true
  }

  if (child.left < parent.left) {
    return true
  }

  if (child.right > parent.right) {
    return true
  }

  return false
}
