import colors from "colors";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export enum LogLevel {
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    DEBUG = "DEBUG",
    CUSTOM = "CUSTOM",
    EMPTY = "EMPTY",
}

const ANSI_ESCAPE = /\x1B\[[0-9;]*m/g;

class Logger {
    private static instance: Logger;
    private logDir: string;

    private constructor() {
        this.logDir = join(process.cwd(), "logs");
        if (!existsSync(this.logDir)) {
            mkdirSync(this.logDir, { recursive: true });
        }
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getDateString(): string {
        return new Date().toISOString().split("T")[0];
    }

    private stripAnsi(str: string): string {
        return str.replace(ANSI_ESCAPE, "");
    }

    private writeToFile(level: string, message: string): void {
        try {
            const dateStr = this.getDateString();
            const filePath = join(this.logDir, `${dateStr}.log`);
            const line = `[${level}] [${this.getTimestamp()}] ${this.stripAnsi(message)}\n`;
            appendFileSync(filePath, line);
        } catch {
            // Silently fail — file logging should never crash the bot
        }
    }

    private formatMessage(level: LogLevel, message: string, optionalLevel?: string, ...args: any[]): string {
        const timestamp = this.getTimestamp();
        const formattedArgs = args.length > 0 ? ` ${args.join(" ")}` : "";

        if (optionalLevel) {
            return `[${timestamp}] ${optionalLevel}: ${message}${formattedArgs}`;
        }

        return `[${timestamp}] ${level}: ${message}${formattedArgs}`;
    }

    private colorize(level: LogLevel, message: string): string {
        switch (level) {
            case LogLevel.ERROR:
                return colors.red(message);
            case LogLevel.WARN:
                return colors.yellow(message);
            case LogLevel.INFO:
                return colors.blue(message);
            case LogLevel.DEBUG:
                return colors.gray(message);
            case LogLevel.CUSTOM:
                return colors.magenta(message);
            default:
                return message;
        }
    }

    public error(message: string, ...args: any[]): void {
        const formatted = this.formatMessage(LogLevel.ERROR, message, ...args);
        console.error(this.colorize(LogLevel.ERROR, formatted));
        this.writeToFile("ERROR", formatted);
    }

    public warn(message: string, ...args: any[]): void {
        const formatted = this.formatMessage(LogLevel.WARN, message, ...args);
        console.warn(this.colorize(LogLevel.WARN, formatted));
        this.writeToFile("WARN", formatted);
    }

    public info(message: string, ...args: any[]): void {
        const formatted = this.formatMessage(LogLevel.INFO, message, ...args);
        console.info(this.colorize(LogLevel.INFO, formatted));
        this.writeToFile("INFO", formatted);
    }

    public debug(message: string, ...args: any[]): void {
        if (process.env.DEBUG) {
            const formatted = this.formatMessage(LogLevel.DEBUG, message, ...args);
            console.debug(this.colorize(LogLevel.DEBUG, formatted));
            this.writeToFile("DEBUG", formatted);
        }
    }

    public custom(level: string, message: string, ...args: any[]): void {
        const formatted = this.formatMessage(LogLevel.EMPTY, message, level, ...args);
        console.log(this.colorize(LogLevel.CUSTOM, formatted));
        this.writeToFile(level, formatted);
    }
}

export default Logger;
