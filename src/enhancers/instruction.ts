import { Enhancer, EnhancerOptions, EnhancementResult } from "./interface.js";
import { logger } from "../utils.js";

export interface InstructionEnhancerOptions extends EnhancerOptions {
  instructionType?: "clarity" | "reasoning" | "structure" | "comprehensive";
  addStepByStep?: boolean;
  addReasoning?: boolean;
}

export class InstructionEnhancer implements Enhancer {
  name = "instruction";
  description = "Enhances prompts by refining instructions for better reasoning and clarity";

  async enhance(prompt: string, options: InstructionEnhancerOptions = {}): Promise<EnhancementResult> {
    logger.debug(`Enhancing prompt with instructions: ${JSON.stringify(options)}`);
    
    const instructionType = options.instructionType || "clarity";
    const addStepByStep = options.addStepByStep !== false;
    const addReasoning = options.addReasoning !== false;
    
    // Generate instruction enhancements
    const instructionAdditions = this.generateInstructionAdditions(instructionType, addStepByStep, addReasoning);
    
    // Combine the original prompt with the instruction enhancements
    const enhancedPrompt = this.combinePromptWithInstructions(prompt, instructionAdditions);
    
    return {
      enhancedPrompt,
      metadata: {
        strategy: this.name,
        modifications: [`Added ${instructionAdditions.length} instruction enhancements`],
        instructionType,
        addedStepByStep: addStepByStep,
        addedReasoning: addReasoning,
      },
    };
  }

  private generateInstructionAdditions(instructionType: string, addStepByStep: boolean, addReasoning: boolean): string[] {
    const additions: string[] = [];
    
    // Add type-specific instructions
    if (instructionType === "clarity") {
      additions.push("Please provide a clear and concise response.");
    } else if (instructionType === "reasoning") {
      additions.push("Please explain your reasoning process thoroughly.");
    } else if (instructionType === "structure") {
      additions.push("Please structure your response with clear sections and headings.");
    } else if (instructionType === "comprehensive") {
      additions.push("Please provide a comprehensive response that covers all aspects of the question.");
    }
    
    // Add step-by-step instructions if requested
    if (addStepByStep) {
      additions.push("Break down your approach into clear, sequential steps.");
    }
    
    // Add reasoning instructions if requested
    if (addReasoning) {
      additions.push("For each conclusion, explain the reasoning that led you to it.");
    }
    
    return additions;
  }

  private combinePromptWithInstructions(prompt: string, instructionAdditions: string[]): string {
    if (instructionAdditions.length === 0) {
      return prompt;
    }
    
    const instructionsSection = `
INSTRUCTIONS:
${instructionAdditions.join('\n')}
`;
    
    return `${prompt}\n\n${instructionsSection}`;
  }
}
