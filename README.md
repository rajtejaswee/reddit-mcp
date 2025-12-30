# Reddit MCP Server 🤖

A robust **Model Context Protocol (MCP)** server that bridges **Claude AI** with Reddit.
This tool allows AI agents to search Reddit, fetch live discussions, and recursively parse nested comment threads, all while handling rate limits via an intelligent caching layer.

> **Why this exists:** To give LLMs "eyes" on real-time community discussions, moving beyond static training data to dynamic, ground-truth analysis.

---

## 🚀 Features

- **🔍 Advanced Search:** Query Reddit globally to find relevant threads across all subreddits.
- **🧵 Recursive Thread Parsing:** Converts deeply nested Reddit comment trees into clean, indented text structures that LLMs can understand.
- **⚡ Smart Caching:** Implemented an in-memory TTL (Time-To-Live) cache to:
  - Reduce API latency from ~2s to **<5ms** on repeat requests.
  - Prevent hitting Reddit's strict API rate limits.
- **🛡️ Type-Safe Architecture:** Built with **TypeScript** and **Zod** for runtime validation, ensuring no malformed data crashes the server.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js & TypeScript
- **Protocol:** [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) via `stdio`
- **Validation:** Zod (Schema Validation)
- **Networking:** Axios (with custom User-Agent handling)
- **Architecture:** Service-Repository Pattern

---

## 📦 Installation & Setup

### 1. Clone & Install
```bash
git clone [https://github.com/yourusername/reddit-mcp.git](https://github.com/yourusername/reddit-mcp.git)
cd reddit-mcp
npm install
```

## 🔨 Build the Project

Transpile the TypeScript source into a production-ready JavaScript bundle.

```bash
npm run build
```

> **Output:** Compiled files will be available in the `/dist` folder.

---

## 🔌 Connecting to Claude

To use this with the **Claude Desktop App**, you need to configure the MCP settings.

### 1. Open Your Config File

**Location:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

### 2. Add Configuration

Add the following configuration to your config file:

> ⚠️ **Important:** Update `/ABSOLUTE/PATH/TO/` with your actual project path.

```json
{
  "mcpServers": {
    "reddit-mcp": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/reddit-mcp/dist/index.js"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

After saving the config file, restart Claude Desktop. You should see a **🔌 icon** indicating the tool is successfully connected.

---

## 💡 Usage Examples

Once connected, you can ask Claude complex questions that require live Reddit data:

### 1. **Market Research**
```
"Search Reddit for complaints about the M4 Macbook battery. 
Read the comments on the top post and summarize if it's a 
hardware issue or software bug."
```

### 2. **Sentiment Analysis**
```
"What are people in r/reactjs saying about the new React Compiler? 
Is the sentiment mostly positive or skeptical?"
```

### 3. **Debugging Help**
```
"Find the most recent threads about 'Next.js App Router caching issues' 
and tell me the solutions users are suggesting."
```

---

## 🏗️ Technical Highlights (Architecture)

### 1. **The Recursive Parser** (`src/utils/parseComments.ts`)

Reddit comments form a deeply nested tree structure (Replies → Replies → Replies). I implemented a **Depth-First Search (DFS)** recursive algorithm to flatten this tree into a human-readable format, handling edge cases where the API returns empty strings instead of objects.

### 2. **In-Memory Caching** (`src/services/reddit.ts`)

To optimize performance, I built a `Map<string, CacheEntry>` caching system.

**Logic:**
- Intercepts every API call
- Checks if data exists and is younger than 5 minutes (TTL)
- Returns cached data if valid

**Result:** Drastic reduction in external network calls and improved responsiveness.

```typescript
// Simplified Logic
if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data; // Instant return
}
```

---

## 📂 Project Structure

```
src/
├── index.ts              # Entry point (The "Waiter" - MCP Server)
├── types.ts              # TypeScript Interfaces (The "Menu")
├── services/
│   └── reddit.ts         # Business Logic & Caching (The "Kitchen")
└── utils/
    └── parseComments.ts  # Recursive Tree Parser
```

### Architecture Overview

- **`index.ts`**: MCP server entry point that handles Claude's requests
- **`types.ts`**: TypeScript type definitions and interfaces
- **`services/reddit.ts`**: Core business logic with in-memory caching
- **`utils/parseComments.ts`**: DFS algorithm for parsing nested comment trees

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ for the Claude AI community**

⭐ Star this repo if you find it useful!

</div>