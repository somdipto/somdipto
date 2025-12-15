export const Logger = {
  log: (...args: unknown[]) => {
    if (__DEV__) {
      console.log('[LOG]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (__DEV__) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (__DEV__) {
      console.error('[ERROR]', ...args);
    }
  },
};
