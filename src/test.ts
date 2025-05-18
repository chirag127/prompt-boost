import { enhanceWithContext } from './enhancers/contextEnhancer.js';
import { enhanceWithExamples } from './enhancers/exampleEnhancer.js';
import { enhanceWithInstructions } from './enhancers/instructionEnhancer.js';

async function runTests() {
  console.log('Running manual tests for Prompt Boost MCP server...\n');
  
  // Test enhanceWithContext
  console.log('Testing enhanceWithContext:');
  const contextPrompt = 'What is the capital of France?';
  const contextTopic = 'France';
  const contextDepth = 3;
  
  try {
    const enhancedContextPrompt = await enhanceWithContext(contextPrompt, contextTopic, contextDepth);
    console.log('Original prompt:', contextPrompt);
    console.log('Enhanced prompt:', enhancedContextPrompt);
    console.log('Test passed: enhanceWithContext\n');
  } catch (error) {
    console.error('Test failed: enhanceWithContext', error);
  }
  
  // Test enhanceWithExamples
  console.log('Testing enhanceWithExamples:');
  const examplesPrompt = 'How do I write a for loop in JavaScript?';
  const examplesTopic = 'JavaScript loops';
  const examplesCount = 2;
  
  try {
    const enhancedExamplesPrompt = await enhanceWithExamples(examplesPrompt, examplesTopic, examplesCount);
    console.log('Original prompt:', examplesPrompt);
    console.log('Enhanced prompt:', enhancedExamplesPrompt);
    console.log('Test passed: enhanceWithExamples\n');
  } catch (error) {
    console.error('Test failed: enhanceWithExamples', error);
  }
  
  // Test enhanceWithInstructions
  console.log('Testing enhanceWithInstructions:');
  const instructionsPrompt = 'Explain quantum computing.';
  const instructionType = 'clarity';
  
  try {
    const enhancedInstructionsPrompt = await enhanceWithInstructions(instructionsPrompt, instructionType);
    console.log('Original prompt:', instructionsPrompt);
    console.log('Enhanced prompt:', enhancedInstructionsPrompt);
    console.log('Test passed: enhanceWithInstructions\n');
  } catch (error) {
    console.error('Test failed: enhanceWithInstructions', error);
  }
  
  // Test comprehensive enhancement
  console.log('Testing comprehensive enhancement:');
  const comprehensivePrompt = 'What is machine learning?';
  const comprehensiveTopic = 'machine learning';
  const comprehensiveInstructionType = 'precision';
  
  try {
    // First add context
    let enhancedPrompt = await enhanceWithContext(comprehensivePrompt, comprehensiveTopic, 3);
    
    // Then add examples
    enhancedPrompt = await enhanceWithExamples(enhancedPrompt, comprehensiveTopic, 2);
    
    // Finally add instructions
    enhancedPrompt = await enhanceWithInstructions(enhancedPrompt, comprehensiveInstructionType);
    
    console.log('Original prompt:', comprehensivePrompt);
    console.log('Enhanced prompt:', enhancedPrompt);
    console.log('Test passed: comprehensive enhancement\n');
  } catch (error) {
    console.error('Test failed: comprehensive enhancement', error);
  }
  
  console.log('All tests completed.');
}

runTests().catch(console.error);
