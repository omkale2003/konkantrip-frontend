import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { SIMULATOR_CONFIG } from "../../config/simulatorConfig";

export default function MessageInput({
  onSendMessage,
  disabled,
  mode = "customer",
  placeholderOverride
}) {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef(null);
  const maxLength = SIMULATOR_CONFIG.maxMessageLength || 500;

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputText]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInputText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isCustomer = mode === "customer";
  const defaultPlaceholder = isCustomer
    ? "Type an enquiry as Rahul Patil... (e.g. 'Is sea view room available?')"
    : "Type front desk response as Konkan Beach Resort...";

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        {/* Attachment & Emoji actions */}
        <div className="flex items-center gap-1 text-slate-400 pb-2">
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            title="Add attachment (Demo)"
            aria-label="Add attachment"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            title="Insert emoji (Demo)"
            aria-label="Insert emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            maxLength={maxLength}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholderOverride || defaultPlaceholder}
            className="w-full resize-none text-sm p-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-inner"
          />

          {/* Char counter pill */}
          {inputText.length > 250 && (
            <span
              className={`absolute right-3 bottom-2 text-[10px] ${
                inputText.length > 450 ? "text-rose-500 font-bold" : "text-slate-400"
              }`}
            >
              {inputText.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          disabled={!inputText.trim() || disabled}
          onClick={handleSend}
          className={`p-3 rounded-xl shadow-sm flex items-center justify-center transition-all cursor-pointer ${
            inputText.trim() && !disabled
              ? "bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          title={isCustomer ? "Send Customer Enquiry" : "Send Front Desk Response"}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-2 max-w-5xl mx-auto">
        <span>Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line</span>
        <span className="hidden sm:inline">
          Active Mode: <strong className="text-emerald-700 capitalize">{mode}</strong>
        </span>
      </div>
    </div>
  );
}
