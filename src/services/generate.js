import config from '../config.json'

const GENERATE_URL = 'https://api.cohere.ai/generate'

export async function generate(topic, tags) {

  if (!config.token) {
    throw new Error('No token found. Please set the COHERE_TOKEN.')
  }
  if (!topic) {
    throw new Error('No topic found. Please provide a topic.')
  }
  if (tags && !Array.isArray(tags)) {
    throw new Error('Tags must be an array.')
  }

  let prompt = `With provided topic, generate, at leat, two tasks for each tag:
--
With topic: Software development and tags: feature, bug
feature: List all tags on a page
feature: Create new container

bug: Fix bug with login
bug: Fix css issue
--
With topic: ${topic}`
  if (tags.length > 0) {
    prompt += `
 and tags: ${tags.join(', ')}`
  }

  console.log(prompt)

  const data = {
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.1,
    k: 0,
    p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
    stop_sequences: ['--'],
    return_likelihoods: 'NONE'
  }

  const response = await fetch(GENERATE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const json = await response.json()
  const text = json.text
  console.log(text)
  let rawTasks = text.split('\n')
  rawTasks = rawTasks.filter(task => task.length > 0)
  if (rawTasks.length == 0) {
    throw new Error('Not enough tasks found. Please, try again.')
  }
  const tasks = rawTasks
    .map(task => {
      let [tag, name] = task.split(': ')
      if (!tag || !name) {
        return null
      }
      tag = tag.trim()
      name = name.trim()
      if (tag.split(' ').length > 1) {
        tag = tag.split(' ')[1]
        tag = tag.trim()
      }
      if (tag === 'tags') {
        return null
      }
      return { tag, name }
    })
    .filter(task => task != null)
  if (tasks.length == 0) {
    throw new Error('Not enough tasks found. Please, try again.')
  }
  return tasks
}

// Test
// const topic = 'Marketing'
// const tags = ['campaign', 'advertising', 'sales']

// generate(topic, tags).then(console.log)