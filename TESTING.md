# Testing Guide for Prompt Enhancer MCP Server

This document provides information on how to run tests for the Prompt Enhancer MCP server and explains the test cases.

## Running Tests

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installing Dependencies

```bash
npm install
```

### Running All Tests

```bash
npm test
```

### Running Tests in Watch Mode

```bash
npm run test:watch
```

### Running Tests with Coverage

```bash
npm run test:coverage
```

## Test Structure

The tests are organized into the following files:

- `__tests__/enhancers.test.ts`: Tests for each enhancer implementation
- `__tests__/tools.test.ts`: Tests for the MCP tools
- `__tests__/setup.ts`: Test setup and utilities

## Test Cases

### Enhancer Tests

#### Context Enhancer

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Default options | Tests enhancer with default options | Prompt with context section added |
| Key term extraction | Tests extraction of key terms from prompt | Key terms identified in metadata |
| Context type - technical | Tests with technical context type | Technical context added |
| Context type - creative | Tests with creative context type | Creative context added |
| Context type - analytical | Tests with analytical context type | Analytical context added |
| Depth - extensive | Tests with extensive depth | Extended context added |
| Include definitions - false | Tests with definitions disabled | No definitions added |
| Include background - false | Tests with background disabled | No background added |
| Empty prompt | Tests with empty prompt | Context still added |

#### Example Enhancer

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Default options | Tests enhancer with default options | Prompt with 2 examples added |
| Example count | Tests with different example counts | Specified number of examples added |
| Example type - simple | Tests with simple example type | Simple examples added |
| Example type - detailed | Tests with detailed example type | Detailed examples added |
| Example type - diverse | Tests with diverse example type | Diverse examples added |
| Position - before | Tests with examples before prompt | Examples appear before prompt |
| Position - after | Tests with examples after prompt | Examples appear after prompt |
| Zero examples | Tests with zero examples | No examples section added |

#### Instruction Enhancer

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Default options | Tests enhancer with default options | Prompt with instructions added |
| Instruction type - clarity | Tests with clarity instruction type | Clarity instructions added |
| Instruction type - reasoning | Tests with reasoning instruction type | Reasoning instructions added |
| Instruction type - structure | Tests with structure instruction type | Structure instructions added |
| Instruction type - comprehensive | Tests with comprehensive instruction type | Comprehensive instructions added |
| Add step by step - true | Tests with step by step enabled | Step by step instructions added |
| Add step by step - false | Tests with step by step disabled | No step by step instructions added |
| Add reasoning - true | Tests with reasoning enabled | Reasoning instructions added |
| Add reasoning - false | Tests with reasoning disabled | No reasoning instructions added |

#### Domain Knowledge Enhancer

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Required domain parameter | Tests with domain parameter | Domain knowledge added |
| Missing domain parameter | Tests without domain parameter | Error thrown |
| Depth - basic | Tests with basic depth | Basic domain concepts added |
| Depth - intermediate | Tests with intermediate depth | Intermediate domain concepts added |
| Depth - advanced | Tests with advanced depth | Advanced domain concepts added |
| Include terminology - true | Tests with terminology enabled | Domain terminology added |
| Include terminology - false | Tests with terminology disabled | No domain terminology added |
| Include principles - true | Tests with principles enabled | Domain principles added |
| Include principles - false | Tests with principles disabled | No domain principles added |

### Tool Tests

#### list-enhancers Tool

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| List all enhancers | Tests that all enhancers are listed | Array of enhancers with names and descriptions |

#### enhance-prompt Tool

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Context strategy | Tests enhancing with context strategy | Enhanced prompt with context |
| Example strategy | Tests enhancing with example strategy | Enhanced prompt with examples |
| Instruction strategy | Tests enhancing with instruction strategy | Enhanced prompt with instructions |
| Domain knowledge strategy | Tests enhancing with domain knowledge strategy | Enhanced prompt with domain knowledge |
| Pass options | Tests passing options to enhancers | Enhanced prompt with options applied |

#### Error Handling

| Test Case | Description | Expected Output |
|-----------|-------------|-----------------|
| Invalid strategy | Tests with invalid strategy name | Error response |
| Missing required parameters | Tests without required domain parameter | Error response |

## CI/CD Integration

The tests are automatically run in the CI/CD pipeline using GitHub Actions. The workflow is defined in `.github/workflows/test.yml` and includes:

1. Checking out the code
2. Setting up Node.js
3. Installing dependencies
4. Building the project
5. Running tests
6. Generating coverage report

## Adding New Tests

When adding new features or enhancers, follow these guidelines for adding tests:

1. For new enhancers, add tests in `__tests__/enhancers.test.ts`
2. For new tools, add tests in `__tests__/tools.test.ts`
3. Test both normal operation and error cases
4. Test with various option combinations
5. Update this documentation with new test cases
