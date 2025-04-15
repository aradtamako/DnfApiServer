import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { server } from './mcp-server.js'

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
