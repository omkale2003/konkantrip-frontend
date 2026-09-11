/**
 * WhatsApp Simulator Configuration & Feature Flag
 * 
 * Allows enabling or disabling the WhatsApp enquiry simulator globally.
 * Can be controlled via environment variable VITE_ENABLE_WHATSAPP_SIMULATOR
 * or overridden via local storage for live stakeholder demonstrations.
 */

export const SIMULATOR_CONFIG = {
  // Flag to enable/disable simulator globally
  isFeatureEnabled: import.meta.env.VITE_ENABLE_WHATSAPP_SIMULATOR !== "false",
  
  // Local storage persistence key
  storageKey: "konkantrip_whatsapp_demo",

  // Simulator defaults
  defaultDelayMs: 1100,
  maxMessageLength: 500,
};
