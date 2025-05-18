import { Enhancer, EnhancerOptions, EnhancementResult } from "./interface.js";
import { logger } from "../utils.js";

export interface ExampleEnhancerOptions extends EnhancerOptions {
    exampleCount?: number;
    exampleType?: "simple" | "detailed" | "diverse";
    position?: "before" | "after";
}

export class ExampleEnhancer implements Enhancer {
    name = "example";
    description = "Enhances prompts by adding relevant examples";

    async enhance(
        prompt: string,
        options: ExampleEnhancerOptions = {}
    ): Promise<EnhancementResult> {
        logger.debug(
            `Enhancing prompt with examples: ${JSON.stringify(options)}`
        );

        const exampleCount =
            options.exampleCount !== undefined ? options.exampleCount : 2;
        const exampleType = options.exampleType || "simple";
        const position = options.position || "before";

        // Generate examples based on the prompt and options
        const examples = this.generateExamples(
            prompt,
            exampleCount,
            exampleType
        );

        // Combine the original prompt with the examples
        const enhancedPrompt = this.combinePromptWithExamples(
            prompt,
            examples,
            position
        );

        return {
            enhancedPrompt,
            metadata: {
                strategy: this.name,
                modifications: [`Added ${examples.length} examples`],
                exampleType,
                position,
            },
        };
    }

    private generateExamples(
        prompt: string,
        count: number,
        type: string
    ): string[] {
        // If count is 0 or negative, return empty array
        if (count <= 0) {
            return [];
        }

        const examples: string[] = [];

        for (let i = 0; i < count; i++) {
            if (type === "simple") {
                examples.push(
                    `Example ${i + 1}: A simple example related to the prompt.`
                );
            } else if (type === "detailed") {
                examples.push(
                    `Example ${
                        i + 1
                    }: A detailed example with step-by-step explanation.`
                );
            } else if (type === "diverse") {
                examples.push(
                    `Example ${
                        i + 1
                    }: A diverse example showing different aspects of the prompt.`
                );
            }
        }

        return examples;
    }

    private combinePromptWithExamples(
        prompt: string,
        examples: string[],
        position: string
    ): string {
        if (examples.length === 0) {
            return prompt;
        }

        const examplesSection = `
EXAMPLES:
${examples.join("\n\n")}
`;

        if (position === "before") {
            return `${examplesSection}\n\nPROMPT:\n${prompt}`;
        } else {
            return `${prompt}\n\n${examplesSection}`;
        }
    }
}
