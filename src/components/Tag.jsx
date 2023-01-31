import React from 'react'
import styles from '../styles/Tag.module.css'

export default function Tag({ tag, onClick, isActive }) {

  return (
    <>
      { typeof tag === 'string' && tag && tag.length > 0 && (
        <span 
          className={`${styles.tag}` + (isActive ? ` ${styles.active}` : '')}
          onClick={onClick}
        >
          {tag}
        </span>
      )}
    </>
  )
}