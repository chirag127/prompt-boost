import { McpServer } from "./mocks/mcp-sdk";
import { Client } from "./mocks/mcp-sdk";
import { z } from "zod";
import { loadEnhancers } from "../src/enhancers/index";
import { logger } from "../src/utils";

// Create a test server
export function createTestServer() {
    const server = new McpServer({
        name: "prompt-enhancer-test",
        version: "1.0.0",
    });

    // Load enhancers
    const enhancers = loadEnhancers();

    // Create a schema for the strategy parameter
    const strategyEnum = z.enum(
        enhancers.length > 0
            ? (enhancers.map((e) => e.name) as [string, ...string[]])
            : ["context"] // Fallback if no enhancers are loaded
    );

    // Register the enhance-prompt tool
    server.tool(
        "enhance-prompt",
        "Enhances a prompt by adding context, examples, or specialized instructions",
        {
            prompt: z
                .string()
                .min(1)
                .describe("The original prompt to enhance"),
            strategy: strategyEnum.describe("The enhancement strategy to use"),
            options: z
                .record(z.any())
                .optional()
                .describe("Strategy-specific options"),
        },
        async ({ prompt, strategy, options = {} }) => {
            try {
                logger.info(`Enhancing prompt using strategy: ${strategy}`);

                // Find the requested enhancer
                const enhancer = enhancers.find((e) => e.name === strategy);
                if (!enhancer) {
                    throw new Error(
                        `Unknown enhancement strategy: ${strategy}`
                    );
                }

                // Enhance the prompt
                const result = await enhancer.enhance(prompt, options);

                logger.info(`Successfully enhanced prompt`);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                enhancedPrompt: result.enhancedPrompt,
                                metadata: result.metadata,
                            }),
                        },
                    ],
                };
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                logger.error(`Error enhancing prompt: ${errorMessage}`);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: errorMessage,
                            }),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    // Register the list-enhancers tool
    server.tool(
        "list-enhancers",
        "Lists all available prompt enhancement strategies",
        {},
        async () => {
            try {
                logger.info("Listing available enhancers");

                const enhancerList = enhancers.map((enhancer) => ({
                    name: enhancer.name,
                    description: enhancer.description,
                }));

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(enhancerList),
                        },
                    ],
                };
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                logger.error(`Error listing enhancers: ${errorMessage}`);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: errorMessage,
                            }),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );

    return server;
}

// Create a test client connected to the server
export async function createTestClient(server: McpServer) {
    // Create a memory transport that connects directly to the server
    const transport = {
        send: async (message: any) => {
            // Simulate sending a message to the server
            const response = await server.handleRequest(message);
            return response;
        },
        close: async () => {
            // Nothing to do for memory transport
        },
        onNotification: (callback: (notification: any) => void) => {
            // Nothing to do for memory transport in tests
        },
    };

    // Create a client
    const client = new Client({
        name: "test-client",
        version: "1.0.0",
    });

    // Connect the client to the transport
    // @ts-ignore - We're using a simplified transport for testing
    await client.connect(transport);

    return client;
}
