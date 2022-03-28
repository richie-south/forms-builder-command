import { v4 as uuidv4 } from 'uuid'
import { Field, FieldInputShort, FieldTypes } from '../types'

export const getNewInputShortField = (
  value = '',
  variant: FieldInputShort['variant']
): Field => ({
  id: uuidv4(),
  type: 'input-short',
  value,
  variant,
})

export const getNewInputLongField = (value = ''): Field => ({
  id: uuidv4(),
  type: 'input-long',
  value,
})

export const getNewTextField = (value = ''): Field => ({
  id: uuidv4(),
  type: 'text',
  value,
  weight: 'normal',
})
export const getNewLabelField = (value = ''): Field => ({
  id: uuidv4(),
  type: 'label',
  value,

  weight: 'normal',
})
export const getNewHeading1Field = (value = ''): Field => ({
  id: uuidv4(),
  type: 'heading1',
  value,

  weight: 'normal',
})
export const getNewHeading2Field = (value = ''): Field => ({
  id: uuidv4(),
  type: 'heading2',
  value,

  weight: 'normal',
})
export const getNewHeading3Field = (value = ''): Field => ({
  id: uuidv4(),
  type: 'heading3',
  value,

  weight: 'normal',
})
export const getNewDividerField = (value = ''): Field => ({
  id: uuidv4(),
  type: 'divider',
  value,

  weight: 'normal',
})

export const fieldCreatorMap: {
  [key in FieldTypes]: (...params: any) => Field
} = {
  'input-short': getNewInputShortField,
  'input-long': getNewInputLongField,
  text: getNewTextField,
  label: getNewLabelField,
  heading1: getNewHeading1Field,
  heading2: getNewHeading2Field,
  heading3: getNewHeading3Field,
  divider: getNewDividerField,
}
