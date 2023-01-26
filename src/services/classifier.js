import config from '../config'

export async function classify(inputs, examples) {
  const prompt = 'Classify the following text:'
  const data = {
    prompt,
    inputs,
    examples,
  }
  const response = await fetch(config.classifyUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const json = await response.json()
  return json
}