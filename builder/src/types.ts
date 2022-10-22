type BaseInputField = {
  defaultValue?: number | string
  required?: boolean
}

type BaseField = {
  id: string
  value: string
}

type BaseTextField = {
  weight: 'bold' | 'normal'
}

// input fields

export type FieldInputShort = {
  type: 'input-short'
  variant: 'email' | 'phone' | 'number' | 'text'
  min?: number
  max?: number
  maxChars?: number
  minChars?: number
} & BaseInputField &
  BaseField

export type FieldInputLong = {
  type: 'input-long'
  maxChars?: number
  minChars?: number
} & BaseInputField &
  BaseField

// texts fields

type FieldText = {
  type: 'text'
} & BaseTextField &
  BaseField

type FieldLabel = {
  type: 'label'
} & BaseTextField &
  BaseField

export type FieldHeading1 = {
  type: 'heading1'
} & BaseTextField &
  BaseField

type FieldHeading2 = {
  type: 'heading2'
} & BaseTextField &
  BaseField

type FieldHeading3 = {
  type: 'heading3'
} & BaseTextField &
  BaseField

type FieldDivider = {
  type: 'divider'
} & BaseTextField &
  BaseField

export type FieldTypes =
  | 'input-short'
  | 'input-long'
  | 'text'
  | 'label'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'divider'

export type Field =
  | FieldInputShort
  | FieldInputLong
  | FieldText
  | FieldLabel
  | FieldHeading1
  | FieldHeading2
  | FieldHeading3
  | FieldDivider
