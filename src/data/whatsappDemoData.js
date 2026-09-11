/**
 * Mock Data for KonkanTrip WhatsApp Customer Enquiry Simulator
 * 
 * Defines structured entities: customer profile, hotel property, room details,
 * booking context, and preset conversational enquiry scenarios.
 */

export const DEMO_CUSTOMER = {
  id: "cust_rahul_patil_01",
  name: "Rahul Patil",
  phone: "+91 98765 43210",
  email: "rahul.patil@example.com",
  city: "Pune, Maharashtra",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
};

export const DEMO_PROPERTY = {
  id: "prop_konkan_beach_resort",
  name: "Konkan Beach Resort",
  location: "Tarkarli, Maharashtra",
  fullAddress: "Wairy Bhutnath Beach Road, Tarkarli, Malvan, Sindhudurg, Maharashtra 416606",
  phone: "+91 94220 54321",
  whatsapp: "+91 94220 54321",
  status: "Online / Available for enquiries",
  rating: 4.6,
  reviewsCount: 128,
  checkInTime: "12:00 PM",
  checkOutTime: "10:00 AM",
  cancellationPolicy: "Free cancellation up to 48 hours before check-in. Non-refundable after that.",
  beachDistance: "500 metres (approx. 5 min walk through coconut grove)",
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80"
  ],
  amenities: [
    "Complimentary Wi-Fi",
    "Daily Breakfast Included",
    "Free On-site Parking",
    "Swimming Pool",
    "Air Conditioning",
    "Panoramic Sea View",
    "Malvani Seafood Dining",
    "24/7 Power Backup"
  ]
};

export const DEMO_ROOM = {
  id: "room_deluxe_sea_view",
  name: "Deluxe Sea View",
  pricePerNight: 4500,
  currency: "₹",
  maxOccupancy: 2,
  bedType: "1 King Size Bed",
  view: "Private Balcony with Sea & Coconut Grove View",
  includesBreakfast: true
};

export const DEFAULT_BOOKING_ENQUIRY = {
  checkIn: "2026-09-20",
  checkOut: "2026-09-22",
  formattedDates: "20 Sep 2026 – 22 Sep 2026",
  nights: 2,
  adults: 2,
  children: 0,
  roomType: "Deluxe Sea View",
  status: "Enquiry in Progress",
  pricePerNight: 4500,
  totalRoomAmount: 9000,
  taxGst: 1080,
  finalAmount: 10080
};

export const CONVERSATION_CONTACTS = [
  {
    id: "prop_konkan_beach_resort",
    name: "Konkan Beach Resort",
    location: "Tarkarli, Maharashtra",
    unread: 0,
    online: true,
    lastActive: "Just now",
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80",
    isPrimary: true
  },
  {
    id: "prop_malvan_heritage",
    name: "Malvan Heritage Homestay",
    location: "Chivla Beach, Malvan",
    unread: 1,
    online: false,
    lastActive: "2h ago",
    avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80",
    isPrimary: false
  },
  {
    id: "prop_devbagh_villa",
    name: "Devbagh Sangam View Villa",
    location: "Devbagh, Maharashtra",
    unread: 0,
    online: true,
    lastActive: "5h ago",
    avatar: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&auto=format&fit=crop&q=80",
    isPrimary: false
  }
];

export const QUICK_ENQUIRY_PRESETS = [
  {
    id: "check_avail",
    label: "Check Availability",
    icon: "Calendar",
    message: "Hi, is the Deluxe Sea View room available for 20 Sep to 22 Sep for 2 adults?"
  },
  {
    id: "ask_price",
    label: "Ask Price",
    icon: "Tag",
    message: "Could you please tell me the price for 2 nights for 2 adults?"
  },
  {
    id: "room_facilities",
    label: "Room Facilities",
    icon: "BedDouble",
    message: "What facilities and amenities are included in the Deluxe Sea View room?"
  },
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "Coffee",
    message: "Does the Deluxe Sea View room rate include complimentary breakfast?"
  },
  {
    id: "parking",
    label: "Parking",
    icon: "Car",
    message: "Is secure on-site vehicle parking available at your resort?"
  },
  {
    id: "early_checkin",
    label: "Early Check-in",
    icon: "Clock",
    message: "Can we request early check-in around 10:30 AM on 20 September?"
  },
  {
    id: "beach_distance",
    label: "Hotel Location",
    icon: "MapPin",
    message: "How far is the resort located from Tarkarli beach and scuba diving spots?"
  },
  {
    id: "couples_allowed",
    label: "Couples Allowed?",
    icon: "Users",
    message: "Do you allow couples with valid government-issued photo ID cards?"
  },
  {
    id: "book_now",
    label: "Book Now",
    icon: "CheckCircle",
    message: "I would like to book the Deluxe Sea View room for 20 Sep to 22 Sep for 2 adults."
  }
];

