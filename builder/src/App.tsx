import React, { useEffect, useRef, useState } from 'react'
import {
  useFieldStore,
  selectFields,
  selectAddField,
  selectRemoveField,
  selectUpdateField,
  selectUpdatePrevFieldValue,
} from './lib/store/field-store'
import styled from 'styled-components'
import { useNextFocus } from './hooks/use-next-focus'
import {
  CreatorContainer,
  CreatorButtonsContainer,
  CreatorConfigButtons,
} from './components/creator-styles'
import { Popover } from 'react-tiny-popover'
import { CreatorContextMenu } from './components/context-menu/context-menu'
import { useContextMenu } from './hooks/use-selector-menu'
import { useDisableArrowUpDown } from './hooks/use-disable-arrow-up-down'
import { Field } from './types'
import { getNewTextField } from './lib/field-creator'

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

  const shouldDisableFocus = () => {
    if (showContextMenu) return true

    if (!focus) return true

    return false
  }

  useDisableArrowUpDown(inputRef, !showContextMenu)
  const [nextFocus] = useNextFocus(inputRef, {
    disable: shouldDisableFocus(),
  })

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

  const handleAddFieldOnEnter = () => {
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

    if (allowedFields.includes(field.type)) {
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
        addField(getNewTextField(nextContent), field.id)
      } else {
        addField(getNewTextField(), field.id)
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
      handleAddFieldOnEnter()
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

  const onCreateFieldFromContextMenu = () => {
    closeContextMenu()
  }

  return (
    <CreatorContainer>
      <CreatorButtonsContainer showButtons={focus}>
        <CreatorConfigButtons onClick={handleRemove}>
          remove
        </CreatorConfigButtons>
        <CreatorConfigButtons>add</CreatorConfigButtons>
      </CreatorButtonsContainer>

      {field.type === 'text' && (
        <Popover
          isOpen={showContextMenu}
          positions={['bottom', 'top']}
          align="center"
          reposition
          onClickOutside={closeContextMenu}
          content={
            <CreatorContextMenu
              fieldId={field.id}
              searchValue={getSelectorMenuSearchValue()}
              onCreateField={onCreateFieldFromContextMenu}
            />
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

  return (
    <AppContainer>
      {fields.map((field) => (
        <Creator key={field.id} field={field} />
      ))}
    </AppContainer>
  )
}
