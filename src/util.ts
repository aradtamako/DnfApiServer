import { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export interface Parameters {
  [key: string]: any
}

export function buildRequestUrl(endpoint: string, parameters: Parameters): string {
  const filteredParameters = Object.fromEntries(
    Object.entries(parameters)
      .filter(([_, value]) => value !== undefined)
  )

  const urlSearchParam = new URLSearchParams(filteredParameters)
  const url = `${endpoint}?${urlSearchParam.toString()}`

  return url
}

export function buildCallbackObject(text: string): CallToolResult {
  const callbackObject: CallToolResult = {
    content: [
      {
        type: 'text',
        text: text
      }
    ]
  }

  return callbackObject
}
