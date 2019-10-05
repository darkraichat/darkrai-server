import React from 'react'

export default props => {
  return (
    <span
      style={{
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        color: '#282c34',
      }}
    >
      <p>{props.content}</p>
      <span style={{ float: 'left' }}>{props.by}</span>
    </span>
  )
}
