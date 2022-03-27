import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  useFieldStore,
  selectFields,
  selectAddField,
  selectRemoveField,
  getCreator,
  selectUpdateField,
  selectUpdatePrevFieldValue,
  Field,
  FieldInputProps,
} from './lib/store/field-store'
import styled, { css } from 'styled-components'
import { useFocusCreator } from './hooks/use-focus-creator'

const AppContainer = styled.div`
  display: grid;
  height: 100%;
  justify-content: center;
  align-items: center;
`

type CreatorInputProps = {
  field: FieldInputProps
  onFocus: () => void
  onBlur: () => void
  nextFocus: () => void
}

const CreatorInput: React.FC<CreatorInputProps> = ({
  field,
  onFocus,
  onBlur,
  nextFocus,
}) => {
  const [value, setValue] = useState<string>(field.value)
  const updateField = useFieldStore(selectUpdateField)
  const removeField = useFieldStore(selectRemoveField)
  const addField = useFieldStore(selectAddField)

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setValue(value)
  }

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const updatedField: FieldInputProps = {
      ...field,
      value,
    }

    updateField(updatedField)
    onBlur()
  }

  const handleAddField = () => {
    addField(getCreator(), field.id)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddField()
    } else if (event.key === 'Backspace' && value === '') {
      nextFocus()
      removeField(field.id)
    }
  }

  return (
    <input
      type={field.properties.inputType}
      value={value}
      placeholder="Label"
      onChange={handleValueChange}
      autoFocus
      onBlur={handleOnBlur}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      className="creator-input"
    />
  )
}

const CreatorContainer = styled.div`
  display: grid;
  grid-template-columns: 114px 1fr;
  grid-gap: 16px;
`

const CreatorConfigButtons = styled.div``

type CreatorButtonsContainerProps = {
  showButtons: boolean
}

const CreatorButtonsContainer = styled.div<CreatorButtonsContainerProps>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;

  ${(props) =>
    !props.showButtons &&
    css`
      ${CreatorConfigButtons} {
        display: none;
      }
    `}

  ${CreatorContainer}:hover & {
    ${CreatorConfigButtons} {
      display: block;
    }
  }
`

type CreatorProps = {
  field: Field
  nextFocus: (direction?: 'ArrowUp' | 'ArrowDown', position?: number) => void
}

const Creator: React.FC<CreatorProps> = ({ field, nextFocus }) => {
  const addField = useFieldStore(selectAddField)
  const updateField = useFieldStore(selectUpdateField)
  const removeField = useFieldStore(selectRemoveField)
  const updatePrevFieldValue = useFieldStore(selectUpdatePrevFieldValue)

  const [inputValue, setInputValue] = useState<string>('')
  const [showButtons, setShowButtons] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(field.value)
  }, [field.value])

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current && field.value.length > 0) {
        inputRef.current.setSelectionRange(0, 0)
        inputRef.current.selectionStart = 0
        inputRef.current.selectionEnd = 0
      }
    })
  }, [])

  const handleFocus = useCallback(() => {
    setShowButtons(true)
  }, [])

  const handleBlur = () => {
    const updatedField: Field = {
      ...field,
      value: inputValue,
    }

    updateField(updatedField)
    setShowButtons(false)
  }

  const handleAddField = () => {
    if (field.type === 'creator') {
      const splitContent =
        (inputValue.length !== 0 &&
          inputRef.current?.selectionStart !== 0 &&
          inputRef.current?.selectionStart &&
          inputRef.current?.selectionEnd) ??
        false

      if (splitContent) {
        const splitIndex = inputRef.current?.selectionStart ?? inputValue.length
        const nextContent = inputValue.slice(splitIndex)
        const updateCurentContent = inputValue.substring(0, splitIndex)
        setInputValue(updateCurentContent)
        addField(getCreator(nextContent), field.id)
      } else {
        addField(getCreator(), field.id)
      }
    }
  }

  const handleRemove = () => {
    if (inputValue) {
      updatePrevFieldValue(field.id, inputValue)
    }

    nextFocus()
    removeField(field.id)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddField()
    } else if (
      event.key === 'Backspace' &&
      inputRef.current?.selectionStart === 0 &&
      inputRef.current?.selectionEnd === 0
    ) {
      event.preventDefault()
      handleRemove()
    }
  }

  const handleOpenContextMenu = () => {
    /* TODO: open */
  }

  const handleCreatorInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setInputValue(value)

    if (value.trim() === '/') {
      handleOpenContextMenu()
    }
  }

  return (
    <CreatorContainer>
      <CreatorButtonsContainer showButtons={showButtons}>
        <CreatorConfigButtons onClick={handleRemove}>
          remove
        </CreatorConfigButtons>
        <CreatorConfigButtons>add</CreatorConfigButtons>
      </CreatorButtonsContainer>

      {/* {field.type === 'input' && (
        <CreatorInput
          field={field}
          onFocus={handleFocus}
          onBlur={handleBlur}
          nextFocus={nextFocus}
        />
      )} */}
      {field.type === 'creator' && (
        <input
          ref={inputRef}
          type="text"
          autoFocus
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleCreatorInputValueChange}
          onKeyDown={handleKeyDown}
          placeholder="Type '/' to insert blocks"
          className="creator-input"
        />
      )}
    </CreatorContainer>
  )
}

export const App: React.FC = () => {
  const fields = useFieldStore(selectFields)
  const [nextFocus] = useFocusCreator()

  return (
    <div className="App">
      <AppContainer>
        {fields.map((field) => (
          <Creator key={field.id} field={field} nextFocus={nextFocus} />
        ))}
      </AppContainer>
    </div>
  )
}
