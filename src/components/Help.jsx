import React from 'react'
import styles from '../styles/Help.module.css'

export default function Help({ show, onClose }) {
  if (!show) {
    return null
  }

  const handleClick = (event) => {
    event.stopPropagation()
    onClose()
  }

  return (
    <div className={styles.help} onClick={handleClick}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className={styles.close} onClick={handleClick}>
          ✕
        </div>
        <h2>How to use this app</h2>
        <p>
          This app is a simple task manager. You can add, edit, remove, complete and filter tasks.
        </p>
        <p>You can use the keyboard to navigate and manage the tasks.</p>
        <div className={styles.spacer} />
        <h3>Keyboard shortcuts</h3>
        <ul>
          <li>
            <strong>Alt + ,</strong> to open the configuration panel
          </li>
          <li>
            <strong>Esc</strong> to close the configuration panel or to clear the filter
          </li>
          <li>
            <strong>Arrow up</strong> or <strong>k</strong> to select the previous task
          </li>
          <li>
            <strong>Arrow down</strong> or <strong>j</strong> to select the next task
          </li>
          <li>
            <strong>Arrow left</strong> or <strong>Page up</strong> to select the first task
          </li>
          <li>
            <strong>Arrow right</strong> or <strong>Page down</strong> to select the last task
          </li>
          <li>
            <strong>Enter</strong> or <strong>x</strong> to complete the selected task
          </li>
          <li>
            <strong>Space</strong> or <strong>c</strong> to edit the selected task
          </li>
          <li>
            <strong>Delete</strong> or <strong>d</strong> to remove the selected task
          </li>
          <li>
            <strong>a</strong> to add a new task
          </li>
          <li>
            <strong>f</strong> or <strong>/</strong> to search tasks
          </li>
          <li>
            <strong>Shift + a</strong> to filter all tasks
          </li>
          <li>
            <strong>Shift + p</strong> to filter pending tasks
          </li>
          <li>
            <strong>Shift + c</strong> to filter completed tasks
          </li>
        </ul>
      </div>
    </div>
  )
}
