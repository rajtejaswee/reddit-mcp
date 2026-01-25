# @rajtejaswee/reddit-mcp

A Model Context Protocol (MCP) server that provides a privacy-first, structured interface to Reddit data. Designed for AI agents, automation tools, and backend services that need reliable access to Reddit content.

## Features

- 🔒 **Privacy-First**: Uses public Reddit endpoints, no authentication required
- 🚀 **Zero Configuration**: Works out of the box with sensible defaults
- 🤖 **MCP Compatible**: Seamlessly integrates with Claude Desktop and other MCP clients
- 🛠️ **Flexible**: Use as a standalone server or integrate into your project
- ⚡ **Fast**: Built with TypeScript and optimized for performance

## Installation

```bash
npm install @rajtejaswee/reddit-mcp
```

## Quick Start

### Option 1: Run Directly (Recommended)

No installation needed. Run instantly using npx:

```bash
npx @rajtejaswee/reddit-mcp
```

### Option 2: Integrate into Your Project

```javascript
// Import and use in your Node.js application
const { startServer } = require('@rajtejaswee/reddit-mcp');

startServer({
  port: 3000,
  userAgent: 'MyApp/1.0.0'
});
```

## Configuration

Create a `.env` file in your project root (optional):

```env
# Custom user agent (optional)
REDDIT_USER_AGENT=MyApp/1.0.0

# Server port (default: 3000)
PORT=3000
```

## API Reference

### Search Reddit

**Endpoint:** `GET /api/search`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `sort` | string | No | `relevance` | Sort order: `relevance`, `hot`, `top`, `new`, `comments` |
| `time` | string | No | `all` | Time filter: `hour`, `day`, `week`, `month`, `year`, `all` |
| `limit` | number | No | `25` | Number of results (1-100) |

**Example Request:**

```bash
curl "http://localhost:3000/api/search?q=typescript&sort=top&time=week&limit=10"
```

**Example Response:**

```json
{
  "posts": [
    {
      "id": "abc123",
      "title": "TypeScript 5.0 Released",
      "author": "username",
      "subreddit": "typescript",
      "score": 1234,
      "url": "https://reddit.com/r/typescript/comments/...",
      "created_utc": 1234567890,
      "num_comments": 56,
      "selftext": "Post content..."
    }
  ],
  "total": 100
}
```

### Health Check

**Endpoint:** `GET /health`

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-25T10:30:00.000Z"
}
```

## MCP Integration

### Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["@rajtejaswee/reddit-mcp"]
    }
  }
}
```

### Other MCP Clients

This server implements the Model Context Protocol specification and can be used with any MCP-compatible client.

## Use Cases

- 🤖 **AI Agents**: Enable Claude or other AI assistants to search and analyze Reddit content
- 📊 **Research**: Collect and analyze Reddit discussions for market research or sentiment analysis
- 🔍 **Monitoring**: Track mentions, trends, or discussions on specific topics
- 🛠️ **Automation**: Build bots and tools that need Reddit data without OAuth complexity

## Requirements

- Node.js 16.x or higher
- npm 7.x or higher

## Privacy & Rate Limiting

This package uses Reddit's public JSON endpoints and does not require authentication. However, please be mindful of Reddit's rate limits:

- Implement reasonable delays between requests
- Cache responses when appropriate
- Use the `User-Agent` header to identify your application

## Troubleshooting

### Port Already in Use

If port 3000 is already occupied, specify a different port:

```bash
PORT=8080 npx @rajtejaswee/reddit-mcp
```

### Network Issues

Ensure you have a stable internet connection. Reddit's API may occasionally be slow or unavailable.

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/rajtejaswee/reddit-mcp).

## License

MIT © [rajtejaswee]

## Links

- [GitHub Repository](https://github.com/rajtejaswee/reddit-mcp)
- [npm Package](https://www.npmjs.com/package/@rajtejaswee/reddit-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

**Made with ❤️ for the MCP community**