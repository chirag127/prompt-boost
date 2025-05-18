// Mock implementation of the MCP SDK for testing

export class McpServer {
  private tools: Map<string, any> = new Map();
  
  constructor(options: { name: string; version: string }) {
    // Nothing to do
  }
  
  tool(name: string, description: string, paramSchema: any, handler: any) {
    this.tools.set(name, { name, description, paramSchema, handler });
    return this;
  }
  
  async connect(transport: any) {
    // Nothing to do
  }
  
  async handleRequest(message: any) {
    if (message.method === 'callTool') {
      const tool = this.tools.get(message.params.name);
      if (!tool) {
        return {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32000,
            message: `Tool not found: ${message.params.name}`
          }
        };
      }
      
      try {
        const result = await tool.handler(message.params.arguments);
        return {
          jsonrpc: '2.0',
          id: message.id,
          result
        };
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32000,
            message: error instanceof Error ? error.message : String(error)
          }
        };
      }
    }
    
    return {
      jsonrpc: '2.0',
      id: message.id,
      error: {
        code: -32000,
        message: `Method not supported: ${message.method}`
      }
    };
  }
  
  async close() {
    // Nothing to do
  }
}

export class StdioServerTransport {
  constructor() {
    // Nothing to do
  }
  
  async close() {
    // Nothing to do
  }
}

export class Client {
  private transport: any;
  private requestId = 0;
  
  constructor(options: { name: string; version: string }) {
    // Nothing to do
  }
  
  async connect(transport: any) {
    this.transport = transport;
  }
  
  async callTool(options: { name: string; arguments: Record<string, any> }) {
    const request = {
      jsonrpc: '2.0',
      id: String(++this.requestId),
      method: 'callTool',
      params: options
    };
    
    const response = await this.transport.send(request);
    
    if (response.error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: response.error.message }) }],
        isError: true
      };
    }
    
    return response.result;
  }
  
  async close() {
    // Nothing to do
  }
}
