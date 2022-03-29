import React, { useEffect, useRef, useState } from 'react'
import { isChildOverflowing } from '../../lib/element-overflow'
import { fieldCreatorMap } from '../../lib/field-creator'
import { selectReplaceField, useFieldStore } from '../../lib/store/field-store'
import { FieldTypes } from '../../types'
import { Icon } from '../icon/icon'
import {
  ContextMenuContainer,
  ContextOptionItemContainer,
  ContextOptionItemIcon,
  ContextOptionItemText,
  ContextOptionSectionTitle,
} from './context-menu-styles'

type Option = {
  type: string
  icon: string
  label: string
  variant?: string
}

type OptionSection = {
  label: string
  options: Option[]
}

const options: OptionSection[] = [
  {
    label: 'Input blocks',
    options: [
      {
        type: 'input-short',
        variant: 'text',
        icon: 'short_text',
        label: 'Short answer',
      },
      { type: 'input-long', icon: 'subject', label: 'Long answer' },

      { type: 'input-short', variant: 'number', icon: '123', label: 'Number' },
      {
        type: 'input-short',
        variant: 'email',
        icon: 'alternate_email',
        label: 'Email',
      },
      {
        type: 'input-short',
        variant: 'phone',
        icon: 'call',
        label: 'Phone number',
      },
    ],
  },
  {
    label: 'Layout blocks',
    options: [
      { type: 'heading1', icon: 'title', label: 'Heading 1' },
      { type: 'heading2', icon: 'title', label: 'Heading 2' },
      { type: 'heading3', icon: 'title', label: 'Heading 3' },
      { type: 'label', icon: 'label', label: 'Label' },
      { type: 'text', icon: 'title', label: 'Text' },
      { type: 'divider', icon: 'horizontal_rule', label: 'Divider' },
    ],
  },
]

type Props = {
  searchValue?: string
  fieldId: string
  onCreateField: () => void
}

export const CreatorContextMenu: React.FC<Props> = ({
  searchValue = '',
  fieldId,
  onCreateField,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const replaceField = useFieldStore(selectReplaceField)

  const searchOptions = (options: OptionSection[]): OptionSection[] => {
    return options.reduce((sections, currentSection) => {
      const optionResult = currentSection.options.filter((o) =>
        o.label.toLowerCase().includes(searchValue.trim().toLowerCase())
      )

      if (optionResult.length <= 0) {
        return sections
      }

      const sel = {
        ...currentSection,
        options: optionResult,
      }

      return sections.concat(sel)
    }, [] as OptionSection[])
  }

  const sectionResult = searchOptions(options)
  const optionsLength = sectionResult.reduce(
    (length, currentSection) => currentSection.options.length + length,
    0
  )

  const refs = sectionResult
    .flatMap((s) => s.options)
    .reduce((acc) => {
      return acc.concat(React.createRef())
    }, [] as React.RefObject<unknown>[])

  const onSelection = () => {
    const total = sectionResult.flatMap((s) => s.options)
    const fieldToCreate = total[selectedIndex].type as FieldTypes
    const variant = total[selectedIndex].variant
    const fieldCreator = fieldCreatorMap[fieldToCreate]

    if (!fieldToCreate || !fieldCreator) {
      return
    }

    onCreateField()
    const field = fieldCreator('', variant)
    replaceField(fieldId, field)
  }

  const scrollToElement = (id: number) => {
    try {
      const itemRef = refs[id]?.current as HTMLElement
      if (
        isChildOverflowing(
          itemRef?.getBoundingClientRect(),
          (containerRef.current as Element).getBoundingClientRect()
        )
      ) {
        itemRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    } catch (error) {}
  }

  const updateSelectedIndex = (key: KeyboardEvent['key']) => {
    setSelectedIndex((state) => {
      if (key === 'ArrowDown' && state === optionsLength - 1) {
        scrollToElement(0)
        return 0
      } else if (key === 'ArrowUp' && state === 0) {
        scrollToElement(optionsLength - 1)
        return optionsLength - 1
      }

      scrollToElement(state + (key === 'ArrowUp' ? -1 : 1))
      return state + (key === 'ArrowUp' ? -1 : 1)
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!document.activeElement) {
        return
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        updateSelectedIndex(event.key)
      } else if (event.key === 'Enter') {
        onSelection()
      }
    }

    window?.addEventListener('keydown', onKeyDown)

    return () => {
      window?.removeEventListener('keydown', onKeyDown)
    }
  }, [optionsLength, selectedIndex])

  const handleOptionClick = () => {
    onSelection()
  }

  let globalIndex = 0
  return (
    <ContextMenuContainer ref={containerRef}>
      {optionsLength >= 0 &&
        sectionResult.map((section, index) => {
          return (
            <div key={index}>
              <ContextOptionSectionTitle lineBreak={index !== 0}>
                {section.label}
              </ContextOptionSectionTitle>
              {section.options.map((option) => {
                globalIndex += 1
                return (
                  <ContextOptionItemContainer
                    className="context-item"
                    key={option.type + option.variant}
                    ref={refs[globalIndex - 1] as any}
                    selected={selectedIndex === globalIndex - 1}
                    onClick={handleOptionClick}
                  >
                    <Icon mass="medium">{option.icon}</Icon>
                    <ContextOptionItemText>
                      {option.label}
                    </ContextOptionItemText>
                  </ContextOptionItemContainer>
                )
              })}
            </div>
          )
        })}

      {optionsLength === 0 && (
        <ContextOptionItemContainer static>
          <ContextOptionItemIcon className="material-icons">
            search
          </ContextOptionItemIcon>
          <ContextOptionItemText>No search result</ContextOptionItemText>
        </ContextOptionItemContainer>
      )}
    </ContextMenuContainer>
  )
}
