// tslint:disable:no-console
import { LogLevel, LogContext, LogOptions, LogHandler, LogFormmater } from './logger.model';
import { configStore } from '../configuration/config.store';

const stackLoggers: Logger[] = [];

export class Logger {
    private filterLevel: LogLevel = null;
    private context: LogContext = null;
    private formatter: LogFormmater = null;
    private logHandler: LogHandler = null;
    private levelToSendServer: LogLevel = null;
    private traceToServer = true;
    id = null;

    constructor(options?: LogOptions) {
        this.useDefaults();
        if (options) {
            if (options.defaultLevel) {
                this.setLevel(options.defaultLevel);
            }
            if (options.context) {
                this.setContext(options.context);
            }
            if (options.formatter) {
                this.setFormmater(options.formatter);
            }
            if (options.handler) {
                this.setHandler(options.handler);
            }
            if (options.levelToSendServer) {
                this.setLevelToSendServer(options.levelToSendServer);
            }
        }
        this.id = Math.floor(Math.random() * 100000000 + 1);
    }

    useDefaults() {
        this.setLevel(LogLevel.DEBUG);
        this.setFormmater(this.createDefaultMessageFormatter());
        this.setHandler(this.createDefaultHandler());
        this.setLevelToSendServer(LogLevel.WARN);
    }

    setLevel(level: LogLevel) {
        this.filterLevel = level;
    }

    getLevel(): LogLevel {
        return this.filterLevel;
    }

    setContext(context: LogContext) {
        this.context = context;
    }

    setFormmater(formatter: LogFormmater) {
        this.formatter = formatter;
    }

    setHandler(logHandler: LogHandler) {
        this.logHandler = logHandler;
    }

    setLevelToSendServer(levelToSendServer: LogLevel) {
        this.levelToSendServer = levelToSendServer;
    }

    disableSendTracesToServer() {
        this.traceToServer = false;
    }
    enableSendTracesToServer() {
        this.traceToServer = true;
    }

    debug(...params) {
        this.invoke(LogLevel.DEBUG, arguments);
    }

    info(...params) {
        this.invoke(LogLevel.INFO, arguments);
    }

    warn(...params) {
        this.invoke(LogLevel.WARN, arguments);
    }

    error(...params) {
        this.invoke(LogLevel.ERROR, arguments);
    }

    trace(...params) {
        this.invoke(LogLevel.TRACE, arguments);
    }

    private invoke(level: LogLevel, message) {
        if (this.logHandler) {
            this.logHandler(message, level, this.context);
        }
    }

    private enabledFor(level: LogLevel) {
        return level >= this.filterLevel;
    }

    private enabledForSendToServer(level: LogLevel) {
        return this.traceToServer && level >= this.levelToSendServer;
    }

    private createDefaultMessageFormatter(): LogFormmater {
        return (messages: any[], context: LogContext) => {
            if (context && context.name) {
                messages.unshift('[' + context.name + ']');
            }
        };
    }

    private createDefaultHandler(): LogHandler {
        const invokeConsoleMethod = (hdlr, messages) => {
            Function.prototype.apply.call(hdlr, console, messages);
        };

        // Check for the presence of a logger.
        if (typeof console === 'undefined') {
            return () => {
                /* no console */
            };
        }

        return (messages, level) => {
            messages = Array.prototype.slice.call(messages);
            let hdlr = console.log;
            // Delegate through to custom warn/error loggers if present on the console.
            if (level === LogLevel.WARN && console.warn) {
                hdlr = console.warn;
            } else if (level === LogLevel.ERROR && console.error) {
                hdlr = console.error;
            } else if (level === LogLevel.INFO && console.info) {
                hdlr = console.info;
            } else if (level === LogLevel.DEBUG && console.debug) {
                hdlr = console.log;
            } else if (level === LogLevel.TRACE && console.trace) {
                hdlr = console.trace;
            }
            this.formatter(messages, this.context);
            // messages.push('| loggerId: ', this.id);

            if (this.enabledForSendToServer(level)) {
                propagateErrorToServer(messages);
            }
            if (this.enabledFor(level)) {
                invokeConsoleMethod(hdlr, messages);
            }
        };
    }
}

export function propagateErrorToServer(catchAppError: any[]) {
    let body = [];
    // TODO Must be fixed the body format as trace error service is defined
    if (catchAppError && catchAppError.length > 0) {
        body = catchAppError.map(err => err.toString());
    }
    if (configStore.enviromentAppVars && configStore.enviromentAppVars.traceEndpoint) {
        fetch(configStore.enviromentAppVars.traceEndpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export function SetupLogger(loggerName?: string) {
    return target => {
        loggerName = loggerName ? loggerName : target.name;
        const loggerForTarget = new Logger({
            context: {
                name: loggerName
            },
            defaultLevel:
                configStore.enviromentAppVars && configStore.enviromentAppVars.production
                    ? LogLevel.ERROR
                    : LogLevel.DEBUG
        });
        stackLoggers.push(loggerForTarget);
        target.prototype.logger = loggerForTarget;
    };
}

export function setLevelForStackLoggers(level: LogLevel) {
    for (const logger of stackLoggers) {
        logger.setLevel(level);
    }
}
