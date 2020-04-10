import React from 'react'
import { useParams } from 'react-router-dom'

const Block = () => {
  const { height } = useParams()

  return (
    <div>
      {height}
    </div>
  )
}

export default Block
