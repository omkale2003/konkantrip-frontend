import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from "../api/properties.api.js";

export const useProperties = (params = {}) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
};

export const useProperty = (propertyId) => {
  return useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: Boolean(propertyId),
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProperty,

    onSuccess: (_, variables) => {
      const targetId = variables?.propertyId || variables?.id;
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      if (targetId) {
        queryClient.invalidateQueries({
          queryKey: ["properties", targetId],
        });
      }
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });
    },
  });
};