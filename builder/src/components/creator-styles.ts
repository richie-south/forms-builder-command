import styled, { css } from 'styled-components'
import { placeholderInputCss } from './style'

export const CreatorContainer = styled.div`
  display: grid;
  grid-template-columns: 62px 1fr;
  grid-gap: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 900px;

  :hover {
    .material-icons {
      display: flex;
    }

    ${placeholderInputCss}
  }
`

type CreatorButtonsContainerProps = {
  showButtons: boolean
}

export const CreatorButtonsContainer = styled.div<CreatorButtonsContainerProps>`
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: flex-start;
  grid-gap: 4px;

  ${(props) =>
    !props.showButtons &&
    css`
      .material-icons {
        display: none;
      }
    `}
`
