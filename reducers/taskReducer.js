
const TasksReducer = (state, action) => {
  switch (action.type) {
  case 'ADD_TASK': {
    const newState = [...state, action.payload]
    saveTasks(newState)
    return newState
  }
  case 'REMOVE_TASK': {
    const newState = state.filter((task, index) => index !== action.payload)
    saveTasks(newState)
    return newState
  } 
  case 'TOGGLE_TASK': {
    const newState = state.map((task, index) => {
      if (index === action.payload) {
        return {
          ...task,
          completed: !task.completed
        }
      }
      return task
    })
    saveTasks(newState)
    return newState
  }
  case 'CLEAN_COMPLETED_TASKS': {
    const newState = state.filter(task => !task.completed)
    saveTasks(newState)
    return newState
  }
  default:
    return state
  }
}

const saveTasks = (newTasks) => {
  // TODO Asynchronously save tasks to localStorage
  localStorage.setItem('tasks', JSON.stringify(newTasks))
}

export default TasksReducer