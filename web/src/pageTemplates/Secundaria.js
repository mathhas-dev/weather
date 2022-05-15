import React, { useEffect } from 'react'
import './Secundaria.css'

const Secundaria = props => {
  const { title } = props
  
  useEffect(() => {
    if (title)
      document.title = title
  })

  return (
    <div className='page-secundaria'>
      {props.children}
    </div>
  )
}

export default Secundaria