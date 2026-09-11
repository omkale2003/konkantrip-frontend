import React, { useState, useEffect, useRef } from "react";
import ConversationSidebar from "./ConversationSidebar";
import ChatHeader from "./ChatHeader";
import BookingEnquiryCard from "./BookingEnquiryCard";
import MessageList from "./MessageList";
import QuickEnquiryActions from "./QuickEnquiryActions";
import MessageInput from "./MessageInput";
import HotelInfoDrawer from "./HotelInfoDrawer";
import BookingDemoModal from "./BookingDemoModal";
import DemoControls from "./DemoControls";
import {
  DEMO_PROPERTY,
  DEMO_ROOM,
  DEFAULT_BOOKING_ENQUIRY,
  DEMO_CUSTOMER,
  DEMO_SCENARIOS
} from "../../data/whatsappDemoData";
import {
  getScenarioMessages,
  simulateHotelReply,
  formatMessageTime
} from "../../services/whatsappMockService";
import { SIMULATOR_CONFIG } from "../../config/simulatorConfig";
import { Power, Sliders, Sparkles } from "lucide-react";

export default function WhatsAppSimulator() {
  // Load initial persisted state from localStorage if available
  const [isSimulatorEnabled, setIsSimulatorEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(SIMULATOR_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isSimulatorEnabled === "boolean") {
          return parsed.isSimulatorEnabled;
        }
      }
    } catch (e) {
      // Fallback to config
    }
    return SIMULATOR_CONFIG.isFeatureEnabled;
  });

  const [activeScenarioId, setActiveScenarioId] = useState(() => {
    try {
      const saved = localStorage.getItem(SIMULATOR_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeScenarioId) return parsed.activeScenarioId;
      }
    } catch (e) {}
    return "scenario_availability";
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(SIMULATOR_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          return parsed.messages;
        }
      }
    } catch (e) {}
    return getScenarioMessages("scenario_availability");
  });

  const [mode, setMode] = useState("customer"); // 'customer' | 'hotel'
  const [autoReply, setAutoReply] = useState(true);
  const [typingDelay, setTypingDelay] = useState(SIMULATOR_CONFIG.defaultDelayMs || 1100);
  const [isHotelTyping, setIsHotelTyping] = useState(false);
  const [isHotelInfoOpen, setIsHotelInfoOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [activeContactId, setActiveContactId] = useState("prop_konkan_beach_resort");
  const [mobileView, setMobileView] = useState("chat"); // 'sidebar' | 'chat'

  const typingTimeoutRef = useRef(null);
  const deliveryTimeoutRef = useRef(null);
  const readTimeoutRef = useRef(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        SIMULATOR_CONFIG.storageKey,
        JSON.stringify({
          isSimulatorEnabled,
          activeScenarioId,
          messages,
          mode,
          autoReply,
          typingDelay
        })
      );
    } catch (e) {
      console.warn("Unable to persist WhatsApp simulator state to localStorage:", e);
    }
  }, [isSimulatorEnabled, activeScenarioId, messages, mode, autoReply, typingDelay]);

  // Clean up any pending timeouts when unmounting
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (deliveryTimeoutRef.current) clearTimeout(deliveryTimeoutRef.current);
      if (readTimeoutRef.current) clearTimeout(readTimeoutRef.current);
    };
  }, []);

  // Handle customer or hotel sending a message
  const handleSendMessage = (text) => {
    const newMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const currentTime = formatMessageTime();

    if (mode === "customer") {
      const customerMsg = {
        id: newMessageId,
        sender: "customer",
        text,
        timestamp: currentTime,
        status: "sent"
      };

      setMessages((prev) => [...prev, customerMsg]);

      // Simulate WhatsApp message status delivery transitions:
      // 1. Sent (immediately)
      // 2. Delivered (~400ms)
      // 3. Read (~900ms)
      deliveryTimeoutRef.current = setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessageId && m.status === "sent" ? { ...m, status: "delivered" } : m
          )
        );
      }, 400);

      readTimeoutRef.current = setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessageId && m.status === "delivered" ? { ...m, status: "read" } : m
          )
        );
      }, 900);

      // Automated hotel response if autoReply is enabled
      if (autoReply) {
        // Start typing indicator after short pause
        setTimeout(() => {
          setIsHotelTyping(true);
        }, 350);

        typingTimeoutRef.current = simulateHotelReply(
          text,
          {
            property: DEMO_PROPERTY,
            room: DEMO_ROOM,
            bookingEnquiry: DEFAULT_BOOKING_ENQUIRY
          },
          (reply) => {
            setIsHotelTyping(false);
            const hotelReplyMsg = {
              id: `msg_hotel_${Date.now()}`,
              sender: "hotel",
              text: reply.text,
              timestamp: formatMessageTime(),
              status: "delivered",
              isBookingCTA: reply.isBookingCTA
            };
            setMessages((prev) => [...prev, hotelReplyMsg]);
          },
          typingDelay
        );
      }
    } else {
      // Manual Hotel Front Desk Reply
      const hotelMsg = {
        id: newMessageId,
        sender: "hotel",
        text,
        timestamp: currentTime,
        status: "delivered"
      };
      setMessages((prev) => [...prev, hotelMsg]);
    }
  };

  // Quick preset clicked
  const handleSelectPreset = (presetText) => {
    handleSendMessage(presetText);
  };

  // Reset conversation to currently active scenario baseline
  const handleResetConversation = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (deliveryTimeoutRef.current) clearTimeout(deliveryTimeoutRef.current);
    if (readTimeoutRef.current) clearTimeout(readTimeoutRef.current);

    setIsHotelTyping(false);
    const initial = getScenarioMessages(activeScenarioId);
    setMessages(initial);
  };

  // Switch scenario
  const handleSelectScenario = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsHotelTyping(false);
    setMessages(getScenarioMessages(scenarioId));
  };

  // Toggle mode
  const handleToggleMode = () => {
    setMode((prev) => (prev === "customer" ? "hotel" : "customer"));
  };

  // Last message snippet for sidebar
  const lastMsg = messages[messages.length - 1];
  const lastSnippet = lastMsg ? lastMsg.text : "";

  // If simulator is disabled via flag
  if (!isSimulatorEnabled) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <Power className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">WhatsApp Simulator Disabled</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The WhatsApp Customer Enquiry Simulator is currently toggled OFF in system settings.
            Stakeholders can re-enable this feature at any time to demonstrate the hotel guest enquiry workflow.
          </p>
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSimulatorEnabled(true)}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Enable WhatsApp Simulator Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden select-text antialiased">
      {/* Container simulating desktop WhatsApp layout */}
      <div className="flex w-full h-full bg-white relative">
        {/* Left Sidebar (approx. 30% desktop) */}
        <div
          className={`${
            mobileView === "sidebar" ? "block" : "hidden"
          } lg:block h-full shrink-0 z-10`}
        >
          <ConversationSidebar
            activeContactId={activeContactId}
            onSelectContact={(id) => {
              setActiveContactId(id);
              setMobileView("chat");
            }}
            latestMessageSnippet={lastSnippet}
            onOpenControls={() => setIsControlsOpen(true)}
          />
        </div>

        {/* Right Chat Panel (approx. 70% desktop) */}
        <div
          className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } lg:flex flex-1 flex-col h-full min-w-0 bg-slate-50 relative`}
        >
          {/* Chat Header */}
          <ChatHeader
            onOpenHotelInfo={() => setIsHotelInfoOpen(true)}
            onResetConversation={handleResetConversation}
            onBackToList={() => setMobileView("sidebar")}
            mode={mode}
            onToggleMode={handleToggleMode}
          />

          {/* Hotel Context Banner */}
          <BookingEnquiryCard onOpenHotelInfo={() => setIsHotelInfoOpen(true)} />

          {/* Messages Scroll Area */}
          <MessageList
            messages={messages}
            isHotelTyping={isHotelTyping}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
          />

          {/* Quick Action Pills (always associated with active property enquiry) */}
          <QuickEnquiryActions
            onSelectPreset={handleSelectPreset}
            disabled={isHotelTyping}
          />

          {/* Message Input Area */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isHotelTyping}
            mode={mode}
          />
        </div>
      </div>

      {/* Hotel Information Right Drawer */}
      <HotelInfoDrawer
        isOpen={isHotelInfoOpen}
        onClose={() => setIsHotelInfoOpen(false)}
      />

      {/* Booking Flow Demo Modal */}
      <BookingDemoModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg_booking_conf_${Date.now()}`,
              sender: "hotel",
              text: "✅ Booking request received! Booking reference #KT-TRK-2026-0920 has been generated. Our front desk manager has confirmed your reservation.",
              timestamp: formatMessageTime(),
              status: "delivered"
            }
          ]);
        }}
      />

      {/* Presenter Demo Controls Modal */}
      <DemoControls
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        mode={mode}
        onToggleMode={handleToggleMode}
        autoReply={autoReply}
        onToggleAutoReply={() => setAutoReply((prev) => !prev)}
        typingDelay={typingDelay}
        onChangeTypingDelay={setTypingDelay}
        onResetConversation={handleResetConversation}
        isSimulatorEnabled={isSimulatorEnabled}
        onToggleSimulatorEnabled={() => setIsSimulatorEnabled((prev) => !prev)}
      />
    </div>
  );
}
