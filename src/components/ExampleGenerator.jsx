import React, { useState } from 'react'
import { generate } from '../services/generate'

export default function ExampleGenerator() {

  const [topic, setTopic] = useState('')
  const [examples, setExamples] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const generateExamples = async () => {
    if (topic === '') {
      return
    }
    setLoading(true)
    try {
      const response = generate(topic, [])
      setExamples(response)
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Configuration</h2>
      <p>Define topic of your todo list and generate examples.</p>
      <div>
        <div>
          <label>
            <span>Topic: </span>
            <input 
              type='text'
              value={topic}
              onChange={(e) => {setTopic(e.target.value)}}
            />
          </label>
        </div>
        <button onClick={generateExamples}>Generate examples</button>
      </div>
      <ul>
        {examples.map((example, index) => (
          <li key={index}>
            <input type='checkbox' />
            <span>{example.tag}</span>
            <span>{example.taskName}</span>            
          </li>
        ))}
      </ul>
    </div>
  )
}