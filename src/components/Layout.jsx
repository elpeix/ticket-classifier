import React from 'react'

export default function Layout({ children }) {
  return (
    <>
      <header>
        <h1>Todo List</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>
          {new Date().getFullYear()} {' - '}
          <a href="https://github.com/elpeix" target="_blank" rel="noreferrer">
            elPeix
          </a>
        </p>
      </footer>
    </>
  )
}