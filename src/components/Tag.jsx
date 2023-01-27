import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/Tag.module.css'

export default function Tag({ tag, index }) {

  const tasks = useContext(TasksContext)

  const isActive = tasks.filter.tag === tag

  return (
    <span 
      className={`${styles.tag}` + (isActive ? ` ${styles.active}` : '')}
      key={index} 
      onClick={() => tasks.filter.filterByTag(tag)}
    >
      {tag}
    </span>
  )
}