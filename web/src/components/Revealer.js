import React, { useState, useEffect } from 'react'
import { Button, Segment } from 'semantic-ui-react'
import './Revealer.css'

const Revealer = props => {
    const {
      addToggle,
      buttonColor,
      color,
      inverted,
      open,
      style,
      styleClosed,
      styleOpen,
      backgroundColor,
      ...others
    } = props

    const [panelOpen, setPanelOpen] = useState(false)
    useEffect(() => {
        setPanelOpen(open)
    }, [open])

    const classes = panelOpen
      ? 'revealer__panel--open'
      : 'revealer__panel'

    const toggleOpen = () => setPanelOpen(!panelOpen)

    return (
      <div
        style={{
            position: 'relative',
            marginBottom: addToggle ? -14 : null,
            ...style,
            ...(panelOpen ? styleOpen : styleClosed)
        }}
        {...others}
      >
        { addToggle
            ? <Button
              className='revealer__button'
              size='mini'
              color={buttonColor || null}
              icon={`angle ${panelOpen ? 'up' : 'down'}`}
              onClick={toggleOpen}
            />
            : null
        }
        <Segment
            className={classes}
            inverted={inverted}
            secondary
            style={{
              background: backgroundColor
            }}
            color={color || null}
        >
          {props.children}
        </Segment>
      </div>
    )
  }

  export default Revealer