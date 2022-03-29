import styled, { css } from 'styled-components'

type Sizes = 'large' | 'medium' | 'small'

const massMap: { [key in Sizes]: { icon: number; plate: number } } = {
  large: {
    icon: 24,
    plate: 28,
  },
  medium: {
    icon: 20,
    plate: 22,
  },
  small: {
    icon: 16,
    plate: 18,
  },
}

type ColorSets = 'default'

const colorMap: { [key in ColorSets]: { icon: string; plate: string } } = {
  default: {
    icon: '#99979e',
    plate: '#ebe9ed',
  },
}

const IconBase = styled.div<{
  iconSize: number
  plateSize: number
  iconColor: string
  plateColor: string
  pointer: boolean
  plate: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 4px;

  ${(props) =>
    props.pointer &&
    css`
      cursor: pointer;
    `}

  color: ${(props) => props.iconColor};
  font-size: ${(props) => props.iconSize}px;
  height: ${(props) => props.plateSize}px;
  width: ${(props) => props.plateSize}px;

  ${(props) =>
    props.plate &&
    css`
      :hover {
        background-color: white;
        background-color: ${props.plateColor};
      }
    `}

  transition: background-color 100ms linear;
`

type Props = {
  mass?: Sizes
  type?: 'default'
  pointer?: boolean
  plate?: boolean
}

export const Icon: React.FC<React.HTMLProps<HTMLDivElement> & Props> = ({
  mass = 'medium',
  type = 'default',
  pointer = false,
  plate = false,
  children,
  ...props
}) => {
  const { icon: iconSize, plate: plateSize } = massMap[mass as Sizes]
  const { icon: iconColor, plate: plateColor } = colorMap[type]

  return (
    <IconBase
      iconSize={iconSize}
      plateSize={plateSize}
      iconColor={iconColor}
      plateColor={plateColor}
      plate={plate}
      pointer={pointer}
      {...(props as any)}
      className={`material-icons ${props.className}`}
    >
      {children}
    </IconBase>
  )
}
