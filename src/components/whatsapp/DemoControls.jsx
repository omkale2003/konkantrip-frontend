import React from "react";
import {
  Settings,
  RotateCcw,
  Zap,
  Users,
  Clock,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Sliders,
  ShieldAlert,
  Power
} from "lucide-react";
import { DEMO_SCENARIOS } from "../../data/whatsappDemoData";

export default function DemoControls({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  mode,
  onToggleMode,
  autoReply,
  onToggleAutoReply,
  typingDelay,
  onChangeTypingDelay,
  onResetConversation,
  isSimulatorEnabled,
  onToggleSimulatorEnabled
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Simulator Demo Controls</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-slate-700 text-sm max-h-[75vh] overflow-y-auto">
          {/* Feature Enabled / Disabled Option (User requested: keep option to enable and disable) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Power className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Simulator Feature Status</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle simulation availability across KonkanTrip portal
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleSimulatorEnabled}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isSimulatorEnabled
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "bg-rose-700 text-white hover:bg-rose-800"
              }`}
            >
              {isSimulatorEnabled ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Scenario Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Preset Demonstration Scenarios
            </label>
            <select
              value={activeScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              {DEMO_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Selecting a scenario will populate an authentic dialogue thread.
            </p>
          </div>

          {/* Customer Mode vs Hotel Front Desk Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Perspective / Active Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => mode !== "customer" && onToggleMode()}
                className={`p-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  mode === "customer"
                    ? "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Customer View (Rahul)</span>
              </button>

              <button
                type="button"
                onClick={() => mode !== "hotel" && onToggleMode()}
                className={`p-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  mode === "hotel"
                    ? "bg-amber-100 border-amber-500 text-amber-900 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>Hotel Front Desk</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              In Hotel mode, stakeholders can type direct front desk responses manually.
            </p>
          </div>

          {/* Auto-Reply & Typing Delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            {/* Auto-Reply Toggle */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Auto-Reply Engine</span>
                <button
                  type="button"
                  onClick={onToggleAutoReply}
                  className={`text-xl transition-colors cursor-pointer ${
                    autoReply ? "text-emerald-700" : "text-slate-400"
                  }`}
                  aria-label="Toggle Auto-reply"
                >
                  {autoReply ? (
                    <ToggleRight className="w-7 h-7" />
                  ) : (
                    <ToggleLeft className="w-7 h-7" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {autoReply
                  ? "Hotel replies automatically to recognized keywords."
                  : "Hotel auto-replies paused."}
              </p>
            </div>

            {/* Delay Speed Selector */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Simulated Typing Delay
              </span>
              <select
                value={typingDelay}
                onChange={(e) => onChangeTypingDelay(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
              >
                <option value={600}>Fast (600ms)</option>
                <option value={1100}>Realistic (1100ms)</option>
                <option value={2000}>Relaxed (2000ms)</option>
              </select>
            </div>
          </div>

          {/* Reset Conversation */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                onResetConversation();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Reset Conversation to Clean State
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Apply & Return to Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
