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

const FakeInput = styled.div`
  outline: none;
  color: rgb(55, 53, 47);
  caret-color: rgb(55, 53, 47);
  white-space: pre-wrap;
  word-break: break-word;

  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;

  min-height: 30px;
  width: 200px;
  line-height: 1.5;
  padding: 3px 0px;
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

  const placeCaret = (position: number) => {
    const root = inputRef.current
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    const node: any = root?.firstChild?.firstChild ?? root?.firstChild

    range?.setStart(node, position)
  }

  const handleFocus = () => {
    const root = inputRef.current

    placeCaret(root?.innerText.length ?? 0)

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
    if (event.shiftKey && event.key === 'Enter' && !showContextMenu) {
      console.log(event)
    } else if (event.key === 'Enter' && !showContextMenu) {
      event.preventDefault()
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

  const handleCreatorInputValueChange = (event: any) => {
    const root = inputRef.current
    const value = root?.innerHTML ?? ''
    setInputValue(value)
    setTimeout(() => {
      placeCaret(root?.innerText.length ?? 0)
    }, 0)
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
            <FakeInput
              ref={inputRef}
              /* type="text" */
              contentEditable={true}
              /* autoFocus */
              tabIndex={0}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onInput={handleCreatorInputValueChange}
              /* value={inputValue} */
              /* onChange={handleCreatorInputValueChange} */
              onKeyDown={handleKeyDown}
              placeholder="Type '/' to insert blocks"
              className="creator-input"
              dangerouslySetInnerHTML={{ __html: inputValue }}
            ></FakeInput>
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

/* suppressContentEditableWarning={true} */
