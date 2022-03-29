import { useEffect } from 'react'
import ContentEditable from 'react-contenteditable'

export function useInitialFocus(
  inputRef: React.RefObject<ContentEditable>,
  fieldValue: string
) {
  useEffect(() => {
    inputRef.current?.el?.current?.focus()
    setTimeout(() => {
      if (inputRef.current && fieldValue.length > 0) {
        const selection = window.getSelection()
        selection?.setPosition(inputRef.current?.el?.current, 0)
      }
    })
  }, [])
}
