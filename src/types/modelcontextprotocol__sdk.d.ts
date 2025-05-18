declare module '@modelcontextprotocol/sdk' {
  export class McpServer {
    constructor(options: { name: string; version: string });
    
    tool(
      name: string,
      description: string,
      paramSchema: Record<string, any>,
      handler: (params: any) => Promise<any>
    ): any;
    
    connect(transport: any): Promise<void>;
    
    handleRequest(message: any): Promise<any>;
    
    close(): Promise<void>;
  }
  
  export class StdioServerTransport {
    constructor();
    
    close(): Promise<void>;
  }
  
  export class Client {
    constructor(options: { name: string; version: string });
    
    connect(transport: any): Promise<void>;
    
    callTool(options: { name: string; arguments: Record<string, any> }): Promise<any>;
    
    close(): Promise<void>;
  }
}
