import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useNextFocus } from '../../hooks/use-next-focus'

const ContextMenuContainer = styled.div`
  background-color: white;
  box-shadow: 0px -8px 6px -2px rgb(0 0 0 / 5%),
    0px 10px 15px -3px rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding-top: 16px;
  padding-bottom: 16px;
  width: 320px;
  height: 400px;
  overflow-y: auto;
`

const ContextOptionItemContainer = styled.button<{
  selected?: boolean
}>`
  display: grid;
  grid-auto-columns: 24px 1fr;
  grid-auto-flow: column;
  grid-gap: 12px;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 12px;
  padding-left: 12px;
  background-color: white;
  width: 100%;
  border: none;
  text-align: start;
  appearance: none;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    css`
      background-color: #ebe9ed;
    `}

  :hover {
    background-color: #ebe9ed;
  }

  transition: background-color 100ms linear;
`

const ContextOptionItemIcon = styled.div`
  color: #99979e;
`

const ContextOptionItemText = styled.div``

const options = [
  { type: 'label', icon: 'info', label: 'label' },
  { type: 'input-text', icon: 'info', label: 'Short answer' },
  { type: 'input-email', icon: 'info', label: 'Email' },
  { type: 'input-phone', icon: 'info', label: 'Phone number' },
  { type: 'input-number', icon: 'info', label: 'Number' },
]

type Props = {
  searchValue?: string
  onClose: () => void
}

export const CreatorContextMenu: React.FC<Props> = ({
  searchValue = '',
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.trim().toLowerCase())
  )
  const filteredOptionsLength = filteredOptions.length

  const onSelection = () => {
    /* new creator from selected element */
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!document.activeElement) {
        return
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setSelectedIndex((state) => {
          if (
            event.key === 'ArrowDown' &&
            state === filteredOptionsLength - 1
          ) {
            return 0
          } else if (event.key === 'ArrowUp' && state === 0) {
            return filteredOptionsLength - 1
          }

          return state + (event.key === 'ArrowUp' ? -1 : 1)
        })
      } else if (event.key === 'Enter') {
        onSelection()
        onClose()
      }
    }

    window?.addEventListener('keydown', onKeyDown)

    return () => {
      window?.removeEventListener('keydown', onKeyDown)
    }
  }, [filteredOptionsLength])

  const handleOptionClick = () => {
    onSelection()
    onClose()
  }

  return (
    <ContextMenuContainer>
      {filteredOptions.map((option, index) => {
        return (
          <ContextOptionItemContainer
            className="context-item"
            key={option.type}
            selected={selectedIndex === index}
            onClick={handleOptionClick}
          >
            <ContextOptionItemIcon className="material-icons">
              {option.icon}
            </ContextOptionItemIcon>
            <ContextOptionItemText>{option.label}</ContextOptionItemText>
          </ContextOptionItemContainer>
        )
      })}

      {filteredOptions.length === 0 && (
        <ContextOptionItemContainer>
          <ContextOptionItemIcon className="material-icons">
            search
          </ContextOptionItemIcon>
          <ContextOptionItemText>No search result</ContextOptionItemText>
        </ContextOptionItemContainer>
      )}
    </ContextMenuContainer>
  )
}
