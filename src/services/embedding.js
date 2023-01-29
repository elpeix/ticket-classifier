import config from '../config.json'

const EMBED_URL = 'https://api.cohere.ai/embed'

export async function embed(texts) {
  if (!config.token) {
    throw new Error('No token found. Please set the COHERE_TOKEN.')
  }
  if (!texts) {
    throw new Error('No texts found. Please provide texts.')
  }

  const data = {
    texts: texts,
    truncate: 'END'
  }

  const response = await fetch(EMBED_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const json = await response.json()
  return json.embeddings
}