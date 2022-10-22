import { Field, FieldTypes } from '../types'
import { getCursorStartPosition } from './cursor'
import { getNewTextField } from './field-creator'
import { selectAddField, useFieldStore } from './store/field-store'

export function addFieldOnEnter(
  inputValue: string,
  fieldType: FieldTypes,
  fieldId: string
): string | undefined {
  const allowedFields = [
    'input',
    'input-long',
    'text',
    'label',
    'heading1',
    'heading2',
    'heading3',
    'divider',
  ]
  const value = inputValue

  if (allowedFields.includes(fieldType)) {
    const position = getCursorStartPosition()

    const splitContent = (value.length !== 0 && position !== 0) ?? false
    const addField = selectAddField(useFieldStore.getState())

    if (splitContent) {
      const splitIndex = position ?? value.length
      const nextContent = value.slice(splitIndex)
      const updateCurentContent = value.substring(0, splitIndex)

      addField(getNewTextField(nextContent), fieldId)
      return updateCurentContent
    }

    addField(getNewTextField(), fieldId)
    return undefined
  }

  return undefined
}