export const DEMO_SCENARIOS = [
  {
    id: "scenario_availability",
    title: "Scenario 1: Room Availability Enquiry",
    description: "Inquiring about dates, guest count, and sea view room availability.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "Hi, I found Konkan Beach Resort on KonkanTrip.",
        timestamp: "10:14 AM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Hello Rahul! Welcome to Konkan Beach Resort, Tarkarli. How can we assist your coastal holiday today?",
        timestamp: "10:15 AM",
        status: "delivered"
      },
      {
        id: "msg_init_3",
        sender: "customer",
        text: "I wanted to check availability for 20–22 September for 2 adults.",
        timestamp: "10:16 AM",
        status: "read"
      },
      {
        id: "msg_init_4",
        sender: "hotel",
        text: "Yes, our Deluxe Sea View category is currently available for those dates! It features a private balcony facing the Tarkarli coastline.",
        timestamp: "10:17 AM",
        status: "delivered"
      }
    ]
  },
  {
    id: "scenario_price",
    title: "Scenario 2: Price Enquiry",
    description: "Inquiring about per-night tariff, GST, and total for 2 nights.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "Hi, could you please tell me the price for 2 nights in the Deluxe Sea View room?",
        timestamp: "11:02 AM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Hello Rahul! The current tariff for the Deluxe Sea View room is ₹4,500 per night. For 2 nights (20–22 Sep), the total is ₹9,000 + 12% GST.",
        timestamp: "11:03 AM",
        status: "delivered"
      },
      {
        id: "msg_init_3",
        sender: "customer",
        text: "Does this tariff include breakfast for both guests?",
        timestamp: "11:04 AM",
        status: "read"
      },
      {
        id: "msg_init_4",
        sender: "hotel",
        text: "Yes, absolutely! Daily traditional Malvani & continental buffet breakfast is fully complimentary with this rate.",
        timestamp: "11:05 AM",
        status: "delivered"
      }
    ]
  },
  {
    id: "scenario_facilities",
    title: "Scenario 3: Facilities Enquiry",
    description: "Checking swimming pool, Wi-Fi speed, parking, and restaurant.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "Hello, we are planning a weekend trip. Is swimming pool and private parking available?",
        timestamp: "09:30 AM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Good morning Rahul! Yes, we offer an outdoor swimming pool overlooking the palm trees (7:00 AM – 8:00 PM) and free gated parking with CCTV security.",
        timestamp: "09:31 AM",
        status: "delivered"
      },
      {
        id: "msg_init_3",
        sender: "customer",
        text: "Is there strong Wi-Fi as I might need to attend a brief remote meeting?",
        timestamp: "09:32 AM",
        status: "read"
      },
      {
        id: "msg_init_4",
        sender: "hotel",
        text: "Yes, high-speed fiber Wi-Fi (100+ Mbps) covers all guest rooms and public lounge areas with 100% generator power backup.",
        timestamp: "09:33 AM",
        status: "delivered"
      }
    ]
  },
  {
    id: "scenario_early_checkin",
    title: "Scenario 4: Early Check-in Enquiry",
    description: "Requesting early room access on arrival morning from Mumbai.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "Hi, our overnight train reaches Kudal early in the morning. Can we check in around 10:00 AM?",
        timestamp: "01:20 PM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Hello Rahul! Our standard check-in time is 12:00 PM. Early check-in is subject to room availability upon departure of previous guests.",
        timestamp: "01:21 PM",
        status: "delivered"
      },
      {
        id: "msg_init_3",
        sender: "hotel",
        text: "However, if the Deluxe Sea View room is ready when you arrive, we are pleased to offer complimentary early check-in. You can also relax in our poolside lounge and freshen up.",
        timestamp: "01:22 PM",
        status: "delivered"
      }
    ]
  },
  {
    id: "scenario_booking",
    title: "Scenario 5: Booking Enquiry",
    description: "Direct request to reserve the room with interactive booking CTA.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "I would like to book the Deluxe Sea View room for 20 Sep to 22 Sep for 2 adults.",
        timestamp: "03:10 PM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Thank you Rahul! Your booking enquiry has been received for Konkan Beach Resort. Please continue to booking confirmation.",
        timestamp: "03:11 PM",
        status: "delivered",
        isBookingCTA: true
      }
    ]
  },
  {
    id: "scenario_cancellation",
    title: "Scenario 6: Cancellation Enquiry",
    description: "Understanding refund and modification rules in case of emergency.",
    initialMessages: [
      {
        id: "msg_init_1",
        sender: "customer",
        text: "What is your cancellation policy if our travel plans change?",
        timestamp: "04:45 PM",
        status: "read"
      },
      {
        id: "msg_init_2",
        sender: "hotel",
        text: "Hello Rahul! We offer 100% free cancellation up to 48 hours before your check-in date (12:00 PM, 18 Sep). Full refund is credited directly to your original payment method.",
        timestamp: "04:46 PM",
        status: "delivered"
      },
      {
        id: "msg_init_3",
        sender: "customer",
        text: "Can dates be rescheduled free of charge if informed earlier?",
        timestamp: "04:47 PM",
        status: "read"
      },
      {
        id: "msg_init_4",
        sender: "hotel",
        text: "Yes, date modifications are allowed without penalty up to 3 days prior, subject to room rate differences during peak season.",
        timestamp: "04:48 PM",
        status: "delivered"
      }
    ]
  }
];
