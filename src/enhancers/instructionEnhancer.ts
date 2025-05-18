import { loadConfig } from "../config.js";

// Type for instruction types
export type InstructionType =
    | "clarity"
    | "creativity"
    | "precision"
    | "reasoning"
    | "custom";

/**
 * Enhances a prompt by adding specialized instructions
 *
 * @param prompt The original prompt to enhance
 * @param instructionType The type of instructions to add
 * @param customInstructions Custom instructions (only used when instructionType is 'custom')
 * @returns The enhanced prompt with added instructions
 */
export async function enhanceWithInstructions(
    prompt: string,
    instructionType: InstructionType,
    customInstructions?: string
): Promise<string> {
    const config = loadConfig();

    // Generate instructions based on the instruction type
    let instructions: string;

    if (instructionType === "custom" && customInstructions) {
        instructions = customInstructions;
    } else {
        instructions = getInstructionsForType(instructionType);
    }

    // Format the enhanced prompt with the instructions
    return formatEnhancedPrompt(
        prompt,
        instructions,
        config.instructionTemplate
    );
}

/**
 * Gets predefined instructions for a given instruction type
 *
 * @param instructionType The type of instructions to get
 * @returns The instructions for the specified type
 */
function getInstructionsForType(instructionType: InstructionType): string {
    const instructionSets: Record<string, string> = {
        clarity:
            "Please provide a clear, well-structured response. Use simple language, avoid jargon unless necessary, and organize information logically with headings and bullet points where appropriate.",

        creativity:
            "Please provide a creative and innovative response. Think outside the box, consider unconventional approaches, and explore multiple perspectives or solutions.",

        precision:
            "Please provide a precise and accurate response. Focus on factual information, cite sources where possible, and be explicit about levels of certainty. Avoid ambiguity and vague statements.",

        reasoning:
            "Please provide a response that demonstrates clear reasoning. Explain your thought process step-by-step, consider multiple angles, identify assumptions, and evaluate the strength of different arguments or approaches.",

        custom: "", // Empty placeholder for custom instructions
    };

    return instructionSets[instructionType] || instructionSets.clarity;
}

/**
 * Formats the enhanced prompt with the instructions using a template
 *
 * @param originalPrompt The original prompt
 * @param instructions The instructions to add
 * @param template The template to use for formatting
 * @returns The formatted enhanced prompt
 */
function formatEnhancedPrompt(
    originalPrompt: string,
    instructions: string,
    template: string
): string {
    return template
        .replace("{{INSTRUCTIONS}}", instructions)
        .replace("{{PROMPT}}", originalPrompt);
}
