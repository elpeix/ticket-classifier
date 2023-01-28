import React, { useContext } from 'react'
import { TasksContext } from './TasksProvider'
import styles from '../styles/Tag.module.css'

export default function Tag({ tag }) {

  const tasks = useContext(TasksContext)

  const isActive = tasks.filter.tag === tag

  return (
    <>
      { typeof tag === 'string' && tag && tag.length > 0 && (
        <span 
          className={`${styles.tag}` + (isActive ? ` ${styles.active}` : '')}
          onClick={() => tasks.filter.filterByTag(tag)}
        >
          {tag}
        </span>
      )}
    </>
  )
}