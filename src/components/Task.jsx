import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Task.module.css'
import Tag from './Tag'
import { TasksContext } from './TasksProvider'

export default function Task({ task }) {

  const tasks = useContext(TasksContext)
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [blurPrevent, setBlurPrevent] = useState(false)

  useEffect(() => {
    setName(task.name)
    setTags(tasks.getTags())
  }, [task, tasks])

  const handleTaskChange = (e) => {
    setName(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      saveTask()
    }
    if (e.key === 'Escape') {
      setName(task.name)
      setEditMode(false)
    }
  }

  const saveTask = () => {
    if (name === '') {
      tasks.removeTask(task.id)
    } else if (name !== task.name) {
      try {
        tasks.updateTask(task.id, { name })
      } catch (error) {
        console.log(error)
        setName(task.name)
      }
    }
    setEditMode(false)
  }

  const handleBlur = () => {
    setBlurPrevent(setTimeout(() => saveTask(), 200))
  }

  const saveTag = (tag) => {
    const updateTask = {...task}
    if (blurPrevent) {
      clearTimeout(blurPrevent)
      updateTask.name = name
    }
    updateTask.tag = tag
    tasks.updateTask(task.id, updateTask)
    setEditMode(false)
  }

  return (
    <li className={`${task.completed ? styles.completed : ''}`}>
      <div className={`${styles.task}`}>
        <div className={styles.checkboxDiv}>
          <input 
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onClick={() => tasks.toggleTask(task.id)}
            readOnly
          />
        </div>
        {editMode && (
          <input
            type="text"
            className={styles.name}
            value={name}
            onChange={handleTaskChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            autoFocus
          />
        )}
        {!editMode && (
          <span 
            className={styles.name}
            onDoubleClick={() => setEditMode(true)}
          >
            {task.name}
          </span>
        )}
        {editMode && (
          <div className={styles.tags}>
            {tags.map(tag => (
              <Tag 
                tag={tag}
                key={tag} 
                isActive={task.tag === tag} 
                onClick={() => saveTag(tag)}
              />
            ))}
          </div>
        )}
        {!editMode && <Tag tag={task.tag} onClick={() => tasks.filter.filterByTag(task.tag)} />}
      </div>
      <button
        className='remove'
        onClick={() => tasks.removeTask(task.id)}>✕</button>
    </li>
  )
}