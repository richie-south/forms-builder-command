import { useEffect } from 'react'
import ContentEditable from 'react-contenteditable'

export function useInitialFocus(
  inputRef: React.RefObject<ContentEditable>,
  fieldValue: string,
  focus: boolean
) {
  useEffect(() => {
    inputRef.current?.el?.current?.focus()
    setTimeout(() => {
      /* inputRef.current?.el?.current?.focus() */
      if (inputRef.current && fieldValue.length > 0) {
        const selection = window.getSelection()
        selection?.setPosition(inputRef.current?.el?.current, 0)
      }
    })
  }, [])

  useEffect(() => {
    if (focus) {
      inputRef.current?.el?.current?.focus()
    }
  }, [focus])
}
