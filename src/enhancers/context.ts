import { Enhancer, EnhancerOptions, EnhancementResult } from "./interface.js";
import { logger } from "../utils.js";

export interface ContextEnhancerOptions extends EnhancerOptions {
  contextType?: "general" | "technical" | "creative" | "analytical";
  depth?: "minimal" | "moderate" | "extensive";
  includeDefinitions?: boolean;
  includeBackground?: boolean;
}

export class ContextEnhancer implements Enhancer {
  name = "context";
  description = "Enhances prompts by adding relevant contextual information";

  async enhance(prompt: string, options: ContextEnhancerOptions = {}): Promise<EnhancementResult> {
    logger.debug(`Enhancing prompt with context: ${JSON.stringify(options)}`);
    
    const contextType = options.contextType || "general";
    const depth = options.depth || "moderate";
    const includeDefinitions = options.includeDefinitions !== false;
    const includeBackground = options.includeBackground !== false;
    
    // Extract key terms from the prompt
    const keyTerms = this.extractKeyTerms(prompt);
    
    // Generate context based on key terms and options
    const contextAdditions = this.generateContext(keyTerms, contextType, depth, includeDefinitions, includeBackground);
    
    // Combine the original prompt with the context
    const enhancedPrompt = this.combinePromptWithContext(prompt, contextAdditions);
    
    return {
      enhancedPrompt,
      metadata: {
        strategy: this.name,
        modifications: [`Added ${contextAdditions.length} context elements`],
        contextType,
        depth,
        keyTerms,
      },
    };
  }

  private extractKeyTerms(prompt: string): string[] {
    // Simple implementation - extract capitalized terms and terms in quotes
    const capitalizedTerms = prompt.match(/\b[A-Z][a-zA-Z]*\b/g) || [];
    const quotedTerms = prompt.match(/"([^"]+)"/g)?.map(term => term.slice(1, -1)) || [];
    
    // Combine and deduplicate
    return [...new Set([...capitalizedTerms, ...quotedTerms])];
  }

  private generateContext(
    keyTerms: string[], 
    contextType: string, 
    depth: string, 
    includeDefinitions: boolean, 
    includeBackground: boolean
  ): string[] {
    const contextAdditions: string[] = [];
    
    // Add definitions if requested
    if (includeDefinitions && keyTerms.length > 0) {
      for (const term of keyTerms) {
        contextAdditions.push(`${term}: A term relevant to this prompt.`);
      }
    }
    
    // Add background information if requested
    if (includeBackground) {
      contextAdditions.push(`Background: Additional context to help understand the prompt.`);
    }
    
    // Add depth-specific context
    if (depth === "extensive") {
      contextAdditions.push(`Extended context: More detailed information about the topic.`);
    }
    
    // Add context type-specific information
    if (contextType === "technical") {
      contextAdditions.push(`Technical context: Specialized information for technical understanding.`);
    } else if (contextType === "creative") {
      contextAdditions.push(`Creative context: Information to inspire creative thinking.`);
    } else if (contextType === "analytical") {
      contextAdditions.push(`Analytical context: Information to support analytical reasoning.`);
    }
    
    return contextAdditions;
  }

  private combinePromptWithContext(prompt: string, contextAdditions: string[]): string {
    if (contextAdditions.length === 0) {
      return prompt;
    }
    
    const contextSection = `
CONTEXT:
${contextAdditions.join('\n')}

PROMPT:
`;
    
    return `${contextSection}${prompt}`;
  }
}
