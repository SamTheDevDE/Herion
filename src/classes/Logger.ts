import colors from 'colors';

export enum LogLevel {
    ERROR = 'ERROR',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    CUSTOM = 'CUSTOM',
    EMPTY = 'EMPTY'
}

class Logger {
    private static instance: Logger;
    
    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: LogLevel, message: string, optionalLevel?: String, ...args: any[]): string {
        const timestamp = new Date().toUTCString()
        const formattedArgs = args.length > 0 ? ` ${args.join(' ')}` : ''

        if (optionalLevel) {
            return `[${timestamp}] ${optionalLevel}: ${message}${formattedArgs}`
        }

        return `[${timestamp}] ${level}: ${message}${formattedArgs}`
    }


    private colorize(level: LogLevel, message: string): string {
        switch (level) {
            case LogLevel.ERROR:
                return colors.red(message);
            case LogLevel.INFO:
                return colors.blue(message);
            case LogLevel.DEBUG:
                return colors.yellow(message);
            case LogLevel.CUSTOM:
                return colors.magenta(message);
            default:
                return message;
        }
    }

    public error(message: string, ...args: any[]): void {
        console.error(this.colorize(LogLevel.ERROR, this.formatMessage(LogLevel.ERROR, message, ...args)));
    }

    public info(message: string, ...args: any[]): void {
        console.info(this.colorize(LogLevel.INFO, this.formatMessage(LogLevel.INFO, message, ...args)));
    }

    public debug(message: string, ...args: any[]): void {
        if (process.env.DEBUG) {
            console.debug(this.colorize(LogLevel.DEBUG, this.formatMessage(LogLevel.DEBUG, message, ...args)));
        }
    }

    public custom(level: string, message: string, ...args: any[]): void {
        console.log(this.colorize(LogLevel.CUSTOM, this.formatMessage(LogLevel.EMPTY, message, level, ...args)));
    }
}

export default Logger;