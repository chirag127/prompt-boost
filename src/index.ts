import { McpServer } from "@modelcontextprotocol/sdk";
import { StdioServerTransport } from "@modelcontextprotocol/sdk";
import { z } from "zod";
import { loadEnhancers } from "./enhancers/index.js";
import { config } from "./config.js";
import { logger } from "./utils.js";

// Create the MCP server
const server = new McpServer({
    name: "prompt-enhancer",
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
        prompt: z.string().min(1).describe("The original prompt to enhance"),
        strategy: strategyEnum.describe("The enhancement strategy to use"),
        options: z
            .record(z.any())
            .optional()
            .describe("Strategy-specific options"),
    },
    async ({
        prompt,
        strategy,
        options = {},
    }: {
        prompt: string;
        strategy: string;
        options?: Record<string, any>;
    }) => {
        try {
            logger.info(`Enhancing prompt using strategy: ${strategy}`);

            // Find the requested enhancer
            const enhancer = enhancers.find((e) => e.name === strategy);
            if (!enhancer) {
                throw new Error(`Unknown enhancement strategy: ${strategy}`);
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
    async (): Promise<any> => {
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

// Start the server
async function main() {
    try {
        logger.info("Starting prompt enhancer MCP server");

        const transport = new StdioServerTransport();
        await server.connect(transport);

        logger.info("Server started successfully");
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        logger.error(`Failed to start server: ${errorMessage}`);
        process.exit(1);
    }
}

main();
