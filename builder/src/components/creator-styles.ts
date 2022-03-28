import styled, { css } from 'styled-components'

export const CreatorContainer = styled.div`
  display: grid;
  grid-template-columns: 114px 1fr;
  grid-gap: 16px;
`

export const CreatorConfigButtons = styled.div``

type CreatorButtonsContainerProps = {
  showButtons: boolean
}

export const CreatorButtonsContainer = styled.div<CreatorButtonsContainerProps>`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;

  ${(props) =>
    !props.showButtons &&
    css`
      ${CreatorConfigButtons} {
        display: none;
      }
    `}

  ${CreatorContainer}:hover & {
    ${CreatorConfigButtons} {
      display: block;
    }
  }
`
