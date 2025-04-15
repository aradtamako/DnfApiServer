import { describe, it, expect, expectTypeOf } from 'vitest'
import { buildCallbackObject, buildRequestUrl, Parameters } from './util'

describe('buildRequestUrl', () => {
  const apiKey = 'API_KEY'
  const characterName = 'CHARACTER_NAME'

  it('should build request url', async () => {
    const parameters: Parameters = {
      apiKey: apiKey,
      characterName: characterName
    }

    const url = buildRequestUrl('https://example.com/search', parameters)
    expect(url).toEqual(`https://example.com/search?apiKey=${apiKey}&characterName=${characterName}`)
  })

  it('should remove undefined entry', async () => {
    const parameters: Parameters = {
      apiKey: apiKey,
      characterName: characterName,
      dummy: undefined
    }

    const url = buildRequestUrl('https://example.com/search', parameters)
    expect(url).toEqual(`https://example.com/search?apiKey=${apiKey}&characterName=${characterName}`)
  })
})

describe('buildCallbackObject', () => {
  it('should build callback object', async () => {
    const text = 'hello world'
    const expectedCallbackObject = {
      content: [
        {
          type: 'text',
          text: text
        }
      ]
    }
    const result = buildCallbackObject(text)
    expect(result).toEqual(expectedCallbackObject)
  })
})
