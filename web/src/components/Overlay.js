import React from 'react'

const Overlay = props => {
    const { active, onClick } = props

    const basicStyle = {
        background: 'hsla(127, 0%, 0%, 0%)',
        pointerEvents: 'none',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        transition: 'backdropFilter 400ms, background 400ms',
      }
    const activeStyle = {
        backdropFilter: 'blur(2px) grayscale(40%)',
        background: 'hsla(127, 0%, 0%,60%)',
        pointerEvents: 'auto'
    }

    return (
      <div
        onClick={onClick}
        style={{
            ...basicStyle,
            ...(active ? activeStyle : {})
        }}
      />
    )
  }

  export default Overlay