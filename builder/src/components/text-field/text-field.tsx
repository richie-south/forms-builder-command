import React, { useEffect, useRef, useState } from 'react'
import {
  useFieldStore,
  selectAddField,
  selectRemoveField,
  selectUpdateField,
  selectUpdatePrevFieldValue,
} from '../../lib/store/field-store'
import styled from 'styled-components'
import { useNextFocus } from '../../hooks/use-next-focus'
import { Popover } from 'react-tiny-popover'
import { CreatorContextMenu } from '../../components/context-menu/context-menu'
import { useContextMenu } from '../../hooks/use-context-menu'
import { useDisableArrowUpDown } from '../../hooks/use-disable-arrow-up-down'
import { Field } from '../../types'
import { getNewTextField } from '../../lib/field-creator'
import ContentEditable from 'react-contenteditable'
import { useRefCallback } from '../../hooks/use-ref-callback'
import { useInitialFocus } from '../../hooks/use-common-field'
import { getCursorEndPosition, getCursorStartPosition } from '../../lib/cursor'
import { placeholderFocusCss } from '../style'
import { useRemoveField } from '../../hooks/use-remove-field'
import { addFieldOnEnter } from '../../lib/add-field-on-enter'

const FakeInput = styled(ContentEditable)<{
  focus: boolean
}>`
  outline: none;
  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);
  white-space: pre-wrap;
  word-break: break-word;

  -webkit-user-modify: read-write;
  overflow-wrap: break-word;

  width: 200px;
  min-height: 28px;
  line-height: 26px;
  cursor: text;

  ${placeholderFocusCss}
`

const Container = styled.div`
  padding-bottom: 5px; ;
`

type CreatorProps = {
  field: Field
  focus: boolean
  setFocus: (focus: boolean) => void
}

export const TextField: React.FC<CreatorProps> = ({
  field,
  focus,
  setFocus,
}) => {
  const updateField = useFieldStore(selectUpdateField)
  const [inputValue, setInputValue] = useState<string>('')

  const inputRef = useRef<ContentEditable>(null)

  const {
    closeContextMenu,
    onInputValueChangeContextMenu,
    contextMenuStartNodeIndex,
    contextMenuStartElementIndex,
    showContextMenu,
  } = useContextMenu(inputRef)

  const shouldDisableFocus = () => {
    if (showContextMenu || !focus) return true
    return false
  }

  useInitialFocus(inputRef, field.value, focus)
  useDisableArrowUpDown(inputRef, !showContextMenu)
  const handleRemove = useRemoveField(
    inputRef,
    inputValue,
    field.id,
    shouldDisableFocus()
  )

  useEffect(() => {
    setInputValue(field.value)
  }, [field.value])

  const handleAddFieldOnEnter = () => {
    const updateCurentContent = addFieldOnEnter(
      inputValue,
      field.type,
      field.id
    )

    if (updateCurentContent) {
      setInputValue(updateCurentContent)
    }
  }

  const handleKeyDown = useRefCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.shiftKey && event.key === 'Enter' && !showContextMenu) {
        /** allow multiline */
        // TODO: handle navigation for multiline
        console.log('shift enter?')
      } else if (event.key === 'Enter' && !showContextMenu) {
        event.preventDefault()
        handleAddFieldOnEnter()
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

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = useRefCallback(() => {
    const updatedField: Field = {
      ...field,
      value: inputValue,
    }

    updateField(updatedField)
    setFocus(false)
  }, [inputValue, field])

  const handleCreatorInputValueChange = (
    event: React.FormEvent<HTMLDivElement>
  ) => {
    setInputValue(event.currentTarget.innerHTML)
    onInputValueChangeContextMenu()
  }

  const getSelectorMenuSearchValue = (): string => {
    if (contextMenuStartNodeIndex === -1) return ''

    const selection = window.getSelection()
    const value = selection?.focusNode?.textContent ?? ''

    return value.substring(contextMenuStartNodeIndex, value.length)
  }

  const onCreateFieldFromContextMenu = () => {
    // TODO: remove / from active selection

    closeContextMenu()
  }

  return (
    <Popover
      isOpen={showContextMenu}
      positions={['bottom', 'top']}
      align="start"
      reposition
      onClickOutside={closeContextMenu}
      content={
        <CreatorContextMenu
          fieldId={field.id}
          fieldValue={inputValue}
          searchValue={getSelectorMenuSearchValue()}
          onCreateField={onCreateFieldFromContextMenu}
        />
      }
    >
      <Container>
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
          focus={focus}
        />
      </Container>
    </Popover>
  )
}
