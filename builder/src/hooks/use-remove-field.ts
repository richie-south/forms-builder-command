import ContentEditable from 'react-contenteditable'
import {
  selectRemoveField,
  selectUpdatePrevFieldValue,
  useFieldStore,
} from '../lib/store/field-store'
import { useNextFocus } from './use-next-focus'

export function useRemoveField(
  inputRef: React.RefObject<ContentEditable>,
  inputValue: string,
  fieldId: string,
  focus: boolean
) {
  const updatePrevFieldValue = useFieldStore(selectUpdatePrevFieldValue)
  const removeField = useFieldStore(selectRemoveField)
  const [nextFocus] = useNextFocus(inputRef, {
    disable: focus,
  })

  const handleRemove = () => {
    if (inputValue) {
      updatePrevFieldValue(fieldId, inputValue)
    }

    nextFocus()
    removeField(fieldId)
  }

  return handleRemove
}
