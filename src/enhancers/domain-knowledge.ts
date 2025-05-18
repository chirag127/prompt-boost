import { Enhancer, EnhancerOptions, EnhancementResult } from "./interface.js";
import { logger } from "../utils.js";

export interface DomainKnowledgeEnhancerOptions extends EnhancerOptions {
  domain: string;
  depth?: "basic" | "intermediate" | "advanced";
  includeTerminology?: boolean;
  includePrinciples?: boolean;
}

export class DomainKnowledgeEnhancer implements Enhancer {
  name = "domain-knowledge";
  description = "Enhances prompts by adding domain-specific knowledge";

  async enhance(prompt: string, options: DomainKnowledgeEnhancerOptions): Promise<EnhancementResult> {
    logger.debug(`Enhancing prompt with domain knowledge: ${JSON.stringify(options)}`);
    
    if (!options.domain) {
      throw new Error("Domain must be specified for domain knowledge enhancement");
    }
    
    const domain = options.domain;
    const depth = options.depth || "intermediate";
    const includeTerminology = options.includeTerminology !== false;
    const includePrinciples = options.includePrinciples !== false;
    
    // Generate domain knowledge
    const knowledgeAdditions = this.generateDomainKnowledge(domain, depth, includeTerminology, includePrinciples);
    
    // Combine the original prompt with the domain knowledge
    const enhancedPrompt = this.combinePromptWithKnowledge(prompt, knowledgeAdditions);
    
    return {
      enhancedPrompt,
      metadata: {
        strategy: this.name,
        modifications: [`Added ${knowledgeAdditions.length} domain knowledge elements`],
        domain,
        depth,
      },
    };
  }

  private generateDomainKnowledge(
    domain: string, 
    depth: string, 
    includeTerminology: boolean, 
    includePrinciples: boolean
  ): string[] {
    const knowledgeAdditions: string[] = [];
    
    // Add domain-specific introduction
    knowledgeAdditions.push(`Domain: ${domain}`);
    
    // Add terminology if requested
    if (includeTerminology) {
      knowledgeAdditions.push(`${domain} Terminology: Key terms relevant to this domain.`);
    }
    
    // Add principles if requested
    if (includePrinciples) {
      knowledgeAdditions.push(`${domain} Principles: Fundamental principles in this domain.`);
    }
    
    // Add depth-specific knowledge
    if (depth === "basic") {
      knowledgeAdditions.push(`Basic ${domain} concepts: Foundational information about this domain.`);
    } else if (depth === "intermediate") {
      knowledgeAdditions.push(`Intermediate ${domain} concepts: More detailed information about this domain.`);
    } else if (depth === "advanced") {
      knowledgeAdditions.push(`Advanced ${domain} concepts: Specialized information for experts in this domain.`);
    }
    
    return knowledgeAdditions;
  }

  private combinePromptWithKnowledge(prompt: string, knowledgeAdditions: string[]): string {
    if (knowledgeAdditions.length === 0) {
      return prompt;
    }
    
    const knowledgeSection = `
DOMAIN KNOWLEDGE:
${knowledgeAdditions.join('\n')}

PROMPT:
`;
    
    return `${knowledgeSection}${prompt}`;
  }
}
