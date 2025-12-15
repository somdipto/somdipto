import { Logger } from './logger';

export const Analytics = {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    Logger.log(`[Analytics] Track: ${eventName}`, properties);
    // TODO: Connect to real analytics service
  },
  identify: (userId: string, traits?: Record<string, unknown>) => {
    Logger.log(`[Analytics] Identify: ${userId}`, traits);
  },
};
