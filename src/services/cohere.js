import config from '../config.json'

const CLASSIFY_URL = 'https://api.cohere.ai/classify'
const GENERATE_URL = 'https://api.cohere.ai/generate'
const EMBED_URL = 'https://api.cohere.ai/embed'

export async function classify({token, input, examples}) {
  token = getToken(token)

  if (!input) {
    throw new Error('No input found. Please provide an input.')
  }
  if (!examples) {
    throw new Error('No examples found. Please provide examples.')
  }
  if (examples.length < 3) {
    throw new Error('Not enough examples found. Please provide at least 3 examples.')
  }
  const response = await cohereFetch(CLASSIFY_URL, token, {
    inputs: [input],
    examples,
    truncate: 'END'
  })
  const classification = response.classifications[0]
  if (classification.confidence < 0.4) {
    throw new Error('Confidence too low. Please provide more examples.')
  }
  return classification.prediction
}

export async function generate({token, topic, tags}) {
  token = getToken(token)

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

  const response = await cohereFetch(GENERATE_URL, token, {
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.1,
    k: 0,
    p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
    stop_sequences: ['--'],
    return_likelihoods: 'NONE'
  })

  const text = response.text

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

export async function embed({token, texts}) {
  token = getToken(token)

  if (!config.token) {
    throw new Error('No token found. Please set the COHERE_TOKEN.')
  }
  if (!texts) {
    throw new Error('No texts found. Please provide texts.')
  }

  const response = await cohereFetch(EMBED_URL, token, {
    texts: texts,
    truncate: 'END'
  })

  return response.embeddings
}

function getToken(token) {
  if (!token) {
    token = config.token
    if (!token) {
      throw new Error('No token found. Please set the COHERE_TOKEN.')
    }
  }
  return token
}

async function cohereFetch(url, token, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}
