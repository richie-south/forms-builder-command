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
import ContentEditable from 'react-contenteditable'
import { useRefCallback } from './hooks/use-ref-callback'

function getCursorStartPosition(): number {
  try {
    const selection = window.getSelection()
    return selection?.getRangeAt(0)?.startOffset ?? 0
  } catch (error) {
    return -1
  }
}

function getCursorEndPosition(): number {
  try {
    const selection = window.getSelection()
    return selection?.getRangeAt(0)?.endOffset ?? 0
  } catch (error) {
    return -1
  }
}

const FakeInput = styled(ContentEditable)`
  outline: none;
  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);
  white-space: pre-wrap;
  word-break: break-word;

  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;

  width: 200px;
`

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
  const inputRef = useRef<ContentEditable>(null)

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
    inputRef.current?.el?.current?.focus()
    setTimeout(() => {
      if (inputRef.current && field.value.length > 0) {
        const selection = window.getSelection()
        selection?.setPosition(inputRef.current?.el?.current, 0)
      }
    })
  }, [])

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = useRefCallback(
    (event: React.FocusEvent<HTMLDivElement, Element>) => {
      const updatedField: Field = {
        ...field,
        value: inputValue,
      }

      updateField(updatedField)
      setFocus(false)
    },
    [inputValue]
  )

  const handleAddFieldOnEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
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

    if (allowedFields.includes(field.type)) {
      const position = getCursorStartPosition()

      const splitContent = (value.length !== 0 && position !== 0) ?? false

      if (splitContent) {
        const splitIndex = position ?? value.length
        const nextContent = value.slice(splitIndex)
        const updateCurentContent = value.substring(0, splitIndex)

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

  const handleKeyDown = useRefCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.shiftKey && event.key === 'Enter' && !showContextMenu) {
        console.log(event)
      } else if (event.key === 'Enter' && !showContextMenu) {
        event.preventDefault()
        handleAddFieldOnEnter(event)
      } else if (
        event.key === 'Backspace' &&
        getCursorStartPosition() === 0 &&
        getCursorEndPosition() === 0
      ) {
        event.preventDefault()
        handleRemove()
      }
    },
    [inputValue]
  )

  const handleCreatorInputValueChange = (
    event: React.FormEvent<HTMLDivElement>
  ) => {
    setInputValue(event.currentTarget.innerHTML)
    onInputValueChangeContextMenu()
  }

  const getSelectorMenuSearchValue = (): string => {
    if (contextMenuStartIndex === -1) return ''

    const selection = window.getSelection()
    const value = selection?.focusNode?.textContent ?? ''

    return value.substring(contextMenuStartIndex, value.length)
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
            <FakeInput
              ref={inputRef}
              html={inputValue}
              contentEditable={true}
              tabIndex={0}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
