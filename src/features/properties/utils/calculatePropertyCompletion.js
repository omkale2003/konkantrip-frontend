export function calculatePropertyCompletion({
  property,
  location,
  contacts,
  amenities,
  rooms,
  images,
  policies,
  documents,
}) {
  const sections = [];
  let totalPercentage = 0;

  // 1. Basic Details (15%)
  const hasBasicDetails = Boolean(property?.property_name && property?.property_type);
  if (hasBasicDetails) {
    totalPercentage += 15;
  }
  sections.push({
    step: 1,
    name: "Basic Details",
    isComplete: hasBasicDetails,
  });

  // 2. Location (15%)
  const hasLocation = Boolean(location?.address_line1);
  if (hasLocation) {
    totalPercentage += 15;
  }
  sections.push({
    step: 2,
    name: "Location",
    isComplete: hasLocation,
  });

  // 3. Contact (10%)
  const hasContact = Array.isArray(contacts) && contacts.some(c => c.contact_name);
  if (hasContact) {
    totalPercentage += 10;
  }
  sections.push({
    step: 3,
    name: "Contact",
    isComplete: hasContact,
  });

  // 4. Amenities (10%)
  const hasAmenities = Array.isArray(amenities) && amenities.length > 0;
  if (hasAmenities) {
    totalPercentage += 10;
  }
  sections.push({
    step: 4,
    name: "Amenities",
    isComplete: hasAmenities,
  });

  // 5. Rooms (20%)
  const hasRooms = Array.isArray(rooms) && rooms.length > 0;
  if (hasRooms) {
    totalPercentage += 20;
  }
  sections.push({
    step: 5,
    name: "Rooms",
    isComplete: hasRooms,
  });

  // 6. Photos (15%)
  const hasPhotos = Array.isArray(images) && images.length > 0 && images.some(img => img.is_cover_image === 1 || img.is_cover_image === true);
  if (hasPhotos) {
    totalPercentage += 15;
  }
  sections.push({
    step: 6,
    name: "Photos",
    isComplete: hasPhotos,
  });

  // 7. Policies (5%)
  const hasPolicies = Boolean(policies?.policy_id || policies?.check_in_from);
  if (hasPolicies) {
    totalPercentage += 5;
  }
  sections.push({
    step: 7,
    name: "Policies",
    isComplete: hasPolicies,
  });

  // 8. Documents (10%)
  const hasDocuments = Array.isArray(documents) && documents.length > 0;
  if (hasDocuments) {
    totalPercentage += 10;
  }
  sections.push({
    step: 8, // Wait, Documents is Step 7 in the UI, and Policies is Step 6 in UI...
    // Let me check AddPropertyPage.jsx to see the real steps.
    // Step 1: Basic
    // Step 2: Location
    // Step 3: Contact
    // Step 4: Amenities
    // Step 5: Photos (Wait!) Let's check AddPropertyPage.
    // In AddPropertyPage.jsx: 
    // currentStep === 5 -> PhotosStep
    // currentStep === 6 -> PoliciesStep
    // currentStep === 7 -> DocumentsStep
    // currentStep === 8 -> ReviewStep
    // Wait, where is Rooms? Rooms is NOT in the wizard! It's a separate page (/owner/rooms).
    // So the completion mapping to wizard step should navigate to the Rooms page if rooms is incomplete?
    // Let's hold off on assigning steps here, we will just return the data.
    name: "Documents",
    isComplete: hasDocuments,
  });

  // Fix the mapping based on actual steps in AddPropertyPage
  // 1: Basic Details
  // 2: Location
  // 3: Contact
  // 4: Amenities
  // 5: Photos
  // 6: Policies
  // 7: Documents
  // "Rooms" is not in the wizard. It is at `/owner/rooms`.
  const normalizedSections = [
    { key: 'basic', name: "Basic Details", isComplete: hasBasicDetails, wizardStep: 1 },
    { key: 'location', name: "Location", isComplete: hasLocation, wizardStep: 2 },
    { key: 'contact', name: "Contact", isComplete: hasContact, wizardStep: 3 },
    { key: 'amenities', name: "Amenities", isComplete: hasAmenities, wizardStep: 4 },
    { key: 'photos', name: "Photos", isComplete: hasPhotos, wizardStep: 5 },
    { key: 'policies', name: "Policies", isComplete: hasPolicies, wizardStep: 6 },
    { key: 'documents', name: "Documents", isComplete: hasDocuments, wizardStep: 7 },
    { key: 'rooms', name: "Rooms", isComplete: hasRooms, route: "/owner/rooms" },
  ];

  const completedSections = normalizedSections.filter((s) => s.isComplete);
  const incompleteSections = normalizedSections.filter((s) => !s.isComplete);
  const nextIncompleteSection = incompleteSections[0] || null;

  return {
    percentage: Math.min(100, Math.round(totalPercentage)),
    completedSections,
    incompleteSections,
    nextIncompleteSection,
  };
}
