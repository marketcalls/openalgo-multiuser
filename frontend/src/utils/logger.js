// Logger configuration
const LOG_LEVELS = {
    TRACE: 'trace',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

// Default log level for development
const DEFAULT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;

class Logger {
    constructor(context) {
        this.context = context;
    }

    _formatMessage(message) {
        return `[${this.context}] ${message}`;
    }

    _log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const formattedMessage = this._formatMessage(message);
        
        // Store logs in localStorage for persistence
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.push({
            timestamp,
            level,
            context: this.context,
            message: typeof message === 'string' ? message : JSON.stringify(message),
            args: args.length ? args : undefined
        });
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.shift();
        }
        localStorage.setItem('app_logs', JSON.stringify(logs));

        // Console output with styling
        const styles = {
            debug: 'color: #2196F3',
            info: 'color: #4CAF50',
            warn: 'color: #FF9800',
            error: 'color: #f44336'
        };

        console[level](
            `%c${timestamp} [${level.toUpperCase()}] ${formattedMessage}`,
            styles[level] || '',
            ...args
        );
    }

    debug(message, ...args) {
        if (DEFAULT_LEVEL === LOG_LEVELS.DEBUG || DEFAULT_LEVEL === LOG_LEVELS.TRACE) {
            this._log('debug', message, ...args);
        }
    }

    info(message, ...args) {
        this._log('info', message, ...args);
    }

    warn(message, ...args) {
        this._log('warn', message, ...args);
    }

    error(message, ...args) {
        this._log('error', message, ...args);
    }

    // Utility method to get all logs
    static getLogs() {
        return JSON.parse(localStorage.getItem('app_logs') || '[]');
    }

    // Utility method to clear logs
    static clearLogs() {
        localStorage.removeItem('app_logs');
    }
}

// Export a function to create logger instances
export const createLogger = (context) => new Logger(context);

// Export utility functions
export const { getLogs, clearLogs } = Logger;
