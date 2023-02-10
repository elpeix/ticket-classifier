export default class TaskSelector {
  constructor(tasks) {
    this.tasks = tasks
  }

  selectNext = (c) => {
    if (!this.tasks.length) {
      return
    }
    const index = this.tasks.findIndex(task => task.selected)
    if (index === -1) {
      this.select(this.tasks[0].id, c)
    } else {
      this.select(this.tasks[(index + 1) % this.tasks.length].id, c)
    }
  }

  selectPrevious = (c) => {
    if (!this.tasks.length) {
      return
    }
    const index = this.tasks.findIndex(task => task.selected)
    if (index === -1) {
      this.select(this.tasks[0].id, c)
    } else {
      this.select(this.tasks[(index - 1 + this.tasks.length) % this.tasks.length].id, c)
    }
  }

  selectFirst = (c) => {
    if (!this.tasks.length) {
      return
    }
    this.select(this.tasks[0].id, c)
  }

  selectLast = (c) => {
    if (!this.tasks.length) {
      return
    }
    this.select(this.tasks[this.tasks.length - 1].id, c)
  }

  select = (id, c) => {
    c && c(this.tasks.find(task => task.id === id))
  }
}