import React from "react";
import WhatsAppSimulator from "../components/whatsapp/WhatsAppSimulator";

/**
 * WhatsApp Simulator Page
 * Route: /whatsapp-simulator
 * 
 * Standalone customer-to-hotel WhatsApp enquiry simulation page.
 */
export default function WhatsAppSimulatorPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-950">
      <WhatsAppSimulator />
    </main>
  );
}
