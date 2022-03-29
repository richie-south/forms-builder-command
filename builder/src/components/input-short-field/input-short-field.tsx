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
import { Field } from '../../types'
import { getNewTextField } from '../../lib/field-creator'
import ContentEditable from 'react-contenteditable'
import { useRefCallback } from '../../hooks/use-ref-callback'
import { useInitialFocus } from '../../hooks/use-common-field'
import { getCursorEndPosition, getCursorStartPosition } from '../../lib/cursor'
import { clearHtml } from '../../lib/clear-html'
import { placeholderFocusCss } from '../style'

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
  line-break: after-white-space;

  width: 300px;
  line-height: 36px;
  cursor: text;

  height: 36px;
  padding: 0px 10px;
  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
    rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
  border: 0px;
  border-radius: 4px;
  background-color: white;
  color: #99979e;

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

export const InputShortField: React.FC<CreatorProps> = ({
  field,
  focus,
  setFocus,
}) => {
  const addField = useFieldStore(selectAddField)
  const updateField = useFieldStore(selectUpdateField)
  const removeField = useFieldStore(selectRemoveField)
  const updatePrevFieldValue = useFieldStore(selectUpdatePrevFieldValue)
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<ContentEditable>(null)

  useInitialFocus(inputRef, field.value)
  const [nextFocus] = useNextFocus(inputRef, {
    disable: !focus,
  })
  useEffect(() => {
    setInputValue(field.value)
  }, [field.value])

  const handleAddFieldOnEnter = () => {
    const allowedFields = [
      'input-short',
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
      if (event.key === 'Enter') {
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
    const value = clearHtml(inputValue)
    const updatedField: Field = {
      ...field,
      value: value,
    }
    setInputValue(value)
    updateField(updatedField)
    setFocus(false)
  }, [inputValue, field])

  const handleCreatorInputValueChange = (
    event: React.FormEvent<HTMLDivElement>
  ) => {
    setInputValue(event.currentTarget.textContent ?? '')
  }

  return (
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
        placeholder="Type placeholder text"
        className="creator-input"
        focus={focus}
      />
    </Container>
  )
}
