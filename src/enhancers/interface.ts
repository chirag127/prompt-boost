/**
 * Interface for enhancer options
 */
export interface EnhancerOptions {
  [key: string]: any;
}

/**
 * Interface for enhancement result
 */
export interface EnhancementResult {
  enhancedPrompt: string;
  metadata?: {
    strategy: string;
    modifications: string[];
    [key: string]: any;
  };
}

/**
 * Interface for prompt enhancers
 */
export interface Enhancer {
  name: string;
  description: string;
  enhance(prompt: string, options?: EnhancerOptions): Promise<EnhancementResult>;
}
