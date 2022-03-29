import React, { useState } from 'react'
import {
  useFieldStore,
  selectFields,
  selectRemoveField,
} from './lib/store/field-store'
import styled from 'styled-components'
import {
  CreatorContainer,
  CreatorButtonsContainer,
} from './components/creator-styles'
import { Field } from './types'
import { Icon } from './components/icon/icon'
import { TextField } from './components/text-field/text-field'
import { InputShortField } from './components/input-short-field/input-short-field'

const AppContainer = styled.div`
  display: grid;
  height: 100%;
  justify-content: center;
  align-items: center;
`

type CreatorProps = {
  field: Field
}

const Creator: React.FC<CreatorProps> = ({ field }) => {
  const removeField = useFieldStore(selectRemoveField)
  const [focus, setFocus] = useState<boolean>(false)

  const handleRemove = () => {
    removeField(field.id)
  }

  return (
    <CreatorContainer>
      <CreatorButtonsContainer showButtons={focus}>
        <Icon type="default" mass="large" onClick={handleRemove} pointer plate>
          delete_outline
        </Icon>
        <Icon type="default" mass="large" pointer plate>
          add
        </Icon>
      </CreatorButtonsContainer>

      {field.type === 'text' && (
        <TextField setFocus={setFocus} focus={focus} field={field} />
      )}
      {field.type === 'input-short' && (
        <InputShortField setFocus={setFocus} focus={focus} field={field} />
      )}
    </CreatorContainer>
  )
}

export const App: React.FC = () => {
  const fields = useFieldStore(selectFields)

  return (
    <AppContainer>
      {fields.map((field) => (
        <Creator key={field.id} field={field} />
      ))}
    </AppContainer>
  )
}
