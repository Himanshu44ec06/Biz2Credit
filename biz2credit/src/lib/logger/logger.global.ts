import { Logger } from './logger.class';
import { LogOptions } from './logger.model';

let logger: Logger = null;

export const setUpGlobalAppLogger = (options?: LogOptions) => {
    logger = new Logger(options);
};

export const getLogger = () => {
    if (!logger) {
        setUpGlobalAppLogger();
    }
    return logger;
};
