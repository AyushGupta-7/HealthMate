import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const writeToFile = (level, message, data = null) => {
  const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    data: data ? JSON.stringify(data) : null
  };
  
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

export const logger = {
  info: (message, data = null) => {
    console.log(`[${getTimestamp()}] INFO: ${message}`);
    writeToFile('INFO', message, data);
  },
  
  error: (message, error = null) => {
    console.error(`[${getTimestamp()}] ERROR: ${message}`, error);
    writeToFile('ERROR', message, error);
  },
  
  warn: (message, data = null) => {
    console.warn(`[${getTimestamp()}] WARN: ${message}`);
    writeToFile('WARN', message, data);
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${getTimestamp()}] DEBUG: ${message}`);
    }
    writeToFile('DEBUG', message, data);
  }
};