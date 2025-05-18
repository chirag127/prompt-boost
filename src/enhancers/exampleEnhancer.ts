import { loadConfig } from '../config.js';

/**
 * Enhances a prompt by adding relevant examples
 * 
 * @param prompt The original prompt to enhance
 * @param topic The topic to add examples for (optional)
 * @param count The number of examples to add (1-5)
 * @returns The enhanced prompt with added examples
 */
export async function enhanceWithExamples(
  prompt: string,
  topic?: string,
  count: number = 2
): Promise<string> {
  const config = loadConfig();
  
  // If no topic is provided, return the original prompt
  if (!topic) {
    return prompt;
  }
  
  // Validate count parameter
  if (count < 1 || count > 5) {
    throw new Error("Example count must be between 1 and 5");
  }
  
  // Generate examples based on the topic and count
  const examples = generateExamplesForTopic(topic, count);
  
  // Format the enhanced prompt with the examples
  return formatEnhancedPrompt(prompt, examples, config.exampleTemplate);
}

/**
 * Generates examples for a given topic
 * 
 * @param topic The topic to generate examples for
 * @param count The number of examples to generate
 * @returns Generated examples as a formatted string
 */
function generateExamplesForTopic(topic: string, count: number): string {
  // This is a simplified implementation
  // In a real-world scenario, this might call an external API or database
  
  const examplePool = [
    `Example 1 related to ${topic}: This is a simple demonstration.`,
    `Example 2 related to ${topic}: This shows a more complex case.`,
    `Example 3 related to ${topic}: This illustrates an edge case.`,
    `Example 4 related to ${topic}: This demonstrates best practices.`,
    `Example 5 related to ${topic}: This shows common pitfalls to avoid.`
  ];
  
  // Select the requested number of examples
  const selectedExamples = examplePool.slice(0, count);
  
  // Format the examples as a numbered list
  return selectedExamples.join('\n\n');
}

/**
 * Formats the enhanced prompt with the examples using a template
 * 
 * @param originalPrompt The original prompt
 * @param examples The examples to add
 * @param template The template to use for formatting
 * @returns The formatted enhanced prompt
 */
function formatEnhancedPrompt(
  originalPrompt: string,
  examples: string,
  template: string
): string {
  return template
    .replace('{{EXAMPLES}}', examples)
    .replace('{{PROMPT}}', originalPrompt);
}
