import { config } from "./config.js";

// Simple logger implementation
class Logger {
  private logLevel: string;
  
  constructor() {
    this.logLevel = config.logLevel || "info";
  }
  
  private shouldLog(level: string): boolean {
    const levels: Record<string, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    
    return (levels[level] ?? 0) <= (levels[this.logLevel] ?? 2);
  }
  
  error(message: string): void {
    if (this.shouldLog("error")) {
      console.error(`[ERROR] ${message}`);
    }
  }
  
  warn(message: string): void {
    if (this.shouldLog("warn")) {
      console.warn(`[WARN] ${message}`);
    }
  }
  
  info(message: string): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO] ${message}`);
    }
  }
  
  debug(message: string): void {
    if (this.shouldLog("debug")) {
      console.debug(`[DEBUG] ${message}`);
    }
  }
}

export const logger = new Logger();
