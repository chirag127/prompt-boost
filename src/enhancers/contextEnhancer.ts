import { loadConfig } from '../config.js';

/**
 * Enhances a prompt by adding relevant context about a topic
 * 
 * @param prompt The original prompt to enhance
 * @param topic The topic to add context about (optional)
 * @param depth The depth of context to add (1-5)
 * @returns The enhanced prompt with added context
 */
export async function enhanceWithContext(
  prompt: string,
  topic?: string,
  depth: number = 3
): Promise<string> {
  const config = loadConfig();
  
  // If no topic is provided, return the original prompt
  if (!topic) {
    return prompt;
  }
  
  // Validate depth parameter
  if (depth < 1 || depth > 5) {
    throw new Error("Depth must be between 1 and 5");
  }
  
  // Generate context based on the topic and depth
  const context = generateContextForTopic(topic, depth);
  
  // Format the enhanced prompt with the context
  return formatEnhancedPrompt(prompt, context, config.contextTemplate);
}

/**
 * Generates context information for a given topic
 * 
 * @param topic The topic to generate context for
 * @param depth The depth of context to generate (1-5)
 * @returns Generated context information
 */
function generateContextForTopic(topic: string, depth: number): string {
  // This is a simplified implementation
  // In a real-world scenario, this might call an external API or database
  
  const contextDepths = {
    1: `Basic information about ${topic}.`,
    2: `Basic information about ${topic}, including key concepts and terminology.`,
    3: `Comprehensive overview of ${topic}, including key concepts, terminology, and common applications.`,
    4: `Detailed information about ${topic}, including history, key concepts, terminology, applications, and current trends.`,
    5: `Expert-level information about ${topic}, including detailed history, theoretical foundations, key concepts, terminology, applications, current trends, and future directions.`
  };
  
  return contextDepths[depth as keyof typeof contextDepths] || contextDepths[3];
}

/**
 * Formats the enhanced prompt with the context using a template
 * 
 * @param originalPrompt The original prompt
 * @param context The context to add
 * @param template The template to use for formatting
 * @returns The formatted enhanced prompt
 */
function formatEnhancedPrompt(
  originalPrompt: string,
  context: string,
  template: string
): string {
  return template
    .replace('{{CONTEXT}}', context)
    .replace('{{PROMPT}}', originalPrompt);
}
