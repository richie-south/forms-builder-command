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
import { Field, FieldHeading1 } from '../../types'
import { getNewTextField } from '../../lib/field-creator'
import ContentEditable from 'react-contenteditable'
import { useRefCallback } from '../../hooks/use-ref-callback'
import { useInitialFocus } from '../../hooks/use-common-field'
import { getCursorEndPosition, getCursorStartPosition } from '../../lib/cursor'
import { clearHtml } from '../../lib/clear-html'
import { placeholderFocusCss } from '../style'
import { useRemoveField } from '../../hooks/use-remove-field'

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

  width: 264px;
  min-height: 28px;
  line-height: 26px;

  font-size: 32px;
  font-weight: bold;

  cursor: text;
  ${placeholderFocusCss}
`

const Container = styled.div`
  padding-bottom: 5px;
`

type CreatorProps = {
  field: FieldHeading1
  focus: boolean
  setFocus: (focus: boolean) => void
}

export const HeadingField: React.FC<CreatorProps> = ({
  field,
  focus,
  setFocus,
}) => {
  const addField = useFieldStore(selectAddField)
  const updateField = useFieldStore(selectUpdateField)
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<ContentEditable>(null)

  useInitialFocus(inputRef, field.value, focus)
  const handleRemove = useRemoveField(inputRef, inputValue, field.id, !focus)
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

        addField(getNewTextField(nextContent), field.id)
        setInputValue(updateCurentContent)
      } else {
        addField(getNewTextField(), field.id)
      }
    }
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
        placeholder="Heading 1"
        className="creator-input"
        focus={focus}
      />
    </Container>
  )
}
