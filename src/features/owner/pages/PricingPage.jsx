import { useState, useMemo } from "react";
import {
  Tag,
  Zap,
  CalendarRange,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useProperties } from "../../properties/hooks/useProperties.js";
import { useRooms, useRoomLookups } from "../../rooms/hooks/useRooms.js";
import { usePricingRates } from "../../pricing/hooks/usePricing.js";

import PricingStatsCards from "../../pricing/components/PricingStatsCards.jsx";
import PricingFilters from "../../pricing/components/PricingFilters.jsx";
import RoomPricingTable from "../../pricing/components/RoomPricingTable.jsx";
import BulkPricingModal from "../../pricing/components/BulkPricingModal.jsx";
import SinglePriceEditModal from "../../pricing/components/SinglePriceEditModal.jsx";
import SeasonalRateModal from "../../pricing/components/SeasonalRateModal.jsx";
import SeasonalRatesTab from "../../pricing/components/SeasonalRatesTab.jsx";

function PricingPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState("rates"); // "rates" | "seasonal"

  // Data queries
  const propertiesQuery = useProperties();
  const roomsQuery = useRooms();
  const roomTypesQuery = useRoomLookups("room-types");
  const ratesQuery = usePricingRates({ include_inactive: "true" });

  const properties = propertiesQuery.data?.data || [];
  const rawRooms = roomsQuery.data?.data || [];
  const roomTypes = roomTypesQuery.data?.data || [];
  const rates = ratesQuery.data?.data || [];

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [pricingFilter, setPricingFilter] = useState("all"); // "all" | "discounted" | "standard"

  // Selection state for multi-room bulk updates
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  // Modals state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkModalDefaultSeasonal, setBulkModalDefaultSeasonal] = useState(false);
  const [isSingleEditModalOpen, setIsSingleEditModalOpen] = useState(false);
  const [singleEditRoom, setSingleEditRoom] = useState(null);

  const [isSeasonalModalOpen, setIsSeasonalModalOpen] = useState(false);
  const [seasonalRateInitialData, setSeasonalRateInitialData] = useState(null);

  // Success Toast / Notification message
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // Map property names to room items
  const roomsWithProperty = useMemo(() => {
    const propMap = new Map(properties.map((p) => [p.property_id, p.property_name]));
    return rawRooms.map((r) => ({
      ...r,
      property_name: propMap.get(r.property_id) || "Unknown Property",
    }));
  }, [rawRooms, properties]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return roomsWithProperty.filter((room) => {
      // Property filter
      if (selectedProperty && Number(room.property_id) !== Number(selectedProperty)) {
        return false;
      }

      // Room type filter
      if (selectedRoomType && Number(room.room_type_id) !== Number(selectedRoomType)) {
        return false;
      }

      // Pricing filter
      const base = Number(room.base_price) || 0;
      const discount =
        room.discount_price !== null && room.discount_price !== undefined
          ? Number(room.discount_price)
          : null;
      const hasDiscount = discount !== null && discount < base;

      if (pricingFilter === "discounted" && !hasDiscount) return false;
      if (pricingFilter === "standard" && hasDiscount) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = room.room_name?.toLowerCase().includes(term);
        const matchCode = room.room_code?.toLowerCase().includes(term);
        const matchProp = room.property_name?.toLowerCase().includes(term);
        if (!matchName && !matchCode && !matchProp) return false;
      }

      return true;
    });
  }, [roomsWithProperty, selectedProperty, selectedRoomType, pricingFilter, searchTerm]);

  // Selection handlers
  const handleToggleSelectRoom = (roomId) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAllRooms = (selectAll) => {
    if (selectAll) {
      setSelectedRoomIds(filteredRooms.map((r) => r.room_id));
    } else {
      setSelectedRoomIds([]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedProperty("");
    setSelectedRoomType("");
    setPricingFilter("all");
  };

  const handleOpenSingleEdit = (room) => {
    setSingleEditRoom(room);
    setIsSingleEditModalOpen(true);
  };

  const handleOpenSeasonalForRoom = (room) => {
    setSeasonalRateInitialData({
      property_id: room.property_id,
      room_id: room.room_id,
      base_price: room.base_price,
      discount_price: room.discount_price,
      extra_adult_price: room.extra_adult_price,
      extra_child_price: room.extra_child_price,
    });
    setIsSeasonalModalOpen(true);
  };

  const handleOpenSeasonalEdit = (rate) => {
    setSeasonalRateInitialData(rate);
    setIsSeasonalModalOpen(true);
  };

  const handleOpenNewSeasonal = () => {
    setSeasonalRateInitialData(null);
    setIsSeasonalModalOpen(true);
  };

  const isLoading =
    propertiesQuery.isLoading || roomsQuery.isLoading || ratesQuery.isLoading;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-800 animate-in slide-in-from-top-4 duration-150">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pricing & Rate Management
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Bulk Engine Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Set base rates, promotional discounts, and seasonal rules with instant bulk adjustments across your inventory.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              roomsQuery.refetch();
              ratesQuery.refetch();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Refresh pricing data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isLoading ? "animate-spin text-emerald-700" : "text-slate-400"
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
          >
            <Zap className="h-4 w-4 text-amber-300" />
            <span>
              {selectedRoomIds.length > 0
                ? `Bulk Adjust (${selectedRoomIds.length} Selected)`
                : "Bulk Price Update"}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <PricingStatsCards
        rooms={rawRooms}
        rates={rates}
        properties={properties}
      />

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <nav className="flex space-x-6" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("rates")}
            className={`flex items-center gap-2 border-b-2 py-3 text-xs font-bold transition ${
              activeTab === "rates"
                ? "border-emerald-700 text-emerald-700"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Room Base & Promotional Rates</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {rawRooms.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seasonal")}
            className={`flex items-center gap-2 border-b-2 py-3 text-xs font-bold transition ${
              activeTab === "seasonal"
                ? "border-emerald-700 text-emerald-700"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <CalendarRange className="h-4 w-4" />
            <span>Seasonal & Holiday Rules</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {rates.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content 1: Room Base Rates & Promo */}
      {activeTab === "rates" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <PricingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedProperty={selectedProperty}
            onPropertyChange={setSelectedProperty}
            selectedRoomType={selectedRoomType}
            onRoomTypeChange={setSelectedRoomType}
            pricingFilter={pricingFilter}
            onPricingFilterChange={setPricingFilter}
            properties={properties}
            roomTypes={roomTypes}
            selectedCount={selectedRoomIds.length}
            onOpenBulkModal={() => {
              setBulkModalDefaultSeasonal(false);
              setIsBulkModalOpen(true);
            }}
            onResetFilters={handleResetFilters}
          />

          {/* Pricing Table */}
          <RoomPricingTable
            rooms={filteredRooms}
            selectedRoomIds={selectedRoomIds}
            onToggleSelectRoom={handleToggleSelectRoom}
            onSelectAllRooms={handleSelectAllRooms}
            onOpenBulkModal={() => {
              setBulkModalDefaultSeasonal(false);
              setIsBulkModalOpen(true);
            }}
            onOpenSingleEditModal={handleOpenSingleEdit}
            onOpenSeasonalModal={handleOpenSeasonalForRoom}
          />
        </div>
      )}

      {/* Tab Content 2: Seasonal Rules */}
      {activeTab === "seasonal" && (
        <SeasonalRatesTab
          rates={rates}
          rooms={rawRooms}
          properties={properties}
          onOpenCreateModal={handleOpenNewSeasonal}
          onOpenEditModal={handleOpenSeasonalEdit}
          onOpenBulkModal={() => {
            setBulkModalDefaultSeasonal(true);
            setIsBulkModalOpen(true);
          }}
        />
      )}

      {/* Bulk Pricing Modal */}
      <BulkPricingModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        defaultSeasonal={bulkModalDefaultSeasonal}
        allRooms={roomsWithProperty}
        selectedRoomIds={selectedRoomIds}
        properties={properties}
        onSuccess={() => {
          showToast("Bulk price adjustments executed successfully!");
          setSelectedRoomIds([]);
        }}
      />

      {/* Single Room Price Edit Modal */}
      <SinglePriceEditModal
        isOpen={isSingleEditModalOpen}
        onClose={() => {
          setIsSingleEditModalOpen(false);
          setSingleEditRoom(null);
        }}
        room={singleEditRoom}
        onSuccess={() => {
          showToast("Room pricing updated successfully!");
        }}
      />

      {/* Seasonal Rate Modal */}
      <SeasonalRateModal
        isOpen={isSeasonalModalOpen}
        onClose={() => {
          setIsSeasonalModalOpen(false);
          setSeasonalRateInitialData(null);
        }}
        initialData={seasonalRateInitialData}
        properties={properties}
        rooms={rawRooms}
        onSuccess={() => {
          showToast("Seasonal rate rule saved successfully!");
        }}
      />
    </div>
  );
}

export default PricingPage;
