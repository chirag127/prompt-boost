import { ContextEnhancer } from "../src/enhancers/context";
import { ExampleEnhancer } from "../src/enhancers/example";
import { InstructionEnhancer } from "../src/enhancers/instruction";
import { DomainKnowledgeEnhancer } from "../src/enhancers/domain-knowledge";

describe("Context Enhancer", () => {
    const enhancer = new ContextEnhancer();

    test("enhances prompt with default options", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt);

        expect(result.enhancedPrompt).toContain("CONTEXT:");
        expect(result.enhancedPrompt).toContain("PROMPT:");
        expect(result.enhancedPrompt).toContain(prompt);
        expect(result.metadata?.strategy).toBe("context");
    });

    test("extracts key terms from prompt", async () => {
        const prompt = "Explain how JavaScript and TypeScript are related";
        const result = await enhancer.enhance(prompt);

        expect(result.metadata?.keyTerms).toContain("JavaScript");
        expect(result.metadata?.keyTerms).toContain("TypeScript");
    });

    test("respects contextType option - technical", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            contextType: "technical",
        });

        expect(result.enhancedPrompt).toContain("Technical context");
        expect(result.metadata?.contextType).toBe("technical");
    });

    test("respects contextType option - creative", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            contextType: "creative",
        });

        expect(result.enhancedPrompt).toContain("Creative context");
        expect(result.metadata?.contextType).toBe("creative");
    });

    test("respects contextType option - analytical", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            contextType: "analytical",
        });

        expect(result.enhancedPrompt).toContain("Analytical context");
        expect(result.metadata?.contextType).toBe("analytical");
    });

    test("respects depth option - extensive", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { depth: "extensive" });

        expect(result.enhancedPrompt).toContain("Extended context");
        expect(result.metadata?.depth).toBe("extensive");
    });

    test("respects includeDefinitions option - false", async () => {
        const prompt = "Explain JavaScript programming";
        const result = await enhancer.enhance(prompt, {
            includeDefinitions: false,
        });

        // Should not include definitions for JavaScript
        expect(result.enhancedPrompt).not.toContain("JavaScript:");
    });

    test("respects includeBackground option - false", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            includeBackground: false,
        });

        expect(result.enhancedPrompt).not.toContain("Background:");
    });

    test("handles empty prompt", async () => {
        const prompt = "";
        const result = await enhancer.enhance(prompt);

        expect(result.enhancedPrompt).toContain("CONTEXT:");
        expect(result.enhancedPrompt).toContain("PROMPT:");
        expect(result.metadata?.strategy).toBe("context");
    });
});

describe("Example Enhancer", () => {
    const enhancer = new ExampleEnhancer();

    test("enhances prompt with default options", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt);

        expect(result.enhancedPrompt).toContain("EXAMPLES:");
        expect(result.enhancedPrompt).toContain("PROMPT:");
        expect(result.enhancedPrompt).toContain(prompt);
        expect(result.metadata?.strategy).toBe("example");
        expect(result.enhancedPrompt.match(/Example \d+:/g)?.length).toBe(2); // Default is 2 examples
    });

    test("respects exampleCount option", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { exampleCount: 3 });

        expect(result.enhancedPrompt.match(/Example \d+:/g)?.length).toBe(3);
    });

    test("respects exampleType option - simple", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            exampleType: "simple",
        });

        expect(result.enhancedPrompt).toContain("A simple example");
        expect(result.metadata?.exampleType).toBe("simple");
    });

    test("respects exampleType option - detailed", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            exampleType: "detailed",
        });

        expect(result.enhancedPrompt).toContain("A detailed example");
        expect(result.metadata?.exampleType).toBe("detailed");
    });

    test("respects exampleType option - diverse", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            exampleType: "diverse",
        });

        expect(result.enhancedPrompt).toContain("A diverse example");
        expect(result.metadata?.exampleType).toBe("diverse");
    });

    test("respects position option - before", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { position: "before" });

        // Examples should come before the prompt
        const examplesIndex = result.enhancedPrompt.indexOf("EXAMPLES:");
        const promptIndex = result.enhancedPrompt.indexOf("PROMPT:");
        expect(examplesIndex).toBeLessThan(promptIndex);
    });

    test("respects position option - after", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { position: "after" });

        // Prompt should come before examples
        expect(result.enhancedPrompt.indexOf(prompt)).toBeLessThan(
            result.enhancedPrompt.indexOf("EXAMPLES:")
        );
    });

    test("handles zero examples", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { exampleCount: 0 });

        // Should not add examples section if count is 0
        expect(result.enhancedPrompt).not.toContain("EXAMPLES:");
        expect(result.enhancedPrompt).toBe(prompt);
    });
});

