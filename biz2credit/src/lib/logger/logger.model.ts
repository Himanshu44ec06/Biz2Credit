export enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 5,
    ERROR = 8,
    OFF = 99
}


export interface LogContext {
    name: string;
}

export type LogHandler = (messages: any[], level: LogLevel, context: LogContext) => void;

export type LogFormmater = (messages: any[], context: LogContext) => void;

export interface LogOptions {
    defaultLevel?: LogLevel;
    formatter?: LogFormmater;
    context?: LogContext;
    handler?: LogHandler;
    levelToSendServer?: LogLevel;
}
