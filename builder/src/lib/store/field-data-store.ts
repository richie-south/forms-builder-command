import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { FieldData } from '../../types'

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
  dataSets: Record<string, FieldData>
  updateField: (id: string, data: FieldData) => void
  updateFieldValue: (id: string, value: string) => void
  /* updatePrevFieldValue: (id: string, value: string) => void */
}

export const useFieldStore = create<FieldStoreState>(
  devtools(
    (set) => ({
      dataSets: {
        creator: {
          type: 'creator',
          value: '',
        },
      },
      updateField: (id, data) => {
        set((state) => ({
          ...state,
          dataSets: {
            ...state.dataSets,
            [id]: {
              ...state.dataSets[id],
              ...data,
            },
          },
        }))
      },

      updateFieldValue: (id, value) => {
        set((state) => ({
          ...state,
          dataSets: {
            ...state.dataSets,
            [id]: {
              ...state.dataSets[id],
              value,
            },
          },
        }))
      },

      /* updatePrevFieldValue: (id, value) => {
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
      }, */
    }),
    { name: 'fieldStore' }
  )
)

export const selectFieldData = (id: string) => (state: FieldStoreState) =>
  state.dataSets[id]

export const selectUpdateField = (state: FieldStoreState) => state.updateField
/* export const selectUpdatePrevFieldValue = (state: FieldStoreState) =>
  state.updatePrevFieldValue */
export const selectUpdateFieldValue = (state: FieldStoreState) =>
  state.updateFieldValue
