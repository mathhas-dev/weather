import React from 'react'
import {
  Button,
  Grid,
  Header,
  Icon
} from 'semantic-ui-react'
import { useHistory } from "react-router-dom"

import './CardButton.less'

const CardButton = props => {
  const {
    darker,
    disabled,
    icon,
    iconScale,
    onClick,
    selected,
    small,
    subtitle,
    title,
    to
  } = props
  const history = useHistory()

  const callback = onClick
    ? onClick
    : to
      ? () => history.push(to)
      : () => {}

  const ButtonIcon = (icon && typeof icon !== 'string')
    ? <div className='important card-button__icon'
      style={{
        transform: iconScale ? `scale(${iconScale})` : null,
        marginLeft: -5
      }}
    >
      {icon}
    </div>
    : <Icon
      className='important card-button__icon'
      style={{
        transform: iconScale ? `scale(${iconScale})` : null,
      }}
      size='big'
      name={icon || 'question'}
    />
  
  const buttonClassName = 'card-button ' +
    (small ? 'small ' : '') +
    (darker ? 'darker ' : '') +
    (selected ? 'selected ' : '') +
    (disabled ? 'disabled' : '')

  return (
    <Button
      className={buttonClassName}
      basic
      onClick={callback}
    >
      <div className='card-button__icon-wrapper'>
        { ButtonIcon }
      </div>
      <div className='card-button__header-wrapper'>
        <Header className='card-button__titulo'>
          {title || 'Inserir título'}
        </Header>
        { subtitle
          ? <Header.Subheader className='card-button__subtitulo'>
            { subtitle }
          </Header.Subheader>
          : null
        }
      </div>
    </Button>
  )
}

CardButton.Grid = props => {
  const { width } = props
  const parentWidth = width || props['data-inner-width']
  const columnCount = parentWidth > 900 ? 2 : 1
  const gridWidth = parentWidth > 900 ? 1000 : 500

  return (
    <Grid
      className='class-button__grid'
      columns={columnCount}
      style={{
        maxWidth: gridWidth
      }}
    >
      {props.children?.map((button, idx) =>
        <Grid.Column key={idx}>
          {button}
        </Grid.Column>      
      )}
    </Grid>
  )
}

export default CardButton