import config from '../config.json'

const CLASSIFY_URL = 'https://api.cohere.ai/classify'

export async function classify(input, examples) {
  if (!config.token) {
    throw new Error('No token found. Please set the COHERE_TOKEN.')
  }
  if (!input) {
    throw new Error('No input found. Please provide an input.')
  }
  if (!examples) {
    throw new Error('No examples found. Please provide examples.')
  }
  if (examples.length < 3) {
    throw new Error('Not enough examples found. Please provide at least 3 examples.')
  }
  const data = {
    inputs: [input],
    examples,
    truncate: 'END'
  }
  const response = await fetch(CLASSIFY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const json = await response.json()
  const classification = json.classifications[0]
  if (classification.confidence < 0.4) {
    throw new Error('Confidence too low. Please provide more examples.')
  }
  return classification.prediction
}

/*
 Response Example {
  "id":"16394f04-0bf8-428a-991f-f2ef939fc92a",
  "classifications":[
    {
      "id":"de35a949-ac32-48b8-9cbe-bf598ce99ca9",
      "input":"List all tags",
      "prediction":"feature",
      "confidence":0.6000413,
      "confidences":[
        {"option":"feature","confidence":0.6000413},
        {"option":"bug","confidence":0.39995873}
      ],
      "labels":{
        "bug":{"confidence":0.39995873},
        "feature":{"confidence":0.6000413}
      }
    }
  ]
}
*/