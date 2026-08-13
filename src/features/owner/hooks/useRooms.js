import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys.js";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomLookups,
  getRoomBeds,
  addRoomBed,
  updateRoomBed,
  deleteRoomBed,
  getRoomAmenities,
  addRoomAmenity,
  deleteRoomAmenity,
  getRoomFacilities,
  addRoomFacility,
  deleteRoomFacility,
  getRoomImages,
  uploadRoomImage,
  updateRoomImage,
  deleteRoomImage,
} from "../api/rooms.api.js";

// -- Lookups --
export const useRoomLookups = (lookupType) => {
  return useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.ROOMS.concat([lookupType]),
    queryFn: () => getRoomLookups(lookupType),
    enabled: Boolean(lookupType),
  });
};

// -- Core Room CRUD --
export const useRooms = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.LIST(params),
    queryFn: () => getRooms(params),
    enabled: Boolean(params.property_id), // Wait until we know the property
  });
};

export const useRoom = (roomId) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.DETAIL(roomId),
    queryFn: () => getRoomById(roomId),
    enabled: Boolean(roomId),
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
      if (variables.roomId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
        });
      }
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
    },
  });
};

// -- Room Beds --
export const useRoomBeds = (roomId) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.BEDS(roomId),
    queryFn: () => getRoomBeds(roomId),
    enabled: Boolean(roomId),
  });
};

export const useAddRoomBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRoomBed,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.BEDS(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId), // Also refresh room detail (it returns beds)
      });
    },
  });
};

export const useUpdateRoomBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoomBed,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.BEDS(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

export const useDeleteRoomBed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoomBed,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.BEDS(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

// -- Room Amenities --
export const useRoomAmenities = (roomId) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.AMENITIES(roomId),
    queryFn: () => getRoomAmenities(roomId),
    enabled: Boolean(roomId),
  });
};

export const useAddRoomAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRoomAmenity,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.AMENITIES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

export const useDeleteRoomAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoomAmenity,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.AMENITIES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

// -- Room Facilities --
export const useRoomFacilities = (roomId) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.FACILITIES(roomId),
    queryFn: () => getRoomFacilities(roomId),
    enabled: Boolean(roomId),
  });
};

export const useAddRoomFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRoomFacility,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.FACILITIES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

export const useDeleteRoomFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoomFacility,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.FACILITIES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

// -- Room Images --
export const useRoomImages = (roomId) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROOMS.IMAGES(roomId),
    queryFn: () => getRoomImages(roomId),
    enabled: Boolean(roomId),
  });
};

export const useUploadRoomImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadRoomImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.IMAGES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

export const useUpdateRoomImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoomImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.IMAGES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};

export const useDeleteRoomImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoomImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.IMAGES(variables.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(variables.roomId),
      });
    },
  });
};
