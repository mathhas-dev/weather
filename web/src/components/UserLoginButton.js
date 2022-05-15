import React from 'react'
import {
    Button,
    Icon,
} from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { userStore } from 'stores'

const UserLoginButton = observer(props => {
    const { onClick } = props
    const { logged } = userStore

    const bgColor = logged
      ? 'yellow'
      : 'violet'
    const frColor = logged
      ? 'blue'
      : 'teal'
    const icon = logged
      ? 'circle user outline'
      : 'circle user'
  
    return (
      <Button
        className='main-page__user-button'
        color={bgColor}
        onClick={onClick}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Icon
            color={frColor}
            name={icon}
            size='large'
            style={{ margin: 0 }}
          />
        </div>
      </Button>
    )
  })

  export default UserLoginButton