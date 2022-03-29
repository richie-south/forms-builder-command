import { css } from 'styled-components'

const placeholder = css`
  :empty:before {
    content: attr(placeholder);
    position: absolute;
    color: #99979e;
    background-color: transparent;
  }
`
export const placeholderFocusCss = css<{
  focus: boolean
}>`
  ${(props) =>
    props.focus &&
    css`
      ${placeholder}
    `}
`

export const placeholderInputCss = css`
  .creator-input:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: #99979e;
    background-color: transparent;
  }
`
