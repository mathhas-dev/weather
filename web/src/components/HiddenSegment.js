import React, { useEffect, useState } from 'react'
import {
  Button,
  Icon,
  Segment,
  Transition
} from 'semantic-ui-react'

const isNullish = value =>
  value === undefined || value === null

const HiddenSegment = props => {
  const {
    buttonIcon,
    buttonIconClosed,
    buttonIconOpen,
    buttonLabel,
    buttonLabelClosed,
    buttonLabelOpen,
    visible,
    showButton
  } = props

  const [isOpen, setIsOpen] = useState(true)
  useEffect(() => {
    const openState = visible || isNullish(visible)
    setIsOpen(openState)
  }, [visible])
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const isButtonVisible = showButton || isNullish(showButton)
  const iconOpen = buttonIconOpen || buttonIcon || 'chevron up'
  const iconClosed = buttonIconClosed || buttonIcon || 'chevron down'
  
  const labelOpen = buttonLabelOpen || buttonLabel || 'Esconder'
  const labelOClosed = buttonLabelClosed || buttonLabel || 'Revelar'

  return (
    <Segment
      style={{ padding: 0 }}
      color='violet'
      inverted
    >
      { isButtonVisible
        ? <Button
          icon
          onClick={toggleIsOpen}
          labelPosition='left'
          style={{
            textAlign: 'left',
            display: 'block',
            transition: 'all 0.4',
            width: '100%'
          }}
        >
          <Icon name={ isOpen ? iconOpen : iconClosed } />
          {isOpen ? labelOpen : labelOClosed}
        </Button>
        : null      
      }
      <Transition
        animation='slide down'
        visible={isOpen}
      >
        <div style={{
          opacity: isOpen ? 1 : 0,
          padding: isOpen
            ? '1em'
            : '0 1em',
          transition: 'all 400ms'
        }}>
          { props.children }
        </div>
      </Transition>
    </Segment>
  )
}

export default HiddenSegment