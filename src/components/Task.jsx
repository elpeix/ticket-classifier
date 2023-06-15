import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/Task.module.css'
import Tag from './Tag'
import { TasksContext } from './TasksProvider'

export default function Task({ task, tags }) {

  const offset = 100

  const tasks = useContext(TasksContext)
  const [name, setName] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [blurPrevent, setBlurPrevent] = useState(false)
  const taskRef = useRef()
  const taskEditRef = useRef()

  useEffect(() => {
    setName(task.name)
  }, [task, tasks])

  useEffect(() => {
    if (tasks.editing && !editMode && tasks.editing && tasks.editing.id === task.id) {
      setEditMode(true)
    }
    if (editMode) {
      taskEditRef.current.focus()
    }
    if (task.selected || (tasks.lastAdded && tasks.lastAdded.id === task.id)) {
      if (taskRef.current.offsetTop < window.scrollY + offset) {
        taskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (taskRef.current.offsetTop > window.scrollY + window.innerHeight - offset) {
        taskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [editMode, task, tasks])

  const bigEdit = tags.length > 3 ? styles.bigEdit : ''

  const handleTaskChange = (e) => {
    setName(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      saveTask()
    }
    if (e.key === 'Escape') {
      setName(task.name)
      tasks.setEditing(false)
      tasks.selection.select(task.id)
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
    tasks.setEditing(false)
    tasks.selection.select(task.id)
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
    <li 
      ref={taskRef}
      className={`${task.completed && styles.completed} ${editMode && bigEdit} ${task.selected && styles.selected}`}
      onClick={() => tasks.selection.select(task.id)}
    >
      { !(editMode && bigEdit) && (
        <div className={styles.checkboxDiv}>
          <input 
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onClick={() => tasks.toggleTask(task.id)}
            title='Mark as completed (Enter)'
            readOnly
          />
        </div>
      )}
      <div className={`${styles.task} ${editMode ? styles.editMode : ''}`}>
        {editMode && (
          <input
            ref={taskEditRef}
            type="text"
            className={styles.name}
            value={name}
            onChange={handleTaskChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            onFocus={() => tasks.setEditing(true)}
            autoFocus
          />
        )}
        {!editMode && (
          <div 
            className={styles.name}
            onDoubleClick={() => setEditMode(true)}
          >
            <span>{task.name}</span>
            <span 
              className={styles.editIcon}
              onClick={() => setEditMode(true)}
              title="Edit (Space)" />
          </div>
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
        onClick={() => tasks.removeTask(task.id)}
        title="Delete (del)">✕</button>
    </li>
  )
}