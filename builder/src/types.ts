type BaseFieldData = {
  value: string
}

type FieldDataCreator = {
  type: 'creator'
} & BaseFieldData

export type FieldDataInput = {
  type: 'input'
  properties: {
    validation: 'email' | 'phone' | 'none'
    inputType: 'text' | 'number'
  }
} & BaseFieldData

type FieldDataLabel = {
  type: 'label'
  value: string
} & BaseFieldData

export type FieldData = FieldDataCreator | FieldDataInput | FieldDataLabel
export type Field = {
  id: string
  type: 'creator' | 'input' | 'label'
}
