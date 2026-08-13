import { useMemo } from "react";
import { usePropertyLocation } from "./usePropertyLocations.js";
import { usePropertyContacts } from "./usePropertyContacts.js";
import { usePropertyAmenities } from "./usePropertyAmenities.js";
import { usePropertyImages } from "./usePropertyImages.js";
import { usePropertyPolicies } from "./usePropertyPolicies.js";
import { usePropertyDocuments } from "./usePropertyDocuments.js";
import { usePropertyRooms } from "./usePropertyRooms.js";
import { calculatePropertyCompletion } from "../utils/calculatePropertyCompletion.js";

export const usePropertyCompletion = (property) => {
  const propertyId = property?.property_id;

  const locationQuery = usePropertyLocation(propertyId);
  const contactsQuery = usePropertyContacts(propertyId);
  const amenitiesQuery = usePropertyAmenities(propertyId);
  const imagesQuery = usePropertyImages(propertyId);
  const policiesQuery = usePropertyPolicies(propertyId);
  const documentsQuery = usePropertyDocuments(propertyId);
  const roomsQuery = usePropertyRooms(propertyId);

  const isLoading =
    locationQuery.isLoading ||
    contactsQuery.isLoading ||
    amenitiesQuery.isLoading ||
    imagesQuery.isLoading ||
    policiesQuery.isLoading ||
    documentsQuery.isLoading ||
    roomsQuery.isLoading;

  const isError =
    locationQuery.isError ||
    contactsQuery.isError ||
    amenitiesQuery.isError ||
    imagesQuery.isError ||
    policiesQuery.isError ||
    documentsQuery.isError ||
    roomsQuery.isError;

  const completionData = useMemo(() => {
    if (!propertyId) return null;

    return calculatePropertyCompletion({
      property,
      location: locationQuery.data?.data,
      contacts: contactsQuery.data?.data,
      amenities: amenitiesQuery.data?.data,
      images: imagesQuery.data?.data,
      policies: policiesQuery.data?.data,
      documents: documentsQuery.data?.data,
      rooms: roomsQuery.data?.data,
    });
  }, [
    property,
    propertyId,
    locationQuery.data,
    contactsQuery.data,
    amenitiesQuery.data,
    imagesQuery.data,
    policiesQuery.data,
    documentsQuery.data,
    roomsQuery.data,
  ]);

  return {
    completionData,
    isLoading,
    isError,
  };
};
