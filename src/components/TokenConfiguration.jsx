import React, { useContext, useState } from 'react'
import { AppContext } from '../App'

export default function TokenConfiguration () {

  const { token, setToken } = useContext(AppContext)
  const [tokenValue, setTokenValue] = useState(token)

  return (
    <div>
      <input
        type='text'
        placeholder='Enter token'
        onChange={(e) => setTokenValue(e.target.value)}
        value={tokenValue}
      />
      <button
        onClick={() => setToken(tokenValue)}
      >
        Save
      </button>
    </div>
  )
}