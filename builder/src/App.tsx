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
import {
  CreatorContainer,
  CreatorButtonsContainer,
  CreatorConfigButtons,
} from './components/creator-styles'
import { Popover } from 'react-tiny-popover'
import { CreatorContextMenu } from './components/creator-selector-menu/creator-selector-menu'
import { useContextMenu } from './hooks/use-selector-menu'

const AppContainer = styled.div`
  display: grid;
  height: 100%;
  justify-content: center;
  align-items: center;
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
  const [focus, setFocus] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    closeContextMenu,
    onInputValueChangeContextMenu,
    contextMenuStartIndex,
    showContextMenu,
  } = useContextMenu(inputRef)

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

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = () => {
    const updatedField: Field = {
      ...field,
      value: inputValue,
    }

    updateField(updatedField)
    setFocus(false)
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
    if (event.key === 'Enter' && !showContextMenu) {
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

  const handleCreatorInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setInputValue(value)
    onInputValueChangeContextMenu(value)
  }

  const getSelectorMenuSearchValue = (): string => {
    if (contextMenuStartIndex === -1) return ''

    return inputValue.substring(contextMenuStartIndex, inputValue.length)
  }

  return (
    <CreatorContainer>
      <CreatorButtonsContainer showButtons={focus}>
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
        <Popover
          isOpen={showContextMenu}
          positions={['bottom', 'top']}
          align="center"
          reposition
          onClickOutside={closeContextMenu}
          content={
            <CreatorContextMenu searchValue={getSelectorMenuSearchValue()} />
          }
        >
          <div>
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
          </div>
        </Popover>
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
