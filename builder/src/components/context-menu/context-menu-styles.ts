import styled, { css } from 'styled-components'

export const ContextMenuContainer = styled.div`
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

export const ContextOptionItemContainer = styled.button<{
  selected?: boolean
}>`
  display: grid;
  grid-auto-columns: 20px 1fr;
  grid-auto-flow: column;
  grid-gap: 12px;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
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

export const ContextOptionItemIcon = styled.div`
  color: #99979e;
  font-size: 20px;
`

export const ContextOptionItemText = styled.div``

export const ContextOptionSectionTitle = styled.div<{
  lineBreak?: boolean
}>`
  font-size: 14px;
  font-weight: bold;
  color: #99979e;
  padding-left: 12px;
  padding-top: 6px;
  padding-bottom: 6px;

  ${(props) =>
    props.lineBreak &&
    css`
      border-top: 1px solid #ebe9ed;
      margin-top: 6px;
    `}
`
