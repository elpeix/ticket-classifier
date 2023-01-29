import React, { useContext, useState } from 'react'
import { generate } from '../services/generate'
import styles from '../styles/ExampleGenerator.module.css'
import { TasksContext } from './TasksProvider'

export default function ExampleGenerator() {

  const tasks = useContext(TasksContext)

  const [topic, setTopic] = useState(tasks.topic)
  const [topicError, setTopicError] = useState(false)
  const [examples, setExamples] = useState(tasks.sampleTasks)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canCancel = !tasks.examplesAreEmpty()

  const handleTopic = (e) => {
    setTopic(e.target.value)
    setTopicError(false)
  }

  const generateExamples = async () => {
    if (topic === '') {
      setTopicError(true)
      return
    }
    setLoading(true)
    try {
      const generatedExamples = await generate(topic, [])
      setExamples(examples.concat(generatedExamples))
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addExample = () => {
    setExamples([...examples, {
      tag: '',
      name: ''
    }])
  }

  const removeExample = (index) => {
    const newExamples = [...examples]
    newExamples.splice(index, 1)
    setExamples(newExamples)
  }

  const save = () => {
    if (topic === '') {
      setTopicError(true)
      return
    }
    if (examples.length < 2) {
      setError('You must provide examples')
      return
    }
    tasks.saveTopic(topic)
    tasks.saveSampleTasks(examples)
  }

  return (
    <div>
      <h2>Configuration</h2>
      <p>Define topic of your todo list and generate examples.</p>
      <section>
        <label>
          <h3>Topic</h3>
          <input 
            type='text'
            className={`${styles.topic} ${topicError ? styles.error : ''}`}
            placeholder='Write a topic'
            value={topic}
            onChange={handleTopic}
          />
        </label>
      </section>
      <section className={styles.examples}>
        <h3>Examples</h3>
        <p>
          You must provide at least two examples for each tag.
        </p>

        <div>
          <button onClick={generateExamples} disabled={loading} className={styles.generateExample}>
            {loading && <span>Loading...</span>}
            {!loading && <span>Generate examples automatically</span>}
          </button>
          {error && <span>{error}</span>}
        </div>

        <ul className={styles.examplesList}>
          {examples.map((example, index) => (
            <li key={index}>
              <input 
                type='text' 
                className={styles.name}
                value={example.name}
                placeholder='Task name'
                onChange={(e) => {
                  const newExamples = [...examples]
                  newExamples[index].name = e.target.value
                  setExamples(newExamples)
                }}
              />
              <input 
                type='text' 
                className={styles.tag}
                value={example.tag}
                placeholder='tag-name'
                onChange={(e) => {
                  const newExamples = [...examples]
                  newExamples[index].tag = e.target.value
                  setExamples(newExamples)
                }}
              />
              <button className='remove' onClick={() => removeExample(index)}>✕</button>
            </li>
          ))}
        </ul>
        or {' '}
        <button onClick={addExample} className={styles.addExample}>
          Add example manually
        </button>
      </section>
      <section>
        <button onClick={save} className={styles.save}>
          Save
        </button>

        {canCancel && (
          <button 
            onClick={() => tasks.setConfigurationMode(false)}
            className='simpleButton'
          >
            Cancel
          </button>
        )}
      </section>
    </div>
  )
}