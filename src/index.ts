import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { enhanceWithContext } from "./enhancers/contextEnhancer.js";
import { enhanceWithExamples } from "./enhancers/exampleEnhancer.js";
import {
    enhanceWithInstructions,
    InstructionType,
} from "./enhancers/instructionEnhancer.js";
import { loadConfig } from "./config.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Load configuration
const config = loadConfig();

// Create MCP server
const server = new Server(
    {
        name: "prompt-boost",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "enhance-with-context",
                description: "Enhance a prompt by adding relevant context",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "The original prompt to enhance",
                        },
                        topic: {
                            type: "string",
                            description: "The topic to add context about",
                        },
                        depth: {
                            type: "number",
                            minimum: 1,
                            maximum: 5,
                            default: 3,
                            description: "Depth of context to add (1-5)",
                        },
                    },
                    required: ["prompt"],
                },
            },
            {
                name: "enhance-with-examples",
                description: "Enhance a prompt by adding relevant examples",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "The original prompt to enhance",
                        },
                        topic: {
                            type: "string",
                            description: "The topic to add examples for",
                        },
                        count: {
                            type: "number",
                            minimum: 1,
                            maximum: 5,
                            default: 2,
                            description: "Number of examples to add (1-5)",
                        },
                    },
                    required: ["prompt"],
                },
            },
            {
                name: "enhance-with-instructions",
                description:
                    "Enhance a prompt by adding specialized instructions",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "The original prompt to enhance",
                        },
                        instructionType: {
                            type: "string",
                            enum: [
                                "clarity",
                                "creativity",
                                "precision",
                                "reasoning",
                                "custom",
                            ],
                            description: "Type of instructions to add",
                        },
                        customInstructions: {
                            type: "string",
                            description:
                                "Custom instructions (only used when instructionType is 'custom')",
                        },
                    },
                    required: ["prompt", "instructionType"],
                },
            },
            {
                name: "enhance-prompt",
                description: "Comprehensive prompt enhancement",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "The original prompt to enhance",
                        },
                        addContext: {
                            type: "boolean",
                            default: true,
                            description: "Whether to add relevant context",
                        },
                        addExamples: {
                            type: "boolean",
                            default: true,
                            description: "Whether to add examples",
                        },
                        addInstructions: {
                            type: "boolean",
                            default: true,
                            description:
                                "Whether to add specialized instructions",
                        },
                        topic: {
                            type: "string",
                            description: "The topic for context and examples",
                        },
                        instructionType: {
                            type: "string",
                            enum: [
                                "clarity",
                                "creativity",
                                "precision",
                                "reasoning",
                                "custom",
                            ],
                            description: "Type of instructions to add",
                        },
                        customInstructions: {
                            type: "string",
                            description:
                                "Custom instructions (only used when instructionType is 'custom')",
                        },
                    },
                    required: ["prompt"],
                },
            },
        ],
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args = {} } = request.params;

        // Handle enhance-with-context tool
        if (name === "enhance-with-context") {
            const prompt = String(args.prompt || "");
            const topic = args.topic ? String(args.topic) : undefined;
            const depth = args.depth ? Number(args.depth) : 3;

            if (!prompt) {
                throw new Error("Prompt is required");
            }

            const enhancedPrompt = await enhanceWithContext(
                prompt,
                topic,
                depth
            );

            return {
                content: [{ type: "text", text: enhancedPrompt }],
            };
        }

        // Handle enhance-with-examples tool
        if (name === "enhance-with-examples") {
            const prompt = String(args.prompt || "");
            const topic = args.topic ? String(args.topic) : undefined;
            const count = args.count ? Number(args.count) : 2;

            if (!prompt) {
                throw new Error("Prompt is required");
            }

            const enhancedPrompt = await enhanceWithExamples(
                prompt,
                topic,
                count
            );

            return {
                content: [{ type: "text", text: enhancedPrompt }],
            };
        }

        // Handle enhance-with-instructions tool
        if (name === "enhance-with-instructions") {
            const prompt = String(args.prompt || "");
            const instructionTypeStr = args.instructionType
                ? String(args.instructionType)
                : "clarity";
            const customInstructions = args.customInstructions
                ? String(args.customInstructions)
                : undefined;

            if (!prompt) {
                throw new Error("Prompt is required");
            }

            // Validate instruction type
            const validTypes = [
                "clarity",
                "creativity",
                "precision",
                "reasoning",
                "custom",
            ];
            if (!validTypes.includes(instructionTypeStr)) {
                throw new Error(
                    `Invalid instruction type: ${instructionTypeStr}`
                );
            }

            const instructionType = instructionTypeStr as InstructionType;

            const enhancedPrompt = await enhanceWithInstructions(
                prompt,
                instructionType,
                customInstructions
            );

            return {
                content: [{ type: "text", text: enhancedPrompt }],
            };
        }

        // Handle enhance-prompt tool (comprehensive enhancement)
        if (name === "enhance-prompt") {
            const prompt = String(args.prompt || "");
            const addContext = args.addContext !== false; // Default to true
            const addExamples = args.addExamples !== false; // Default to true
            const addInstructions = args.addInstructions !== false; // Default to true
            const topic = args.topic ? String(args.topic) : undefined;
            const instructionTypeStr = args.instructionType
                ? String(args.instructionType)
                : undefined;
            const customInstructions = args.customInstructions
                ? String(args.customInstructions)
                : undefined;

            if (!prompt) {
                throw new Error("Prompt is required");
            }

            let enhancedPrompt = prompt;

            // Add context if requested
            if (addContext && topic) {
                enhancedPrompt = await enhanceWithContext(
                    enhancedPrompt,
                    topic,
                    config.defaultContextDepth
                );
            }

            // Add examples if requested
            if (addExamples && topic) {
                enhancedPrompt = await enhanceWithExamples(
                    enhancedPrompt,
                    topic,
                    config.defaultExampleCount
                );
            }

            // Add instructions if requested
            if (addInstructions && instructionTypeStr) {
                // Validate instruction type
                const validTypes = [
                    "clarity",
                    "creativity",
                    "precision",
                    "reasoning",
                    "custom",
                ];
                if (!validTypes.includes(instructionTypeStr)) {
                    throw new Error(
                        `Invalid instruction type: ${instructionTypeStr}`
                    );
                }

                const instructionType = instructionTypeStr as InstructionType;

                enhancedPrompt = await enhanceWithInstructions(
                    enhancedPrompt,
                    instructionType,
                    customInstructions
                );
            }

            return {
                content: [{ type: "text", text: enhancedPrompt }],
            };
        }

        // If tool not found
        throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return {
            isError: true,
            content: [{ type: "text", text: `Error: ${errorMessage}` }],
        };
    }
});

// Start the server with stdio transport
const transport = new StdioServerTransport();

// Connect the server to the transport
async function startServer() {
    try {
        console.log("Starting Prompt Boost MCP server...");
        await server.connect(transport);
        console.log("Prompt Boost MCP server connected and ready");
    } catch (error) {
        console.error("Error starting Prompt Boost MCP server:", error);
        process.exit(1);
    }
}

startServer();
