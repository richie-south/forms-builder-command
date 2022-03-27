import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

type BaseField = {
  id: string
  value: string
}

type FieldCreatorProps = {
  type: 'creator'
} & BaseField

export type FieldInputProps = {
  type: 'input'
  properties: {
    validation: 'email' | 'phone' | 'none'
    inputType: 'text' | 'number'
  }
} & BaseField

type FieldLabelProps = {
  type: 'label'
  value: string
} & BaseField

export type Field = FieldCreatorProps | FieldInputProps | FieldLabelProps

export const getCreator = (value = ''): Field => ({
  id: uuidv4(),
  type: 'creator',
  value,
})

type FieldStoreState = {
  fields: Field[]
  addField: (field: Field, insertAfterId?: string) => void
  removeField: (id: string) => void

  updateField: (field: Field) => void
  updatePrevFieldValue: (id: string, value: string) => void
}

export const useFieldStore = create<FieldStoreState>(
  devtools(
    (set) => ({
      fields: [
        {
          id: 'creator',
          type: 'creator',
          value: '',
        },
        /*  {
          id: 'asads',
          type: 'input',
          value: '',
          properties: {
            inputType: 'text',
            validation: 'none',
          },
        }, */
      ],
      addField: (field, insertAfterId) =>
        insertAfterId
          ? set((state) => ({
              ...state,
              fields: state.fields.flatMap((stateField) => {
                if (stateField.id === insertAfterId) {
                  return [stateField, field]
                }
                return stateField
              }),
            }))
          : set((state) => ({
              ...state,
              fields: [...state.fields, field],
            })),
      removeField: (id) => {
        set((state) => {
          if (state.fields.length === 1) {
            if (state.fields[0].type !== 'creator') {
              return {
                ...state,
                fields: [getCreator()],
              }
            } else {
              return state
            }
          }

          return {
            ...state,
            fields: state.fields.filter((f) => f.id !== id),
          }
        })
      },

      updateField: (field) => {
        set((state) => ({
          ...state,
          fields: state.fields.map((_field) =>
            _field.id === field.id ? { ..._field, ...field } : _field
          ),
        }))
      },

      updatePrevFieldValue: (id, value) => {
        set((state) => {
          const index = state.fields.findIndex((field) => id === field.id)
          const prevIndex = index - 1
          if (index === -1 && prevIndex < 0) {
            return state
          }

          return {
            ...state,
            fields: state.fields.map((_field, index) =>
              index === prevIndex
                ? {
                    ..._field,
                    value: _field.value + value,
                  }
                : _field
            ),
          }
        })
      },
    }),
    { name: 'fieldStore' }
  )
)

export const selectField = (id: string) => (state: FieldStoreState) =>
  state.fields.find((f) => f.id === id)
export const selectFields = (state: FieldStoreState) => state.fields
export const selectNrOfFields = (state: FieldStoreState) => state.fields.length
export const selectAddField = (state: FieldStoreState) => state.addField
export const selectRemoveField = (state: FieldStoreState) => state.removeField
export const selectUpdateField = (state: FieldStoreState) => state.updateField
export const selectUpdatePrevFieldValue = (state: FieldStoreState) =>
  state.updatePrevFieldValue
