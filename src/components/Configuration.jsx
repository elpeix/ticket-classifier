import React, { useContext, useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import { generate } from '../services/cohere'
import styles from '../styles/Configuration.module.css'
import ConfigurationArchivedTasks from './ConfigurationArchivedTasks'
import { AppContext } from './TaskApp'
import { TasksContext } from './TasksProvider'

export default function Configuration() {

  const { token, setToken } = useContext(AppContext)
  const tasks = useContext(TasksContext)
  
  const [tokenValue, setTokenValue] = useState(token)
  const debouncedValue = useDebounce(tokenValue, 500)

  useEffect(() => {
    if (debouncedValue !== '' && debouncedValue !== token) {
      setToken(debouncedValue)
    }
  }, [debouncedValue, setToken, token])

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

  const handleToken = (e) => {
    setTokenValue(e.target.value)
  }

  const generateExamples = async () => {
    if (topic === '') {
      setTopicError(true)
      return
    }
    setLoading(true)
    try {
      const generatedExamples = await generate({ token, topic, tags: [] })
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
    if (tokenValue !== '') {
      setToken(tokenValue)
    }
    if (topic === '') {
      setTopicError(true)
      return
    }
    // if (examples.length < 2) {
    //   setError('You must provide examples')
    //   return
    // }
    tasks.saveTopic(topic)
    tasks.saveSampleTasks(examples)
  }

  return (
    <div>
      <h2>Configuration</h2>
      <section className={styles.section}>
        <label>
          <h3>Cohere Api Key</h3>
          <p>
            We provide a free api key for you to try out our service but it is limited to 100 requests per minute.
          </p>
          <p>
            Or you can get your own api key at
            {' '}
            <a href='https://cohere.ai' target='_blank' rel='noopener noreferrer'>
              Cohere.ai
            </a>.
          </p>
          <input
            type='text'
            className={styles.apiKey}
            placeholder='Your api key'
            value={tokenValue}
            onChange={handleToken}
          />
        </label>
      </section>
      <section className={styles.section}>
        <label>
          <h3>Topic</h3>
          <p>Define topic of your todo list.</p>
          <input 
            type='text'
            className={`${styles.topic} ${topicError ? styles.error : ''}`}
            placeholder='Write a topic'
            value={topic}
            onChange={handleTopic}
          />
        </label>
      </section>
      <section className={`${styles.examples} ${styles.section}`}>
        <h3>Examples</h3>
        <p>
          If you provide examples, Cohere will be able to classify your tasks better.
        </p>

        <div>
          <button onClick={generateExamples} disabled={loading} className={styles.generateExample}>
            {loading && <span className={styles.loading}>Loading...</span>}
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
              <button 
                className={`remove ${styles.remove}`}
                disabled={loading}
                onClick={() => removeExample(index)}>
                  ✕
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.manageExamples}>
          <div>
            or {' '}
            <button onClick={addExample} disabled={loading} className={styles.addExample}>
              Add example manually
            </button>
          </div>
          { examples.length > 0 && (
            <div>
              <button onClick={() => setExamples([])} disabled={loading} className='simpleButton'>
                Clear examples
              </button>
            </div>
          )}
        </div>
      </section>

      { tasks.archivedTasks.length > 0 && (
        <section className={styles.section}>
          <ConfigurationArchivedTasks />
        </section>
      )}
      <section className={styles.section}>
        <button onClick={save} className={styles.save}>Save</button>

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