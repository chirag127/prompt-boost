import { Enhancer } from "./interface.js";
import { ContextEnhancer } from "./context.js";
import { ExampleEnhancer } from "./example.js";
import { InstructionEnhancer } from "./instruction.js";
import { DomainKnowledgeEnhancer } from "./domain-knowledge.js";
import { config } from "../config.js";
import { logger } from "../utils.js";

// Create instances of each enhancer
const contextEnhancer = new ContextEnhancer();
const exampleEnhancer = new ExampleEnhancer();
const instructionEnhancer = new InstructionEnhancer();
const domainKnowledgeEnhancer = new DomainKnowledgeEnhancer();

// List of all available enhancers
const allEnhancers: Enhancer[] = [
    contextEnhancer,
    exampleEnhancer,
    instructionEnhancer,
    domainKnowledgeEnhancer,
];

// Function to load enhancers based on configuration
export function loadEnhancers(): Enhancer[] {
    // If enabledEnhancers is specified in config, filter enhancers
    if (
        config.enabledEnhancers &&
        Array.isArray(config.enabledEnhancers) &&
        config.enabledEnhancers.length > 0
    ) {
        logger.info(
            `Loading specific enhancers: ${config.enabledEnhancers.join(", ")}`
        );
        return allEnhancers.filter((enhancer) =>
            (config.enabledEnhancers as string[]).includes(enhancer.name)
        );
    }

    // Otherwise, return all enhancers
    logger.info(
        `Loading all enhancers: ${allEnhancers.map((e) => e.name).join(", ")}`
    );
    return allEnhancers;
}
