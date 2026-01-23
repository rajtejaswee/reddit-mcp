# Contributing to Reddit MCP

First off, thanks for taking the time to contribute! 🎉

We welcome contributions from the community. Whether it's a bug fix, new feature, or documentation improvement, we'd love to see it.

## 🛠️ How to Run Locally

Prerequisites: Node.js 18+ and Docker (for Redis).

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/rajtejaswee/reddit-mcp.git](https://github.com/rajtejaswee/reddit-mcp.git)
    cd reddit-mcp
    ```

2.  **Start Infrastructure**
    We use Docker Compose to run Redis locally.
    ```bash
    docker-compose up -d
    ```

3.  **Backend Setup**
    ```bash
    # Install dependencies
    npm install
    
    # Run in development mode (with hot-reload)
    npm run dev
    ```

4.  **Frontend Setup**
    Open a new terminal:
    ```bash
    cd web
    npm install
    npm run dev
    ```
    The UI will be available at http://localhost:3001.

## 📏 Coding Standards

* **Logs:** Use the `logger` utility from `src/utils/logger.ts`. Do not use `console.log`.
* **Commits:** Please use Conventional Commits (e.g., `feat: add caching`, `fix: search bug`).
* **Linting:** Ensure your code passes the build process (`npm run build`) before pushing.

## 🐛 Found a Bug?

Please check the **Issues** tab on GitHub to see if it has already been reported. If not, create a new issue using the provided template.