import { createTestServer, createTestClient } from "./setup";
import { Client } from "./mocks/mcp-sdk";
import { McpServer } from "./mocks/mcp-sdk";

describe("MCP Tools", () => {
    let server: McpServer;
    let client: Client;

    beforeAll(async () => {
        server = createTestServer();
        client = await createTestClient(server);
    });

    afterAll(async () => {
        await client.close();
    });

    describe("list-enhancers tool", () => {
        test("returns all available enhancers", async () => {
            const result = await client.callTool({
                name: "list-enhancers",
                arguments: {},
            });

            const enhancers = JSON.parse(result.content[0].text);
            expect(enhancers).toBeInstanceOf(Array);
            expect(enhancers.length).toBeGreaterThan(0);

            // Check that each enhancer has name and description
            enhancers.forEach((enhancer: any) => {
                expect(enhancer).toHaveProperty("name");
                expect(enhancer).toHaveProperty("description");
            });

            // Check for specific enhancers
            const enhancerNames = enhancers.map((e: any) => e.name);
            expect(enhancerNames).toContain("context");
            expect(enhancerNames).toContain("example");
            expect(enhancerNames).toContain("instruction");
            expect(enhancerNames).toContain("domain-knowledge");
        });
    });

    describe("enhance-prompt tool", () => {
        test("enhances prompt with context strategy", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "context",
                    options: {},
                },
            });

            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("enhancedPrompt");
            expect(response).toHaveProperty("metadata");
            expect(response.metadata.strategy).toBe("context");
            expect(response.enhancedPrompt).toContain("CONTEXT:");
            expect(response.enhancedPrompt).toContain("PROMPT:");
            expect(response.enhancedPrompt).toContain(
                "Explain quantum computing"
            );
        });

        test("enhances prompt with example strategy", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "example",
                    options: {},
                },
            });

            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("enhancedPrompt");
            expect(response).toHaveProperty("metadata");
            expect(response.metadata.strategy).toBe("example");
            expect(response.enhancedPrompt).toContain("EXAMPLES:");
            expect(response.enhancedPrompt).toContain("PROMPT:");
            expect(response.enhancedPrompt).toContain(
                "Explain quantum computing"
            );
        });

        test("enhances prompt with instruction strategy", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "instruction",
                    options: {},
                },
            });

            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("enhancedPrompt");
            expect(response).toHaveProperty("metadata");
            expect(response.metadata.strategy).toBe("instruction");
            expect(response.enhancedPrompt).toContain("INSTRUCTIONS:");
            expect(response.enhancedPrompt).toContain(
                "Explain quantum computing"
            );
        });

        test("enhances prompt with domain-knowledge strategy", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "domain-knowledge",
                    options: {
                        domain: "physics",
                    },
                },
            });

            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("enhancedPrompt");
            expect(response).toHaveProperty("metadata");
            expect(response.metadata.strategy).toBe("domain-knowledge");
            expect(response.enhancedPrompt).toContain("DOMAIN KNOWLEDGE:");
            expect(response.enhancedPrompt).toContain("Domain: physics");
            expect(response.enhancedPrompt).toContain("PROMPT:");
            expect(response.enhancedPrompt).toContain(
                "Explain quantum computing"
            );
        });

        test("passes options to enhancers", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "context",
                    options: {
                        contextType: "technical",
                        depth: "extensive",
                    },
                },
            });

            const response = JSON.parse(result.content[0].text);
            expect(response.metadata.contextType).toBe("technical");
            expect(response.metadata.depth).toBe("extensive");
            expect(response.enhancedPrompt).toContain("Technical context");
            expect(response.enhancedPrompt).toContain("Extended context");
        });
    });

    describe("error handling", () => {
        test("returns error for invalid strategy", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "invalid-strategy",
                    options: {},
                },
            });

            expect(result.isError).toBe(true);
            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("error");
            expect(response.error).toContain("Unknown enhancement strategy");
        });

        test("returns error for missing required parameters in domain-knowledge", async () => {
            const result = await client.callTool({
                name: "enhance-prompt",
                arguments: {
                    prompt: "Explain quantum computing",
                    strategy: "domain-knowledge",
                    options: {}, // Missing domain parameter
                },
            });

            expect(result.isError).toBe(true);
            const response = JSON.parse(result.content[0].text);
            expect(response).toHaveProperty("error");
            expect(response.error).toContain("Domain must be specified");
        });
    });
});
