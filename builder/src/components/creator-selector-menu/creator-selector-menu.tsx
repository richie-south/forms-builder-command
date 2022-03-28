import styled from 'styled-components'

const SelectorMenuContainer = styled.div`
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

const SelectorOptionItemContainer = styled.button`
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

  :hover {
    background-color: #ebe9ed;
  }

  transition: background-color 100ms linear;
`

const SelectorOptionItemIcon = styled.div`
  color: #99979e;
`

const SelectorOptionItemText = styled.div``

const options = [
  { type: 'label', icon: 'info', label: 'label' },
  { type: 'input-text', icon: 'info', label: 'Short answer' },
  { type: 'input-email', icon: 'info', label: 'Email' },
  { type: 'input-phone', icon: 'info', label: 'Phone number' },
  { type: 'input-number', icon: 'info', label: 'Number' },
]

type Props = {
  searchValue?: string
}

export const CreatorSelectorMenu: React.FC<Props> = ({ searchValue = '' }) => {
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.trim().toLowerCase())
  )

  return (
    <SelectorMenuContainer>
      {filteredOptions.map((option) => {
        return (
          <SelectorOptionItemContainer key={option.type}>
            <SelectorOptionItemIcon className="material-icons">
              {option.icon}
            </SelectorOptionItemIcon>
            <SelectorOptionItemText>{option.label}</SelectorOptionItemText>
          </SelectorOptionItemContainer>
        )
      })}

      {filteredOptions.length === 0 && <div>No search result</div>}
    </SelectorMenuContainer>
  )
}