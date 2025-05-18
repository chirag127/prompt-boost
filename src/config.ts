import fs from "fs";
import path from "path";

// Default configuration
const defaultConfig = {
  logLevel: "info",
  enabledEnhancers: [], // Empty array means all enhancers are enabled
};

// Try to load configuration from file
let fileConfig = {};
try {
  const configPath = process.env.CONFIG_PATH || path.join(process.cwd(), "config.json");
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, "utf-8");
    fileConfig = JSON.parse(configContent);
  }
} catch (error) {
  console.error(`Error loading configuration: ${error instanceof Error ? error.message : String(error)}`);
}

// Merge default and file configurations
export const config = {
  ...defaultConfig,
  ...fileConfig,
};
