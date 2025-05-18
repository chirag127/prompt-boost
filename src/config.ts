import fs from "fs";
import path from "path";

// Configuration interface
export interface Config {
    // Default settings
    defaultContextDepth: number;
    defaultExampleCount: number;

    // Templates for formatting enhanced prompts
    contextTemplate: string;
    exampleTemplate: string;
    instructionTemplate: string;

    // Logging settings
    logLevel: "debug" | "info" | "warn" | "error";
    logToFile: boolean;
    logFilePath: string;
}

// Default configuration
const defaultConfig: Config = {
    // Default settings
    defaultContextDepth: 3,
    defaultExampleCount: 2,

    // Templates for formatting enhanced prompts
    contextTemplate: `Here is some relevant context that might help with your response:

{{CONTEXT}}

Now, please respond to the following:
{{PROMPT}}`,

    exampleTemplate: `Here are some examples that might help with your response:

{{EXAMPLES}}

Now, please respond to the following:
{{PROMPT}}`,

    instructionTemplate: `{{INSTRUCTIONS}}

Please respond to the following:
{{PROMPT}}`,

    // Logging settings
    logLevel: "info",
    logToFile: false,
    logFilePath: "./logs/prompt-boost.log",
};

// Cached configuration
let cachedConfig: Config = { ...defaultConfig };

/**
 * Loads the configuration from the config file or uses default values
 *
 * @returns The loaded configuration
 */
export function loadConfig(): Config {
    try {
        // Try to load config from file
        const configPath = path.resolve(
            process.cwd(),
            "prompt-boost-config.json"
        );

        if (fs.existsSync(configPath)) {
            const fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
            cachedConfig = { ...defaultConfig, ...fileConfig };
        }
    } catch (error) {
        console.warn(
            "Error loading config file, using default configuration:",
            error
        );
        // Use default config if file doesn't exist or there was an error
        cachedConfig = { ...defaultConfig };
    }

    return cachedConfig;
}

/**
 * Saves the current configuration to the config file
 *
 * @param config The configuration to save
 */
export function saveConfig(config: Partial<Config>): void {
    try {
        const currentConfig = loadConfig();
        const newConfig = { ...currentConfig, ...config };

        const configPath = path.resolve(
            process.cwd(),
            "prompt-boost-config.json"
        );
        fs.writeFileSync(
            configPath,
            JSON.stringify(newConfig, null, 2),
            "utf8"
        );

        // Update cached config
        cachedConfig = newConfig;
    } catch (error) {
        console.error("Error saving configuration:", error);
    }
}