describe("Instruction Enhancer", () => {
    const enhancer = new InstructionEnhancer();

    test("enhances prompt with default options", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt);

        expect(result.enhancedPrompt).toContain("INSTRUCTIONS:");
        expect(result.enhancedPrompt).toContain(prompt);
        expect(result.metadata?.strategy).toBe("instruction");
    });

    test("respects instructionType option - clarity", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            instructionType: "clarity",
        });

        expect(result.enhancedPrompt).toContain("clear and concise");
        expect(result.metadata?.instructionType).toBe("clarity");
    });

    test("respects instructionType option - reasoning", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            instructionType: "reasoning",
        });

        expect(result.enhancedPrompt).toContain("explain your reasoning");
        expect(result.metadata?.instructionType).toBe("reasoning");
    });

    test("respects instructionType option - structure", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            instructionType: "structure",
        });

        expect(result.enhancedPrompt).toContain("structure your response");
        expect(result.metadata?.instructionType).toBe("structure");
    });

    test("respects instructionType option - comprehensive", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            instructionType: "comprehensive",
        });

        expect(result.enhancedPrompt).toContain("comprehensive response");
        expect(result.metadata?.instructionType).toBe("comprehensive");
    });

    test("respects addStepByStep option - true", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { addStepByStep: true });

        expect(result.enhancedPrompt).toContain("Break down your approach");
        expect(result.metadata?.addedStepByStep).toBe(true);
    });

    test("respects addStepByStep option - false", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { addStepByStep: false });

        expect(result.enhancedPrompt).not.toContain("Break down your approach");
        expect(result.metadata?.addedStepByStep).toBe(false);
    });

    test("respects addReasoning option - true", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { addReasoning: true });

        expect(result.enhancedPrompt).toContain("explain the reasoning");
        expect(result.metadata?.addedReasoning).toBe(true);
    });

    test("respects addReasoning option - false", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { addReasoning: false });

        expect(result.enhancedPrompt).not.toContain("explain the reasoning");
        expect(result.metadata?.addedReasoning).toBe(false);
    });
});

describe("Domain Knowledge Enhancer", () => {
    const enhancer = new DomainKnowledgeEnhancer();

    test("enhances prompt with required domain parameter", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, { domain: "physics" });

        expect(result.enhancedPrompt).toContain("DOMAIN KNOWLEDGE:");
        expect(result.enhancedPrompt).toContain("Domain: physics");
        expect(result.enhancedPrompt).toContain("PROMPT:");
        expect(result.enhancedPrompt).toContain(prompt);
        expect(result.metadata?.strategy).toBe("domain-knowledge");
        expect(result.metadata?.domain).toBe("physics");
    });

    test("throws error without domain parameter", async () => {
        const prompt = "Explain quantum computing";
        // @ts-ignore - We're intentionally testing the error case with missing domain
        await expect(enhancer.enhance(prompt, {})).rejects.toThrow(
            "Domain must be specified"
        );
    });

    test("respects depth option - basic", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            depth: "basic",
        });

        expect(result.enhancedPrompt).toContain("Basic physics concepts");
        expect(result.metadata?.depth).toBe("basic");
    });

    test("respects depth option - intermediate", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            depth: "intermediate",
        });

        expect(result.enhancedPrompt).toContain(
            "Intermediate physics concepts"
        );
        expect(result.metadata?.depth).toBe("intermediate");
    });

    test("respects depth option - advanced", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            depth: "advanced",
        });

        expect(result.enhancedPrompt).toContain("Advanced physics concepts");
        expect(result.metadata?.depth).toBe("advanced");
    });

    test("respects includeTerminology option - true", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            includeTerminology: true,
        });

        expect(result.enhancedPrompt).toContain("physics Terminology");
    });

    test("respects includeTerminology option - false", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            includeTerminology: false,
        });

        expect(result.enhancedPrompt).not.toContain("physics Terminology");
    });

    test("respects includePrinciples option - true", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            includePrinciples: true,
        });

        expect(result.enhancedPrompt).toContain("physics Principles");
    });

    test("respects includePrinciples option - false", async () => {
        const prompt = "Explain quantum computing";
        const result = await enhancer.enhance(prompt, {
            domain: "physics",
            includePrinciples: false,
        });

        expect(result.enhancedPrompt).not.toContain("physics Principles");
    });
});
