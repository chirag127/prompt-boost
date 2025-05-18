# Prompt Enhancer MCP Server

A Model Context Protocol (MCP) server that enhances AI agent capabilities by augmenting prompts with additional context, examples, or specialized instructions.

## Overview

This MCP server provides tools for enhancing prompts to improve AI reasoning and response quality. It follows the Model Context Protocol specification and is compatible with Claude for Desktop and other MCP clients.

The server offers several enhancement strategies:

1. **Context Addition** - Adds relevant contextual information to prompts
2. **Example Injection** - Adds examples to help guide responses
3. **Instruction Refinement** - Enhances instructions for better reasoning
4. **Domain Knowledge** - Adds domain-specific information

## Installation

### Prerequisites

-   Node.js 16 or higher
-   npm or yarn

### Setup

1. Clone the repository:

    ```
    git clone https://github.com/chirag127/prompt-enhancer-mcp.git
    cd prompt-enhancer-mcp
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Build the project:
    ```
    npm run build
    ```

## Usage

### Starting the Server

To start the server:

```
npm start
```

### Testing

To run the tests:

```
npm test
```

To run the tests with coverage:

```
npm run test:coverage
```

To run the tests in watch mode:

```
npm run test:watch
```

### Configuration

You can configure the server by creating a `config.json` file in the root directory or by setting the `CONFIG_PATH` environment variable to point to a configuration file.

Example configuration:

```json
{
    "logLevel": "info",
    "enabledEnhancers": ["context", "instruction"]
}
```

Configuration options:

-   `logLevel`: The logging level (error, warn, info, debug)
-   `enabledEnhancers`: Array of enhancer names to enable (if empty, all enhancers are enabled)

### Integrating with Claude for Desktop

To use this server with Claude for Desktop:

1. Make sure you have Claude for Desktop installed
2. Open the Claude for Desktop configuration file at:

    - Windows: `%AppData%\Claude\claude_desktop_config.json`
    - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

3. Add the server configuration:

```json
{
    "mcpServers": {
        "prompt-enhancer": {
            "command": "node",
            "args": [
                "C:\\absolute\\path\\to\\prompt-enhancer-mcp\\dist\\index.js"
            ]
        }
    }
}
```

Replace `C:\\absolute\\path\\to` with the actual path to your server.

4. Restart Claude for Desktop

## Available Tools

### enhance-prompt

Enhances a prompt by adding context, examples, or specialized instructions.

Parameters:

-   `prompt` (string): The original prompt to enhance
-   `strategy` (string): The enhancement strategy to use (context, example, instruction, domain-knowledge)
-   `options` (object, optional): Strategy-specific options

Example usage in Claude:

```
I need to enhance this prompt: "Explain quantum computing" using the context strategy.
```

### list-enhancers

Lists all available prompt enhancement strategies.

Example usage in Claude:

```
What enhancement strategies are available in the prompt enhancer?
```

## Enhancement Strategies

### Context

Adds relevant contextual information to prompts.

Options:

-   `contextType`: "general" | "technical" | "creative" | "analytical" (default: "general")
-   `depth`: "minimal" | "moderate" | "extensive" (default: "moderate")
-   `includeDefinitions`: boolean (default: true)
-   `includeBackground`: boolean (default: true)

### Example

Adds examples to help guide responses.

Options:

-   `exampleCount`: number (default: 2)
-   `exampleType`: "simple" | "detailed" | "diverse" (default: "simple")
-   `position`: "before" | "after" (default: "before")

### Instruction

Enhances instructions for better reasoning and clarity.

Options:

-   `instructionType`: "clarity" | "reasoning" | "structure" | "comprehensive" (default: "clarity")
-   `addStepByStep`: boolean (default: true)
-   `addReasoning`: boolean (default: true)

### Domain Knowledge

Adds domain-specific information to prompts.

Options:

-   `domain`: string (required)
-   `depth`: "basic" | "intermediate" | "advanced" (default: "intermediate")
-   `includeTerminology`: boolean (default: true)
-   `includePrinciples`: boolean (default: true)

## License

MIT

## Author

Chirag Singhal (@chirag127)
